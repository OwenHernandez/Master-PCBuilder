package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service.ComponentEntityService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
@SpringBootTest
@TestMethodOrder(value = MethodOrderer.OrderAnnotation.class)
@Sql(scripts = { "/masterTest.sql" })
public class ComponentEntityServiceTest {

    @Autowired
    private ComponentEntityService componentEntityService;

    private Component createTestComponent(String name, double price, String type, double amazonPrice, double ebayPrice, Seller seller, User user) {
        Component component = new Component();
        component.setName(name);
        component.setPrice(price);
        component.setType(type);
        component.setAmazon_price(amazonPrice);
        component.setEbay_price(ebayPrice);
        component.setSeller(seller);
        component.setUserWhoCreated(user);
        return component;
    }

    private User createTestUser() {
        User user = new User();
        user.setId(1L);
        user.setActive((byte) 1);
        user.setEmail("user1@example.com");
        user.setHash("hashvalue");
        user.setNick("nickname");
        user.setPassword("securepassword");
        user.setPicture("path/to/picture");
        // Configure additional fields as necessary
        return user;
    }

    private Seller createTestSeller() {
        Seller seller = new Seller();
        seller.setId(1L);
        seller.setImage("path/to/sellerImage");
        seller.setName("TechStore");
        return seller;
    }
    // Suponiendo la existencia de este método auxiliar para preparar un componente.
    private Component prepareComponent(String name, User user, Seller seller) {
        Component component = new Component();
        component.setName(name);
        component.setDescription("Description of " + name);
        component.setImage("image/path/" + name);
        component.setPrice(100.0);
        component.setAmazon_price(95.0);
        component.setEbay_price(90.0);
        component.setType("Gaming");
        component.setUserWhoCreated(user);
        component.setSeller(seller);
        return componentEntityService.save(component);
    }

    @Test
    public void updateComponentTest() {
        User user = createTestUser();
        Seller seller = createTestSeller();
        Component component = prepareComponent("ComponentToUpdate", user, seller);

        String updatedName = "UpdatedComponentName";
        component.setName(updatedName);
        boolean updatedComponent = componentEntityService.update(component);

        assertNotNull(updatedComponent);
        assertEquals(true, updatedComponent, "Component name was not updated correctly.");
    }

    @Test
    public void deleteComponentByIdTest() {
        User user = createTestUser();
        Seller seller = createTestSeller();
        Component component = prepareComponent("ComponentToDelete", user, seller);

        assertDoesNotThrow(() -> componentEntityService.deleteById(component.getId()), "Deletion threw an exception when it shouldn't have.");
    }

    @Test
    public void findByUserIdTest() {
        User user = createTestUser();
        Seller seller = createTestSeller();
        Component component1 = prepareComponent("ComponentUser1", user, seller);
        Component component2 = prepareComponent("ComponentUser2", user, seller);

        List<Component> components = componentEntityService.findByUserId(user.getId());
        assertNotNull(components);
        assertTrue(components.size() >= 2, "Expected to find at least two components created by the user.");
    }

    @Test
    public void findBySellerIdTest() {
        User user = createTestUser();
        Seller seller = createTestSeller();
        Component component1 = prepareComponent("ComponentSeller1", user, seller);
        Component component2 = prepareComponent("ComponentSeller2", user, seller);

        List<Component> components = componentEntityService.findBySellerId(seller.getId());
        assertNotNull(components);
        assertTrue(components.size() >= 2, "Expected to find at least two components associated with the seller.");
    }

    @Test
    public void save_and_findById_withFullUserAndSeller_test() {
        // Creación y configuración completa de un objeto User
        Seller seller = createTestSeller();
        User user = createTestUser();


        Component component = new Component();
        component.setName("Component Name");
        component.setDescription("Component Description");
        component.setImage("path/to/image");
        component.setPrice(100.0);
        component.setAmazon_price(95.0);
        component.setEbay_price(90.0);
        component.setType("Type");
        component.setSeller(seller); // Asegúrate de que seller tiene un ID después de guardar
        component.setUserWhoCreated(user); // Asegúrate de que user tiene un ID después de guardar

        Component savedComponent = componentEntityService.save(component);
        assertNotNull(savedComponent, "The saved component should not be null.");
        assertNotNull(savedComponent.getId(), "The saved component should have an ID.");

        // Verificación del Component guardado, incluidas las propiedades de User y Seller
        Component foundComponent = componentEntityService.findById(savedComponent.getId());
        assertNotNull(foundComponent, "Expected to find a component by ID but found none.");
        assertEquals("Component Name", foundComponent.getName(), "Component names do not match.");
        // Verificar propiedades adicionales de foundComponent según sea necesario
        System.out.println("Component found: " + foundComponent.toString());
        // Verificar propiedades de User y Seller asociadas con el Component encontrado
        assertEquals(user.getEmail(), foundComponent.getUserWhoCreated().getEmail(), "User emails do not match.");
        assertEquals(seller.getName(), foundComponent.getSeller().getName(), "Seller names do not match.");
    }

}
