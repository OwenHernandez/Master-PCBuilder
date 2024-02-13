package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v3;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.ISellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

class SellerDTO {
    private String name;

    private String image;

    public SellerDTO() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}

class SellerDTOMapper {
    public Seller toDomain(SellerDTO sellerDTO) {
        Seller seller = new Seller();
        seller.setName(sellerDTO.getName());
        seller.setImage(sellerDTO.getImage());

        return seller;
    }

    public SellerDTO toDTO(Seller seller) {
        SellerDTO sellerDTO = new SellerDTO();
        sellerDTO.setName(seller.getName());
        sellerDTO.setImage(seller.getImage());

        return sellerDTO;
    }
}

@RestController
@CrossOrigin
@RequestMapping("/api/v3/sellers")
public class SellerRestControllerV3 {

    @Autowired
    ISellerService sellerService;

    SellerDTOMapper mapper;

    @GetMapping
    public ResponseEntity<?> getAllOrByName(@RequestParam(value = "name", required = false) String name) {
        if (name == null) {
            List<Seller> all = sellerService.findAll();
            return ResponseEntity.ok(all);
        } else {
            Seller seller = sellerService.findByName(name);
            if (seller == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The requested seller was not found");
            } else {
                return ResponseEntity.ok(seller);
            }
        }
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody SellerDTO sellerDTO) {
        mapper = new SellerDTOMapper();
        if (sellerDTO != null) {
            Seller seller = mapper.toDomain(sellerDTO);
            Seller save = sellerService.save(seller);

            if (save != null) {
                return ResponseEntity.ok(save);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The body must not be null");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") Long id) {
        if (id != null) {
            Seller byId = sellerService.findById(id);
            if (byId != null) {
                return ResponseEntity.ok(byId);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The seller does not exist");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The id must not be null");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        if (id != null) {
            Seller byId = sellerService.findById(id);
            if (byId != null) {
                boolean ok = sellerService.deleteById(id);
                if (ok) {
                    return ResponseEntity.ok("Seller successfully deleted");
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The seller does not exist");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The id must not be null");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody SellerDTO sellerDTO, @PathVariable("id") Long id) {
        mapper = new SellerDTOMapper();
        if (sellerDTO != null && id != null) {
            Seller byId = sellerService.findById(id);
            if (byId != null) {
                Seller seller = mapper.toDomain(sellerDTO);
                seller.setId(id);
                boolean ok = sellerService.update(seller);
                if (ok) {
                    return ResponseEntity.ok("Seller successfully updated");
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The seller does not exist");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The id must not be null");
        }
    }
}
