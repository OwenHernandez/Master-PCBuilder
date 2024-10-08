package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.SellerDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.SellerInputDTO;

public class SellerDTOMapper {

    public Seller toDomain(SellerInputDTO sellerDTO) {
        Seller seller = new Seller();
        seller.setName(sellerDTO.getName());
        seller.setImage(sellerDTO.getImage());
        seller.setDeleted((byte) (sellerDTO.isDeleted() ? 1 : 0));

        return seller;
    }

    public SellerDTO toDTO(Seller seller) {
        SellerDTO sellerDTO = new SellerDTO();
        sellerDTO.setName(seller.getName());
        sellerDTO.setImage(seller.getImage());
        sellerDTO.setDeleted(seller.getDeleted() == 1);

        return sellerDTO;
    }
}
