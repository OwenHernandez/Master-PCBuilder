package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.*;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.BuildEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.*;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.text.ParseException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
public class BuildEntityMapperTest {

    private final BuildEntityMapper buildEntityMapper = new BuildEntityMapper();

    @Test
    void toDomain_ok_test() {
        BuildEntity buildEntity = new BuildEntity();
        buildEntity.setId(1L);
        buildEntity.setName("Test");
        buildEntity.setNotes("Test");
        buildEntity.setTotalPrice(1000.0);
        buildEntity.setDateOfCreation(1620000000000L);// 2021-05-03
        buildEntity.setCategory("Test");
        buildEntity.setUser(new UserEntity());
        ComponentEntity componentEntity = new ComponentEntity();
        componentEntity.setUser(new UserEntity());
        componentEntity.setSeller(new SellerEntity());
        BuildComponentEntity buildComponentEntity = new BuildComponentEntity();
        buildComponentEntity.setComponent(componentEntity);
        buildEntity.setBuildsComponents(List.of(buildComponentEntity));

        Build domain = buildEntityMapper.toDomain(buildEntity);

        assertEquals(buildEntity.getId(), domain.getId());
        assertEquals(buildEntity.getName(), domain.getName());
        assertEquals(buildEntity.getNotes(), domain.getNotes());
        assertEquals(buildEntity.getTotalPrice(), domain.getTotalPrice());
        assertEquals("2021-05-03", domain.getDateOfCreation());
        assertEquals(buildEntity.getCategory(), domain.getCategory());
    }

    @Test
    void toDomain_nullDate_test() {
        BuildEntity buildEntity = new BuildEntity();
        buildEntity.setId(1L);
        buildEntity.setName("Test");
        buildEntity.setNotes("Test");
        buildEntity.setTotalPrice(1000.0);
        buildEntity.setDateOfCreation(null);// 2021-05-03
        buildEntity.setCategory("Test");
        buildEntity.setUser(new UserEntity());
        ComponentEntity componentEntity = new ComponentEntity();
        componentEntity.setUser(new UserEntity());
        componentEntity.setSeller(new SellerEntity());
        BuildComponentEntity buildComponentEntity = new BuildComponentEntity();
        buildComponentEntity.setComponent(componentEntity);
        buildEntity.setBuildsComponents(List.of(buildComponentEntity));

        assertThrows(NullPointerException.class, () -> buildEntityMapper.toDomain(buildEntity));
    }

    @Test
    void toDomain_noUser_test() {
        BuildEntity buildEntity = new BuildEntity();
        buildEntity.setId(1L);
        buildEntity.setName("Test");
        buildEntity.setNotes("Test");
        buildEntity.setTotalPrice(1000.0);
        buildEntity.setDateOfCreation(1620000000000L);// 2021-05-03
        buildEntity.setCategory("Test");
        buildEntity.setUser(null);

        assertThrows(NullPointerException.class, () -> buildEntityMapper.toDomain(buildEntity));
    }

    @Test
    void toDomain_yesBC_noComp_test() {
        BuildEntity buildEntity = new BuildEntity();
        buildEntity.setId(1L);
        buildEntity.setName("Test");
        buildEntity.setNotes("Test");
        buildEntity.setTotalPrice(1000.0);
        buildEntity.setDateOfCreation(1620000000000L);// 2021-05-03
        buildEntity.setCategory("Test");
        buildEntity.setUser(new UserEntity());
        BuildComponentEntity buildComponentEntity = new BuildComponentEntity();
        buildEntity.setBuildsComponents(List.of(buildComponentEntity));

        assertThrows(NullPointerException.class, () -> buildEntityMapper.toDomain(buildEntity));
    }

    @Test
    void toDomain_yesBC_yesComp_noUserComp_test() {
        BuildEntity buildEntity = new BuildEntity();
        buildEntity.setId(1L);
        buildEntity.setName("Test");
        buildEntity.setNotes("Test");
        buildEntity.setTotalPrice(1000.0);
        buildEntity.setDateOfCreation(1620000000000L);// 2021-05-03
        buildEntity.setCategory("Test");
        buildEntity.setUser(new UserEntity());
        ComponentEntity componentEntity = new ComponentEntity();
        componentEntity.setUser(null);
        componentEntity.setSeller(new SellerEntity());
        BuildComponentEntity buildComponentEntity = new BuildComponentEntity();
        buildComponentEntity.setComponent(componentEntity);
        buildEntity.setBuildsComponents(List.of(buildComponentEntity));

        assertThrows(NullPointerException.class, () -> buildEntityMapper.toDomain(buildEntity));
    }

