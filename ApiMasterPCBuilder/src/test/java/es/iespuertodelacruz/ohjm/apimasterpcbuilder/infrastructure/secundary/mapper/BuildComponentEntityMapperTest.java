package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.BuildComponentEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildComponentEntity;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.text.ParseException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
public class BuildComponentEntityMapperTest {

    private final BuildComponentEntityMapper buildComponentEntityMapper = new BuildComponentEntityMapper();

    @Test
    void toDomain_ok_test() {
        BuildComponentEntity buildComponentEntity = new BuildComponentEntity();
        buildComponentEntity.setId(1L);
        buildComponentEntity.setDateCreated(100000000000L); // 1973-03-03
        buildComponentEntity.setPriceAtTheTime(1000.0);

        BuildComponent domain = buildComponentEntityMapper.toDomain(buildComponentEntity);

        assertEquals(buildComponentEntity.getId(), domain.getId());
        assertEquals("1973-03-03", domain.getDateCreated());
        assertEquals(buildComponentEntity.getPriceAtTheTime(), domain.getPriceAtTheTime());
    }

    @Test
    void toDomain_nullDate_test() {
        BuildComponentEntity buildComponentEntity = new BuildComponentEntity();
        buildComponentEntity.setId(1L);
        buildComponentEntity.setPriceAtTheTime(1000.0);

        BuildComponent domain = buildComponentEntityMapper.toDomain(buildComponentEntity);

        assertEquals(buildComponentEntity.getId(), domain.getId());
        assertEquals("1970-01-01", domain.getDateCreated());
        assertEquals(buildComponentEntity.getPriceAtTheTime(), domain.getPriceAtTheTime());
    }

    @Test
    void toPersistence_ok_test() throws Exception {
        BuildComponent buildComponent = new BuildComponent();
        buildComponent.setId(1L);
        buildComponent.setDateCreated("1973-03-03");
        buildComponent.setPriceAtTheTime(1000.0);

        BuildComponentEntity entity = buildComponentEntityMapper.toPersistence(buildComponent);

        assertEquals(buildComponent.getId(), entity.getId());
        assertEquals(99964800000L, entity.getDateCreated());
        assertEquals(buildComponent.getPriceAtTheTime(), entity.getPriceAtTheTime());
    }

    @Test
    void toPersistence_nullDate_test() {
        BuildComponent buildComponent = new BuildComponent();
        buildComponent.setId(1L);
        buildComponent.setPriceAtTheTime(1000.0);

        assertThrows(NullPointerException.class, () -> buildComponentEntityMapper.toPersistence(buildComponent));
    }

    @Test
    void toPersistence_wrongDate_test() {
        BuildComponent buildComponent = new BuildComponent();
        buildComponent.setId(1L);
        buildComponent.setDateCreated(".--sef342");
        buildComponent.setPriceAtTheTime(1000.0);

        assertThrows(ParseException.class, () -> buildComponentEntityMapper.toPersistence(buildComponent));
    }
}
