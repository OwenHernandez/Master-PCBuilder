package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.SellerDTO;
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
        SellerDTO sellerDTO = new SellerDTO();
        sellerDTO.setName("Example Seller");
        sellerDTO.setImage("image_url");

        Seller result = sellerDTOMapper.toDomain(sellerDTO);

        assertThat(result.getName()).isEqualTo("Example Seller");
        assertThat(result.getImage()).isEqualTo("image_url");
    }

    @Test
    void toDTO_ValidSeller_ReturnsSellerDTO() {
        Seller seller = new Seller();
        seller.setName("Example Seller");
        seller.setImage("image_url");

        SellerDTO result = sellerDTOMapper.toDTO(seller);

        assertThat(result.getName()).isEqualTo("Example Seller");
        assertThat(result.getImage()).isEqualTo("image_url");
    }

    // Nuevo: Pruebas para campos opcionales o condiciones de borde
    @Test
    void toDomain_WhenMissingOptionalFields_ShouldHandleGracefully() {
        SellerDTO sellerDTO = new SellerDTO();
        // Omite el campo 'image' intencionalmente
        sellerDTO.setName("Seller Without Image");

        Seller result = sellerDTOMapper.toDomain(sellerDTO);

        assertThat(result.getName()).isEqualTo("Seller Without Image");
        assertThat(result.getImage()).isNull(); // Verifica el manejo correcto de campos faltantes
    }

    @Test
    void toDTO_WhenMissingOptionalFields_ShouldHandleGracefully() {
        Seller seller = new Seller();
        // Omite el campo 'image' intencionalmente
        seller.setName("Seller Without Image");

        SellerDTO result = sellerDTOMapper.toDTO(seller);

        assertThat(result.getName()).isEqualTo("Seller Without Image");
        assertThat(result.getImage()).isNull(); // Verifica el manejo correcto de campos faltantes
    }
}
