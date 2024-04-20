package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service.SellerEntityService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
@SpringBootTest
@TestMethodOrder(value = MethodOrderer.OrderAnnotation.class)
@Sql(scripts = { "/masterTest.sql" })
public class SellerEntityServiceTest {
    @Autowired
    private SellerEntityService sellerEntityService;

    @BeforeEach
    public void setup() {
        // Pre-populate the test database with necessary data, if required
    }

    @Test
    @DisplayName("Test: Find all sellers. Expecting a possibly empty but not null list.")
    void findAllSellers_ShouldReturnNotNullList() {
        List<Seller> sellers = sellerEntityService.findAll();
        assertNotNull(sellers, "findAll() should not return null");
    }

    @Test
    @DisplayName("Test: Save and retrieve a seller by ID.")
    void saveAndFindSellerById_ShouldCorrectlySaveAndRetrieve() {
        Seller seller = new Seller();
        seller.setName("Test Seller");
        seller.setImage("test_image.jpg");

        Seller savedSeller = sellerEntityService.save(seller);
        assertNotNull(savedSeller, "Saved seller should not be null");
        assertNotNull(savedSeller.getId(), "Saved seller should have an ID");

        Seller foundSeller = sellerEntityService.findById(savedSeller.getId());
        assertNotNull(foundSeller, "Should find a seller by ID");
        assertEquals(savedSeller.getName(), foundSeller.getName(), "The names of the saved and found seller should match");
    }

    @Test
    @DisplayName("Test: Update a seller.")
    void updateSeller_ShouldCorrectlyUpdate() {
        Seller seller = new Seller();
        seller.setName("Initial Seller");
        seller.setImage("initial_image.jpg");

        Seller savedSeller = sellerEntityService.save(seller);
        savedSeller.setName("Updated Seller");
        boolean updateResult = sellerEntityService.update(savedSeller);

        assertTrue(updateResult, "Update should return true on success");
        Seller updatedSeller = sellerEntityService.findById(savedSeller.getId());
        assertEquals("Updated Seller", updatedSeller.getName(), "Seller name should be updated");
    }

    @Test
    @DisplayName("Test: Delete a seller by ID.")
    void deleteSellerById_ShouldCorrectlyDelete() {
        Seller seller = new Seller();
        seller.setName("Seller to Delete");
        seller.setImage("delete_image.jpg");

        Seller savedSeller = sellerEntityService.save(seller);
        boolean deleteResult = sellerEntityService.deleteById(savedSeller.getId());

        assertTrue(deleteResult, "Delete should return true on success");
        Seller deletedSeller = sellerEntityService.findById(savedSeller.getId());
        assertNull(deletedSeller, "Seller should not exist after deletion");
    }

    @Test
    @DisplayName("Test: Find a seller by name.")
    void findSellerByName_ShouldReturnCorrectSeller() {
        Seller seller = new Seller();
        seller.setName("Unique Seller Name");
        seller.setImage("unique_image.jpg");
        sellerEntityService.save(seller);

        Seller foundSeller = sellerEntityService.findByName("Unique Seller Name");
        assertNotNull(foundSeller, "Should find a seller by name");
        assertEquals("Unique Seller Name", foundSeller.getName(), "The names should match for the found seller");
    }
}