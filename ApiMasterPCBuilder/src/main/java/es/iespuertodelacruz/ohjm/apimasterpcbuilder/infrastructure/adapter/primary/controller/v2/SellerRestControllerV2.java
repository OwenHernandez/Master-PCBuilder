package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.ISellerService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.SellerDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.SellerDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/v2/sellers")
public class SellerRestControllerV2 {

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
}
