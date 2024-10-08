package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.PriceHistory;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IPriceHistoryService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.ISellerService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.FileStorageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.*;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.ComponentDTOMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service.EventRunner;
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
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

@RestController
@CrossOrigin
@RequestMapping("/api/v2/components")
public class ComponentRestControllerV2 {
    Logger log;
    @Autowired
    private IComponentService componentService;

    @Autowired
    private ISellerService sellerService;

    @Autowired
    private IUserService userService;

    @Autowired
    private FileStorageService storageService;

    @Autowired
    IPriceHistoryService priceHistoryService;
    private final ComponentDTOMapper mapper = new ComponentDTOMapper();

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
                    ComponentOutputDTO compOutputDTO = mapper.toDTO(comp);
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
                    ComponentOutputDTO compOutputDTO = mapper.toDTO(comp);
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
                ComponentOutputDTO compOutputDTO = mapper.toDTO(comp);
                allDTO.add(compOutputDTO);
            }
            return ResponseEntity.ok(allDTO);
        }
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody ComponentInputDTO componentInputDTO) {
        log= Logger.getLogger("ComponentRestControllerV2");
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
                    String newFileName = storageService.save(componentInputDTO.getName()  + "_" + componentInputDTO.getImage(), photoBytes);
                    componentInputDTO.setImage(newFileName);
                    Component component = mapper.toDomain(componentInputDTO);
                    component.setSeller(sellerByName);
                    component.setUserWhoCreated(userByNick);
                    try {
                        List<Component> components = componentService.searchEbay(component.getName());
                        log.info("Searching in ebay");
                        if (components != null && !components.isEmpty()) {
                            log.info("Components found in ebay: " + components.size());
                            component.setEbay_price(components.get(1).getEbay_price());
                        }
                    } catch (Exception e) {
                        log= Logger.getLogger("Error while searching in ebay");
                        log.info(e.getMessage());
                        component.setEbay_price(0.0);
                    }
                    try {
                        List<Component> components1 = componentService.searchAmazon(component.getName());
                        log.info("Searching in amazon");
                        if (components1 != null && !components1.isEmpty()) {
                            log.info("Components found in amazon: " + components1.size());
                            component.setAmazon_price(components1.get(0).getAmazon_price());
                        }
                    } catch (Exception e) {
                        log= Logger.getLogger("Error while searching in amazon");
                        log.info(e.getMessage());
                        component.setAmazon_price(0.0);
                    }
                    component.setPriceHistories(new ArrayList<>());
                    Component save = componentService.save(component);
                    try{
                        componentService.updatePrices(save.getId(), save.getAmazon_price(), save.getEbay_price());

                        PriceHistory priceHistory = new PriceHistory();
                        priceHistory.setAmazonPrice(save.getAmazon_price());
                        priceHistory.setEbayPrice(save.getEbay_price());
                        priceHistory.setPrice(save.getPrice());
                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                        Date date = new Date(Instant.now().getEpochSecond());
                        priceHistory.setDate(sdf.format(date));

                        priceHistoryService.saveManual(priceHistory.getAmazonPrice(), save.getId(), Instant.now().getEpochSecond(), priceHistory.getEbayPrice(), priceHistory.getPrice());
                        save.getPriceHistories().add(priceHistory);
                        componentService.save(save);
                    }catch (Exception e){
                        log= Logger.getLogger("Error");
                        log.info(e.getMessage());
                    }

                    if (save != null) {
                        ComponentOutputDTO compOutputDTO = mapper.toDTO(save);
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

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") Long id) {
        if (id != null) {
            Component byId = componentService.findById(id);
            if (byId != null) {
                ComponentOutputDTO compOutputDTO = mapper.toDTO(byId);
                return ResponseEntity.ok(compOutputDTO);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The component does not exist");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The id must not be null");
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
                            if (componentInputDTO.getImage64() != null) {
                                String codedPicture = componentInputDTO.getImage64();
                                byte[] photoBytes = Base64.getDecoder().decode(codedPicture);
                                String newFileName = storageService.save(componentInputDTO.getName()  + "_" + componentInputDTO.getImage(), photoBytes);
                                componentInputDTO.setImage(newFileName);
                            } else {
                                componentInputDTO.setImage(byId.getImage());
                            }
                            Component component = mapper.toDomain(componentInputDTO);
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
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The requested components were not found");
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
}
