package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v3;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.ISellerService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.FileStorageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.SellerDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.SellerInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.exception.GraphQLErrorException;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.SellerDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

import java.util.Base64;
import java.util.List;

@Controller
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class SellerControllerV3 {

    @Autowired
    private ISellerService sellerService;

    private final SellerDTOMapper sellerDTOMapper = new SellerDTOMapper();

    @Autowired
    private FileStorageService storageService;

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

    @SchemaMapping(typeName = "Mutation", field = "saveSeller")
    public Seller save(@Argument SellerInputDTO seller) {
        Seller domain = sellerDTOMapper.toDomain(seller);
        byte[] photoBytes = Base64.getDecoder().decode(seller.getImage64());
        String newFileName = storageService.save(seller.getName() + "_" + seller.getImage(), photoBytes);
        domain.setImage(newFileName);

        return sellerService.save(domain);
    }

    @SchemaMapping(typeName = "Mutation", field = "updateSeller")
    public boolean update(@Argument Long id, @Argument SellerInputDTO seller) {
        Seller sellerToUpdate = sellerService.findById(id);
        if (sellerToUpdate == null) {
            throw new GraphQLErrorException("Seller not found", HttpStatus.NOT_FOUND);
        }
        if (!seller.getName().isEmpty()) {
            sellerToUpdate.setName(seller.getName());
        }
        if (!seller.getImage64().isEmpty() && seller.getImage64() != null) {
            byte[] photoBytes = Base64.getDecoder().decode(seller.getImage64());
            String newFileName = storageService.save(seller.getName() + "_" + seller.getImage(), photoBytes);
            sellerToUpdate.setImage(newFileName);
        }
        sellerToUpdate.setDeleted((byte) 0);
        return sellerService.update(sellerToUpdate);
    }

    @SchemaMapping(typeName = "Mutation", field = "deleteSeller")
    public boolean delete(@Argument long id) {
        Seller seller = sellerService.findById(id);
        if (seller == null) {
            throw new GraphQLErrorException("Seller not found", HttpStatus.NOT_FOUND);
        }
        if (seller.getComponents() != null && !seller.getComponents().isEmpty()) {
            throw new GraphQLErrorException("Seller has components", HttpStatus.BAD_REQUEST);
        }
        seller.setDeleted((byte) 1);
        return sellerService.update(seller);
    }
}
