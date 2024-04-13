package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.ComponentEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.ComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.SellerEntity;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.text.ParseException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
public class ComponentEntityMapperTest {

    private final ComponentEntityMapper componentEntityMapper = new ComponentEntityMapper();

    @Test
    void toDomain_ok_test() {
        ComponentEntity componentEntity = new ComponentEntity();
        componentEntity.setId(1L);
        componentEntity.setName("Test");
        componentEntity.setDescription("Test");
        componentEntity.setPrice(1000.0);
        componentEntity.setAmazon_price(1000.0);
        componentEntity.setEbay_price(1000.0);
        componentEntity.setType("Test");
        componentEntity.setImage("Test");
        componentEntity.setSeller(new SellerEntity());

        BuildComponentEntity buildComponentEntity = new BuildComponentEntity();
        buildComponentEntity.setComponent(componentEntity);
        componentEntity.setBuildsComponents(List.of(buildComponentEntity));

        Component domain = componentEntityMapper.toDomain(componentEntity);

        assertEquals(componentEntity.getId(), domain.getId());
        assertEquals(componentEntity.getName(), domain.getName());
        assertEquals(componentEntity.getDescription(), domain.getDescription());
        assertEquals(componentEntity.getPrice(), domain.getPrice());
        assertEquals(componentEntity.getAmazon_price(), domain.getAmazon_price());
        assertEquals(componentEntity.getEbay_price(), domain.getEbay_price());
        assertEquals(componentEntity.getType(), domain.getType());
        assertEquals(componentEntity.getImage(), domain.getImage());
    }

    @Test
    void toDomain_nullSeller_test() {
        ComponentEntity componentEntity = new ComponentEntity();
        componentEntity.setId(1L);
        componentEntity.setName("Test");
        componentEntity.setDescription("Test");
        componentEntity.setPrice(1000.0);
        componentEntity.setAmazon_price(1000.0);
        componentEntity.setEbay_price(1000.0);
        componentEntity.setType("Test");
        componentEntity.setImage("Test");
        componentEntity.setSeller(null);

        assertThrows(NullPointerException.class, () -> componentEntityMapper.toDomain(componentEntity));
    }

    @Test
    void toPersistence_ok_test() throws ParseException {
        Component component = new Component();
        component.setId(1L);
        component.setName("Test");
        component.setDescription("Test");
        component.setPrice(1000.0);
        component.setAmazon_price(1000.0);
        component.setEbay_price(1000.0);
        component.setType("Test");
        component.setImage("Test");
        component.setSeller(new Seller());

        BuildComponent buildComponent = new BuildComponent();
        buildComponent.setDateCreated("2021-01-01");
        buildComponent.setComponent(component);
        component.setBuildsComponents(List.of(buildComponent));

        ComponentEntity persistence = componentEntityMapper.toPersistence(component);

        assertEquals(component.getId(), persistence.getId());
        assertEquals(component.getName(), persistence.getName());
        assertEquals(component.getDescription(), persistence.getDescription());
        assertEquals(component.getPrice(), persistence.getPrice());
        assertEquals(component.getAmazon_price(), persistence.getAmazon_price());
        assertEquals(component.getEbay_price(), persistence.getEbay_price());
        assertEquals(component.getType(), persistence.getType());
        assertEquals(component.getImage(), persistence.getImage());
    }

    @Test
    void toPersistence_nullSeller_test() {
        Component component = new Component();
        component.setId(1L);
        component.setName("Test");
        component.setDescription("Test");
        component.setPrice(1000.0);
        component.setAmazon_price(1000.0);
        component.setEbay_price(1000.0);
        component.setType("Test");
        component.setImage("Test");
        component.setSeller(null);

        assertThrows(NullPointerException.class, () -> componentEntityMapper.toPersistence(component));
    }
}
