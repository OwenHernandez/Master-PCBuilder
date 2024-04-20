package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.*;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service.BuildComponentEntityService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service.BuildEntityService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
@SpringBootTest
@TestMethodOrder(value = MethodOrderer.OrderAnnotation.class)
@Sql(scripts = { "/masterTest.sql" })
public class BuildEntityServiceTest {

    @Autowired
    private BuildEntityService buildEntityService;

    @Autowired
    private BuildComponentEntityService buildComponentEntityService;

    @BeforeEach
    void setUp() {
    }

    @Test
    void findAll_test() {
        List<Build> builds = buildEntityService.findAll();

        assertNotNull(builds);
        assertEquals(3, builds.size());
        builds.get(0).getBuildsComponents().forEach(Assertions::assertNotNull);
    }


    @Test
    void save_ok_everything_test() {
        Build build = new Build();
        build.setName("Test");
        build.setCategory("Test");
        build.setNotes("Test");
        build.setDateOfCreation("2021-06-01");
        build.setTotalPrice(1000.0);
        build.setUser(new User());

        Seller seller = new Seller();
        seller.setId(1L);

        User user = new User();
        user.setId(1L);
        user.setNick("Test");

        Component component1 = new Component();
        component1.setId(1L);
        component1.setName("Test");
        component1.setSeller(seller);
        component1.setUserWhoCreated(user);

        Component component2 = new Component();
        component2.setId(2L);
        component2.setName("Test2");
        component2.setSeller(seller);
        component2.setUserWhoCreated(user);

        BuildComponent buildComponent1 = new BuildComponent();
        buildComponent1.setDateCreated("2021-06-01");
        buildComponent1.setPriceAtTheTime(100.0);
        buildComponent1.setComponent(component1);
        buildComponent1.setBuild(build);

        BuildComponent buildComponent2 = new BuildComponent();
        buildComponent2.setDateCreated("2022-12-05");
        buildComponent2.setPriceAtTheTime(50.0);
        buildComponent2.setComponent(component2);
        buildComponent2.setBuild(build);
        build.setBuildsComponents(new ArrayList<>(List.of(buildComponent1, buildComponent2)));
        build.setUser(user);

        Build buildSaved = buildEntityService.save(build);

        assertNotNull(buildSaved);
        assertEquals(build.getName(), buildSaved.getName());
        assertEquals(build.getCategory(), buildSaved.getCategory());
        assertEquals(build.getNotes(), buildSaved.getNotes());
        assertEquals(build.getDateOfCreation(), buildSaved.getDateOfCreation());
        assertEquals(build.getTotalPrice(), buildSaved.getTotalPrice());
        assertEquals(build.getUser(), buildSaved.getUser());

        Build byId = buildEntityService.findById(buildSaved.getId());

        assertEquals(2, byId.getBuildsComponents().size());
        byId.getBuildsComponents().forEach(Assertions::assertNotNull);
    }

    @Test
    void save_ok_noBC_test() {
        Build build = new Build();
        build.setName("Test");
        build.setCategory("Test");
        build.setNotes("Test");
        build.setDateOfCreation("2021-06-01");
        build.setTotalPrice(1000.0);
        build.setUser(new User());

        User user = new User();
        user.setId(1L);
        user.setNick("Test");

        build.setUser(user);

        Build buildSaved = buildEntityService.save(build);

        assertNotNull(buildSaved);
        assertEquals(build.getName(), buildSaved.getName());
        assertEquals(build.getCategory(), buildSaved.getCategory());
        assertEquals(build.getNotes(), buildSaved.getNotes());
        assertEquals(build.getDateOfCreation(), buildSaved.getDateOfCreation());
        assertEquals(build.getTotalPrice(), buildSaved.getTotalPrice());
        assertEquals(build.getUser(), buildSaved.getUser());

        assertTrue(buildSaved.getBuildsComponents().isEmpty());
    }

    @Test
    void save_exception_test() {
        Build build = new Build();
        build.setId(1L);
        build.setName("Test");
        build.setCategory("Test");
        build.setNotes("Test");
        build.setDateOfCreation("2021-06-01");
        build.setTotalPrice(1000.0);
        build.setUser(new User());

        User user = new User();
        user.setId(1L);
        user.setNick("Test");
        build.setUser(user);

        Build buildSaved = buildEntityService.save(build);

        assertNull(buildSaved);
    }

    @Test
    void findById_ok_test() {
        Build build = buildEntityService.findById(1L);

        assertNotNull(build);
        assertEquals(1L, build.getId());
        assertEquals("Gaming PC", build.getName());
        assertEquals("Gaming", build.getCategory());
        assertEquals("High-end gaming PC build", build.getNotes());
        assertEquals("1988-04-07", build.getDateOfCreation());
        assertEquals(1500.0, build.getTotalPrice());
        assertNotNull(build.getUser());
        assertEquals(1L, build.getUser().getId());
        assertEquals(2, build.getBuildsComponents().size());
        build.getBuildsComponents().forEach(Assertions::assertNotNull);
    }

    @Test
    void findById_nullParam_test() {
        Build build = buildEntityService.findById(null);

        assertNull(build);
    }

    @Test
    void findById_incorrectId_test() {
        Build build = buildEntityService.findById(56L);

        assertNull(build);
    }

    @Test
    void deleteById_ok_everything_test() {
        boolean deleted = buildEntityService.deleteById(1L);

        assertTrue(deleted);

        Build build = buildEntityService.findById(1L);

        assertNull(build);

        List<BuildComponent> allBC = buildComponentEntityService.findAll();
        assertEquals(1, allBC.size());
    }

