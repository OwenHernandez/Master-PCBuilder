package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v3;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.ISellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

class ComponentDTO {
    private String description;

    private String image;

    private String name;

    private double price;

    private String sellerName;

    public ComponentDTO() {}

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getSellerName() {
        return sellerName;
    }

    public void setSellerName(String sellerName) {
        this.sellerName = sellerName;
    }
}

class ComponentDTOMapper {
    public Component toDomain(ComponentDTO componentDTO) {
        Component component = new Component();
        component.setName(componentDTO.getName());
        component.setImage(componentDTO.getImage());
        component.setDescription(componentDTO.getDescription());
        component.setPrice(componentDTO.getPrice());

        return component;
    }

    public ComponentDTO toDTO(Component component) {
        ComponentDTO componentDTO = new ComponentDTO();
        componentDTO.setName(component.getName());
        componentDTO.setImage(component.getImage());
        componentDTO.setDescription(component.getDescription());
        componentDTO.setPrice(component.getPrice());
        componentDTO.setSellerName(component.getSeller().getName());

        return componentDTO;
    }
}

@RestController
@CrossOrigin
@RequestMapping("/api/v3/components")
public class ComponentRestControllerV3 {

    @Autowired
    IComponentService componentService;

    @Autowired
    ISellerService sellerService;

    ComponentDTOMapper mapper = new ComponentDTOMapper();

    @GetMapping
    public ResponseEntity<?> getAllOrByName(@RequestParam(value = "name", required = false) String name) {
        if (name == null) {
            List<Component> all = componentService.findAll();
            return ResponseEntity.ok(all);
        } else {
            List<Component> components = componentService.findByName(name);
            if (components == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The requested components were not found");
            } else {
                return ResponseEntity.ok(components);
            }
        }
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody ComponentDTO componentDTO) {
        if (componentDTO != null) {
            Seller sellerByName = sellerService.findByName(componentDTO.getSellerName());
            if (sellerByName != null) {
                Component component = mapper.toDomain(componentDTO);
                component.setSeller(sellerByName);
                Component save = componentService.save(component);

                if (save != null) {
                    return ResponseEntity.ok(save);
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                }
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The seller must exist");
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
                return ResponseEntity.ok(byId);
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
            Component byId = componentService.findById(id);
            if (byId != null) {
                boolean ok = componentService.deleteById(id);
                if (ok) {
                    return ResponseEntity.ok("Component successfully deleted");
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

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody ComponentDTO componentDTO, @PathVariable("id") Long id) {
        if (componentDTO != null && id != null) {
            Component byId = componentService.findById(id);
            if (byId != null) {
                Seller sellerByName = sellerService.findByName(componentDTO.getSellerName());
                if (sellerByName != null) {
                    Component component = mapper.toDomain(componentDTO);
                    component.setId(id);
                    component.setSeller(sellerByName);
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
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The component does not exist");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The id must not be null");
        }
    }
}
