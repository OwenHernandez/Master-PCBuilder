package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.ISellerService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.FileStorageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.*;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.ComponentDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.logging.Logger;

@RestController
@CrossOrigin
@RequestMapping("/api/v2/components")
public class ComponentRestControllerV2 {


    @Autowired
    private IComponentService componentService;

    @Autowired
    private ISellerService sellerService;

    @Autowired
    private IUserService userService;

    @Autowired
    private FileStorageService storageService;

    private final ComponentDTOMapper componentDTOMapper = new ComponentDTOMapper();

    @GetMapping
    public ResponseEntity<?> get(@RequestParam(value = "name", required = false) String name, @RequestParam(value = "userId", required = false) Long userId) {
        Object principal =
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User userByNick = userService.findByNick(username);
        if (userByNick == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
        }
        if (name != null) {
            List<Component> components = componentService.findByName(name);
            List<ComponentOutputDTO> componentsDTO = new ArrayList<>();
            if (components != null) {
                for (Component comp : components) {
                    ComponentOutputDTO compOutputDTO = componentDTOMapper.toDTO(comp);
                    componentsDTO.add(compOutputDTO);
                }

                return ResponseEntity.ok(componentsDTO);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The requested components were not found");
            }
        } else if (userId != null) {
            List<Component> components = componentService.findByUserId(userId);
            List<ComponentOutputDTO> componentsDTO = new ArrayList<>();
            if (components != null) {
                for (Component comp : components) {
                    ComponentOutputDTO compOutputDTO = componentDTOMapper.toDTO(comp);
                    componentsDTO.add(compOutputDTO);
                }

                return ResponseEntity.ok(componentsDTO);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The requested components were not found");
            }
        } else {
            List<Component> all = componentService.findAll();
            List<ComponentOutputDTO> allDTO = new ArrayList<>();
            for (Component comp : all) {
                ComponentOutputDTO compOutputDTO = componentDTOMapper.toDTO(comp);
                allDTO.add(compOutputDTO);
            }
            return ResponseEntity.ok(allDTO);
        }
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody ComponentInputDTO componentInputDTO) {
        if (componentInputDTO != null) {
            Object principal =
                    SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = ((UserDetails) principal).getUsername();
            User userByNick = userService.findByNick(username);
            if (userByNick != null) {
                Seller sellerByName = sellerService.findByName(componentInputDTO.getSellerName());
                if (sellerByName != null) {
                    String codedPicture = componentInputDTO.getImage64();
                    byte[] photoBytes = Base64.getDecoder().decode(codedPicture);
                    String newFileName = storageService.save(userByNick.getNick() + "_" + componentInputDTO.getImage(), photoBytes);
                    componentInputDTO.setImage(newFileName);
                    Component component = componentDTOMapper.toDomain(componentInputDTO);
                    component.setSeller(sellerByName);
                    component.setUserWhoCreated(userByNick);
                    component.setAmazon_price(componentInputDTO.getAmazon_price());
                    component.setEbay_price(componentInputDTO.getEbay_price());
                    Component save = componentService.save(component);

                    if (save != null) {
                        ComponentOutputDTO compOutputDTO = componentDTOMapper.toDTO(save);
                        return ResponseEntity.ok(compOutputDTO);
                    } else {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                    }
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The seller must exist");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The body must not be null");
        }
    }

    @GetMapping("/img/{id}/{filename}")
    public ResponseEntity<?> getFiles(@PathVariable("id") long compId, @PathVariable("filename") String filename) {
        Component byId = componentService.findById(compId);
        if (byId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The component does not exist");
        }
        Object principal =
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User userByNick = userService.findByNick(username);

        if (userByNick != null) {
            if (!byId.getImage().equals(filename)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("That is not the right image");
            }
            Resource resource = null;
            try {
                resource = storageService.get(filename);
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The file does not exist");
            }
            String contentType = null;
            try {
                contentType = URLConnection.guessContentTypeFromStream(resource.getInputStream());
            } catch (IOException ex) {
                System.out.println("Could not determine file type.");
            }
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            String headerValue = "attachment; filename=\"" + resource.getFilename() + "\"";
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(
                            org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                            headerValue
                    ).body(resource);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        if (id != null) {
            Object principal =
                    SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = ((UserDetails) principal).getUsername();
            User userByNick = userService.findByNick(username);
            if (userByNick != null) {
                Component byId = componentService.findById(id);
                if (byId != null) {
                    if (byId.getUserWhoCreated().getId() == userByNick.getId()) {
                        boolean ok = componentService.deleteById(id);
                        if (ok) {
                            return ResponseEntity.ok("Component successfully deleted");
                        } else {
                            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                        }
                    } else {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("That is not your component");
                    }
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The component does not exist");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The id must not be null");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody ComponentInputDTO componentInputDTO, @PathVariable("id") Long id) {
        if (componentInputDTO != null && id != null) {
            Object principal =
                    SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = ((UserDetails) principal).getUsername();
            User userByNick = userService.findByNick(username);
            if (userByNick != null) {
                Component byId = componentService.findById(id);
                if (byId != null) {
                    if (byId.getUserWhoCreated().getId() == userByNick.getId()) {
                        Seller sellerByName = sellerService.findByName(componentInputDTO.getSellerName());
                        if (sellerByName != null) {
                            String codedPicture = componentInputDTO.getImage64();
                            byte[] photoBytes = Base64.getDecoder().decode(codedPicture);
                            String newFileName = storageService.save(userByNick.getNick() + "_" + componentInputDTO.getImage(), photoBytes);
                            componentInputDTO.setImage(newFileName);
                            Component component = componentDTOMapper.toDomain(componentInputDTO);
                            component.setId(id);
                            component.setSeller(sellerByName);
                            component.setEbay_price(componentInputDTO.getEbay_price());
                            component.setAmazon_price(componentInputDTO.getAmazon_price());
                            component.setUserWhoCreated(userByNick);
                            component.setUsersWhoWants(byId.getUsersWhoWants());
                            boolean ok = componentService.update(component);
                            if (ok) {
                                return ResponseEntity.ok("Component Successfully updated");
                            } else {
                                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                            }
                        } else {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The seller must exist");
                        }
                    } else {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("That is not your component");
                    }
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The component does not exist");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The id must not be null");
        }
    }

    @GetMapping("/ebay/{search}")
    public ResponseEntity<?> searchEbay(@PathVariable("search") String search) {
        if (search != null) {
            List<Component> components = componentService.searchEbay(search);
            if (components != null && !components.isEmpty()) {
                return ResponseEntity.ok(components);
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The search must not be null");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The requested components were not found");
    }

    @GetMapping("/amazon/{search}")
    public ResponseEntity<?> searchAmazon(@PathVariable("search") String search) {
        if (search != null) {
            List<Component> components = componentService.searchAmazon(search);
            if (components != null && !components.isEmpty()) {
                return ResponseEntity.ok(components);
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The search must not be null");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The requested components were not found");
    }

    @PutMapping("/price/{id}")
    public ResponseEntity<?> updatePrice(@RequestBody ComponentPriceInputDTO componentInputDTO, @PathVariable("id") Long id) {
        if (componentInputDTO != null && id != null) {
            Component byId = componentService.findById(id);
            if (byId != null) {
                Component component = new Component();
                component.setName(componentInputDTO.getName());
                component.setImage(byId.getImage());
                component.setDescription(componentInputDTO.getDescription());
                component.setType(byId.getType());
                component.setPrice(byId.getPrice());
                component.setEbay_price(componentInputDTO.getEbay_price());
                component.setAmazon_price(componentInputDTO.getAmazon_price());
                component.setId(byId.getId());
                component.setSeller(byId.getSeller());
                component.setUsersWhoWants(byId.getUsersWhoWants());
                boolean ok = componentService.update(component);
                if (ok) {
                    return ResponseEntity.ok("Component Successfully updated");
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                }

            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The component does not exist");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The id must not be null");
        }
    }


}