    @Test
    void deleteById_ok_noBC_test() {
        boolean deleted = buildEntityService.deleteById(3L);

        assertTrue(deleted);

        Build build = buildEntityService.findById(3L);

        assertNull(build);
    }

    @Test
    void deleteById_incorrectId_test() {
        boolean deleted = buildEntityService.deleteById(56L);

        assertFalse(deleted);
    }

    @Test
    void deleteById_withPost_test() {
        List<BuildComponent> allBC = buildComponentEntityService.findAll();
        assertEquals(3, allBC.size());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            buildEntityService.deleteById(2L);
        });

        assertEquals("The build has posts", exception.getMessage());

        Build build = buildEntityService.findById(2L);

        assertNotNull(build);

        allBC = buildComponentEntityService.findAll();
        assertEquals(3, allBC.size());
    }

    @Test
    void update_ok_everything_test() {
        Build build = new Build();
        build.setId(1L);
        build.setName("Test");
        build.setCategory("Test");
        build.setNotes("Test");
        build.setDateOfCreation("2021-06-01");
        build.setTotalPrice(1000.0);
        build.setUser(new User());

        Seller seller = new Seller();
        seller.setId(1L);

        User user = new User();
        user.setId(1L);

        Component component1 = new Component();
        component1.setId(3L);
        component1.setName("Memory");
        component1.setSeller(seller);
        component1.setUserWhoCreated(user);

        BuildComponent buildComponent1 = new BuildComponent();
        buildComponent1.setDateCreated("2021-06-01");
        buildComponent1.setPriceAtTheTime(100.0);
        buildComponent1.setComponent(component1);

        build.setBuildsComponents(new ArrayList<>(List.of(buildComponent1)));
        build.setUser(user);

        boolean update = buildEntityService.update(build);

        assertTrue(update);
        Build byId = buildEntityService.findById(1L);
        assertEquals(build.getName(), byId.getName());
        assertEquals(build.getCategory(), byId.getCategory());
        assertEquals(build.getNotes(), byId.getNotes());
        assertEquals(build.getDateOfCreation(), byId.getDateOfCreation());
        assertEquals(build.getTotalPrice(), byId.getTotalPrice());
        assertEquals(build.getUser(), byId.getUser());

        assertEquals(1, byId.getBuildsComponents().size());
        byId.getBuildsComponents().forEach(Assertions::assertNotNull);
    }

    @Test
    void update_ok_noBC_test() {
        Build build = new Build();
        build.setId(1L);
        build.setName("Test");
        build.setCategory("Test");
        build.setNotes("Test");
        build.setDateOfCreation("2021-06-01");
        build.setTotalPrice(1000.0);

        User user = new User();
        user.setId(1L);

        build.setUser(user);

        boolean update = buildEntityService.update(build);

        assertTrue(update);
        Build byId = buildEntityService.findById(1L);
        assertEquals(build.getName(), byId.getName());
        assertEquals(build.getCategory(), byId.getCategory());
        assertEquals(build.getNotes(), byId.getNotes());
        assertEquals(build.getDateOfCreation(), byId.getDateOfCreation());
        assertEquals(build.getTotalPrice(), byId.getTotalPrice());
        assertEquals(build.getUser(), byId.getUser());

        assertEquals(0, byId.getBuildsComponents().size());
    }

    @Test
    void update_incorrectId_test() {
        Build build = new Build();
        build.setId(56L);

        boolean update = buildEntityService.update(build);

        assertFalse(update);
    }

    @Test
    void update_parseException_test() {
        Build build = new Build();
        build.setId(1L);
        build.setName("Test");
        build.setCategory("Test");
        build.setNotes("Test");
        build.setDateOfCreation("parseTest");
        build.setTotalPrice(1000.0);
        build.setUser(new User());

        Seller seller = new Seller();
        seller.setId(1L);

        User user = new User();
        user.setId(1L);

        Component component1 = new Component();
        component1.setId(3L);
        component1.setName("Memory");
        component1.setSeller(seller);
        component1.setUserWhoCreated(user);

        BuildComponent buildComponent1 = new BuildComponent();
        buildComponent1.setDateCreated("2021-06-01");
        buildComponent1.setPriceAtTheTime(100.0);
        buildComponent1.setComponent(component1);

        build.setBuildsComponents(new ArrayList<>(List.of(buildComponent1)));
        build.setUser(user);

        boolean update = buildEntityService.update(build);

        assertFalse(update);
    }

    @Test
    void findByName_ok_test() {
        List<Build> builds = buildEntityService.findByName("Gaming PC");


        assertNotNull(builds);
        assertEquals(1, builds.size());
        assertEquals(1L, builds.get(0).getId());
        builds.get(0).getBuildsComponents().forEach(Assertions::assertNotNull);
    }

    @Test
    void findByName_nullParam_test() {
        List<Build> builds = buildEntityService.findByName(null);


        assertNull(builds);
    }

    @Test
    void findByName_incorrectName_test() {
        List<Build> builds = buildEntityService.findByName("Test");


        assertTrue(builds.isEmpty());
    }

    @Test
    void findByUserId_ok_test() {
        List<Build> builds = buildEntityService.findByUserId(1L);


        assertNotNull(builds);
        assertEquals(2, builds.size());
        assertEquals(1L, builds.get(0).getId());
        builds.get(0).getBuildsComponents().forEach(Assertions::assertNotNull);
    }

    @Test
    void findByUserId_nullParam_test() {
        List<Build> builds = buildEntityService.findByUserId(null);


        assertNull(builds);
    }

    @Test
    void findByUserId_incorrectName_test() {
        List<Build> builds = buildEntityService.findByUserId(56L);


        assertTrue(builds.isEmpty());
    }
}