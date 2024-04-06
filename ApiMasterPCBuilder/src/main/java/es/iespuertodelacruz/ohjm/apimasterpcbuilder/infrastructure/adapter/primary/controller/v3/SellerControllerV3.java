package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v3;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.ISellerService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.SellerDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.SellerDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;

@Controller
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class SellerControllerV3 {

    @Autowired
    private ISellerService sellerService;

    private final SellerDTOMapper sellerDTOMapper = new SellerDTOMapper();

    @Autowired
    private IComponentService componentService;

    @SchemaMapping(typeName = "Query", field = "sellers")
    public List<Seller> getSellers() {
        return sellerService.findAll();
    }


    @SchemaMapping(typeName = "Query", field = "seller")
    public Seller getSeller(@Argument long id) {
        return sellerService.findById(id);
    }

    @SchemaMapping(typeName = "Mutation", field = "save")
    public Seller saveSeller(@Argument SellerDTO seller) {
        return sellerService.save(sellerDTOMapper.toDomain(seller));
    }

    @SchemaMapping(typeName = "Mutation", field = "update")
    public boolean updateSeller(@Argument SellerDTO seller) {
        return sellerService.update(sellerDTOMapper.toDomain(seller));
    }

    @SchemaMapping(typeName = "Mutation", field = "delete")
    public boolean deleteSeller(@Argument long id) {
        return sellerService.deleteById(id);
    }
}
