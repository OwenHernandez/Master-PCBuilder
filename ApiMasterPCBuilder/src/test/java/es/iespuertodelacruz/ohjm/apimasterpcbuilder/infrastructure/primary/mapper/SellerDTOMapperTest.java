package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.SellerDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.SellerInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.SellerDTOMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class SellerDTOMapperTest {

    private SellerDTOMapper sellerDTOMapper;

    @BeforeEach
    void setUp() {
        sellerDTOMapper = new SellerDTOMapper();
    }

    @Test
    void toDomain_ValidSellerDTO_ReturnsSeller() {
        SellerInputDTO sellerDTO = new SellerInputDTO();
        sellerDTO.setName("Example Seller");

        Seller result = sellerDTOMapper.toDomain(sellerDTO);

        assertThat(result.getName()).isEqualTo("Example Seller");
    }

    @Test
    void toDTO_ValidSeller_ReturnsSellerDTO() {
        Seller seller = new Seller();
        seller.setName("Example Seller");

        SellerDTO result = sellerDTOMapper.toDTO(seller);

        assertThat(result.getName()).isEqualTo("Example Seller");
    }
}
