package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v3;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.ISellerService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentOutputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.ComponentInputDTOMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.ComponentOutputDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/v3/components")
public class ComponentRestControllerV3 {

    @Autowired
    IComponentService componentService;

    @Autowired
    ISellerService sellerService;

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
            Seller sellerByName = sellerService.findByName(componentInputDTO.getSellerName());
            if (sellerByName != null) {
                Component component = inputDTOMapper.toDomain(componentInputDTO);
                component.setSeller(sellerByName);
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
    public ResponseEntity<?> update(@RequestBody ComponentInputDTO componentInputDTO, @PathVariable("id") Long id) {
        if (componentInputDTO != null && id != null) {
            Component byId = componentService.findById(id);
            if (byId != null) {
                Seller sellerByName = sellerService.findByName(componentInputDTO.getSellerName());
                if (sellerByName != null) {
                    Component component = inputDTOMapper.toDomain(componentInputDTO);
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
