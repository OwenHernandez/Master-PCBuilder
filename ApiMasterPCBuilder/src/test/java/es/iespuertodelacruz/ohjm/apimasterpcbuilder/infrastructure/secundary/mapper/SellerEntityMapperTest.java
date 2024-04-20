package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.SellerEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.SellerEntity;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class SellerEntityMapperTest {

    private final SellerEntityMapper sellerEntityMapper = new SellerEntityMapper();

    @Test
    void toDomain_ok_test() {
        SellerEntity sellerEntity = new SellerEntity();
        sellerEntity.setId(1);
        sellerEntity.setName("Amazon");
        sellerEntity.setImage("amazon.jpg");

        Seller domain = sellerEntityMapper.toDomain(sellerEntity);

        assertEquals(sellerEntity.getId(), domain.getId());
        assertEquals(sellerEntity.getName(), domain.getName());
        assert sellerEntity.getImage().equals(domain.getImage());
    }

    @Test
    void toPersistence_ok_test() {
        Seller seller = new Seller();
        seller.setId(1);
        seller.setName("Amazon");
        seller.setImage("amazon.jpg");

        SellerEntity entity = sellerEntityMapper.toPersistence(seller);

        assertEquals(seller.getId(), entity.getId());
        assertEquals(seller.getName(), entity.getName());
        assert seller.getImage().equals(entity.getImage());
    }
}
