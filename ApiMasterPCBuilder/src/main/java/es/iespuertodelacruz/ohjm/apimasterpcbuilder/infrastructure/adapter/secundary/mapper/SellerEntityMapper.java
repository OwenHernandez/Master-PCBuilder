package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.SellerEntity;

public class SellerEntityMapper {

    public Seller toDomain(SellerEntity sellerEntity) {

        Seller res = new Seller();
        res.setId(sellerEntity.getId());
        res.setName(sellerEntity.getName());
        res.setImage(sellerEntity.getImage());

        return res;
    }

    public SellerEntity toPersistence(Seller seller) {

        SellerEntity res = new SellerEntity();
        res.setId(seller.getId());
        res.setName(seller.getName());
        res.setImage(seller.getImage());

        return res;
    }
}