    @Test
    void toPersistence_ok_test() throws ParseException {
        Build build = new Build();
        build.setId(1L);
        build.setName("Test");
        build.setNotes("Test");
        build.setTotalPrice(1000.0);
        build.setDateOfCreation("2021-05-03");// 1619996400000L
        build.setCategory("Test");
        build.setUser(new User());
        Component component = new Component();
        component.setUserWhoCreated(new User());
        component.setSeller(new Seller());
        BuildComponent buildComponent = new BuildComponent();
        buildComponent.setDateCreated("2021-12-04");
        buildComponent.setComponent(component);
        build.setBuildsComponents(List.of(buildComponent));

        BuildEntity persistence = buildEntityMapper.toPersistence(build);

        assertEquals(build.getId(), persistence.getId());
        assertEquals(build.getName(), persistence.getName());
        assertEquals(build.getNotes(), persistence.getNotes());
        assertEquals(build.getTotalPrice(), persistence.getTotalPrice());
        assertEquals(1620000000000L, persistence.getDateOfCreation());
        assertEquals(build.getCategory(), persistence.getCategory());
    }

    @Test
    void toPersistence_nullDate_test() {
        Build build = new Build();
        build.setId(1L);
        build.setName("Test");
        build.setNotes("Test");
        build.setTotalPrice(1000.0);
        build.setDateOfCreation(null);// 1620000000000L
        build.setCategory("Test");
        build.setUser(new User());
        Component component = new Component();
        component.setUserWhoCreated(new User());
        component.setSeller(new Seller());
        BuildComponent buildComponent = new BuildComponent();
        buildComponent.setComponent(component);
        build.setBuildsComponents(List.of(buildComponent));

        assertThrows(NullPointerException.class, () -> buildEntityMapper.toPersistence(build));
    }

    @Test
    void toPersistence_wrongDate_test() {
        Build build = new Build();
        build.setId(1L);
        build.setName("Test");
        build.setNotes("Test");
        build.setTotalPrice(1000.0);
        build.setDateOfCreation(".--.--.--5432");
        build.setCategory("Test");
        build.setUser(new User());
        Component component = new Component();
        component.setUserWhoCreated(new User());
        component.setSeller(new Seller());
        BuildComponent buildComponent = new BuildComponent();
        buildComponent.setDateCreated("2021-12-04");
        buildComponent.setComponent(component);
        build.setBuildsComponents(List.of(buildComponent));

        assertThrows(ParseException.class, () -> buildEntityMapper.toPersistence(build));
    }

    @Test
    void toPersistence_noUser_test() {
        Build build = new Build();
        build.setId(1L);
        build.setName("Test");
        build.setNotes("Test");
        build.setTotalPrice(1000.0);
        build.setDateOfCreation("2021-05-03");// 1619996400000L
        build.setCategory("Test");

        assertThrows(NullPointerException.class, () -> buildEntityMapper.toPersistence(build));
    }

    @Test
    void toPersistence_yesBC_noComp_test() {
        Build build = new Build();
        build.setId(1L);
        build.setName("Test");
        build.setNotes("Test");
        build.setTotalPrice(1000.0);
        build.setDateOfCreation("2021-05-03");// 1619996400000L
        build.setCategory("Test");
        build.setUser(new User());
        BuildComponent buildComponent = new BuildComponent();
        buildComponent.setDateCreated("2021-12-04");
        build.setBuildsComponents(List.of(buildComponent));

        assertThrows(NullPointerException.class, () -> buildEntityMapper.toPersistence(build));
    }

    @Test
    void toPersistence_yesBC_yesComp_noUserComp_test() {
        Build build = new Build();
        build.setId(1L);
        build.setName("Test");
        build.setNotes("Test");
        build.setTotalPrice(1000.0);
        build.setDateOfCreation("2021-05-03");// 1619996400000L
        build.setCategory("Test");
        build.setUser(new User());
        Component component = new Component();
        component.setSeller(new Seller());
        BuildComponent buildComponent = new BuildComponent();
        buildComponent.setDateCreated("2021-12-04");
        buildComponent.setComponent(component);
        build.setBuildsComponents(List.of(buildComponent));

        assertThrows(NullPointerException.class, () -> buildEntityMapper.toPersistence(build));
    }
}
