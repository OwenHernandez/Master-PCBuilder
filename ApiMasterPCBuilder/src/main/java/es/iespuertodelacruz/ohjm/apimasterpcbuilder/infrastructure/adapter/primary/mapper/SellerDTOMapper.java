package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.SellerDTO;

public class SellerDTOMapper {

    public Seller toDomain(SellerDTO sellerDTO) {
        Seller seller = new Seller();
        if (sellerDTO.getId() != null) {
            seller.setId(sellerDTO.getId());
        }
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
