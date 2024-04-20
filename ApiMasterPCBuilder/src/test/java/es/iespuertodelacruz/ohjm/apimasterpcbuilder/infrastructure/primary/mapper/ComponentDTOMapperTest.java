package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentOutputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.ComponentDTOMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ComponentDTOMapperTest {
    @InjectMocks
    private ComponentDTOMapper mapper;

    private Component component;
    private ComponentInputDTO componentInputDTO;

    @BeforeEach
    void setUp() {
        mapper = new ComponentDTOMapper(); // Suponiendo que no hay dependencias para mockear

        component = new Component();
        component.setId(1L);
        component.setName("GPU");
        component.setType("Graphics Card");
        component.setImage("image_url");
        component.setDescription("A powerful GPU");
        component.setPrice(599.99);
        Seller seller = new Seller();
        seller.setName("Tech Store");
        component.setSeller(seller);
        User user = new User();
        user.setNick("techenthusiast");
        component.setUserWhoCreated(user);

        componentInputDTO = new ComponentInputDTO();
        componentInputDTO.setName("GPU");
        componentInputDTO.setImage("image_url");
        componentInputDTO.setDescription("A powerful GPU");
        componentInputDTO.setType("Graphics Card");
        componentInputDTO.setPrice(599.99);
    }

    @Test
    void toDomain_ShouldMapInputDTOToDomain() {
        Component result = mapper.toDomain(componentInputDTO);

        assertThat(result.getName()).isEqualTo("GPU");
        assertThat(result.getImage()).isEqualTo("image_url");
        assertThat(result.getDescription()).isEqualTo("A powerful GPU");
        assertThat(result.getType()).isEqualTo("Graphics Card");
        assertThat(result.getPrice()).isEqualTo(599.99);
    }

    @Test
    void toDTO_ShouldMapDomainToOutputDTO() {
        ComponentOutputDTO result = mapper.toDTO(component);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("GPU");
        assertThat(result.getType()).isEqualTo("Graphics Card");
        assertThat(result.getImage()).isEqualTo("image_url");
        assertThat(result.getDescription()).isEqualTo("A powerful GPU");
        assertThat(result.getPrice()).isEqualTo(599.99);
        assertThat(result.getSellerName()).isEqualTo("Tech Store");
        assertThat(result.getUserNick()).isEqualTo("techenthusiast");
    }

    @Test
    void toDomain_WhenInputDTOHasNullFields_ShouldHandleGracefully() {
        componentInputDTO.setImage(null); // Supongamos que es aceptable tener una imagen nula

        Component result = mapper.toDomain(componentInputDTO);

        assertThat(result.getName()).isEqualTo("GPU");
        assertThat(result.getImage()).isNull();
        assertThat(result.getDescription()).isEqualTo("A powerful GPU");
    }
}
