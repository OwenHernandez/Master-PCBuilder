package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.ISellerService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.ComponentInputDTOMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.ComponentOutputDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/v2/components")
public class ComponentRestControllerV2 {

    @Autowired
    IComponentService componentService;

    @Autowired
    ISellerService sellerService;

    @Autowired
    IUserService userService;

    ComponentInputDTOMapper inputDTOMapper = new ComponentInputDTOMapper();

    ComponentOutputDTOMapper outputDTOMapper = new ComponentOutputDTOMapper();

    @GetMapping
    public ResponseEntity<?> getAllOrByName(@RequestParam(value = "name", required = false) String name) {
        if (name == null) {
            List<Component> all = componentService.findAll();
            List<ComponentInputDTO> allDTO = new ArrayList<>();
            for (Component comp : all) {
                ComponentInputDTO compOutputDTO = outputDTOMapper.toDTO(comp);
                allDTO.add(compOutputDTO);
            }
            return ResponseEntity.ok(allDTO);
        } else {
            List<Component> components = componentService.findByName(name);
            List<ComponentInputDTO> componentsDTO = new ArrayList<>();
            if (components != null) {
                for (Component comp : components) {
                    ComponentInputDTO compOutputDTO = outputDTOMapper.toDTO(comp);
                    componentsDTO.add(compOutputDTO);
                }

                return ResponseEntity.ok(componentsDTO);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The requested components were not found");
            }
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
                    Component component = inputDTOMapper.toDomain(componentInputDTO);
                    component.setSeller(sellerByName);
                    component.setUserWhoCreated(userByNick);
                    Component save = componentService.save(component);

                    if (save != null) {
                        ComponentInputDTO compOutputDTO = outputDTOMapper.toDTO(save);
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

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") Long id) {
        if (id != null) {
            Component byId = componentService.findById(id);
            if (byId != null) {
                ComponentInputDTO compOutputDTO = outputDTOMapper.toDTO(byId);
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
                            Component component = inputDTOMapper.toDomain(componentInputDTO);
                            component.setId(id);
                            component.setSeller(sellerByName);
                            component.setUserWhoCreated(userByNick);
                            boolean ok = componentService.update(component);
                            if (ok) {
                                return ResponseEntity.ok("Component successfully updated");
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
}