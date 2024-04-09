package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service.UserEntityService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
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
public class UserEntityServiceTest {

    @Autowired
    private UserEntityService userEntityService;
    private User createUser(String email, String nick, String role) {
        User user = new User();
        user.setId(1L);
        user.setActive((byte) 1);
        user.setEmail("user1@example.com");
        user.setHash("hashvalue");
        user.setNick("nickname");
        user.setPassword("securepassword");
        user.setPicture("path/to/picture");
        user.setRole("ROLE_USER");
        // Configure additional fields as necessary
        return userEntityService.save(user);
    }

    @BeforeEach
    public void setup() {
        // Prepopulate the database with a user, if necessary for your tests.
        createUser("test@example.com", "testNick", "USER");
    }

    @Test
    public void testFindById() {
        User newUser = createUser("findbyid@example.com", "findByIDNick", "ADMIN");
        User foundUser = userEntityService.findById(newUser.getId());

        assertNotNull(foundUser, "User should be found by ID");
        assertEquals("user1@example.com", foundUser.getEmail(), "Emails should match");
    }

    @Test
    public void testFindByNick() {
        User foundUser = userEntityService.findByNick("nickname");
        System.out.println(foundUser.toString());
        assertNotNull(foundUser, "User should be found by nick");
        assertEquals("user1@example.com", foundUser.getEmail(), "Emails should match for found user");
    }

    @Test
    public void testFindByEmail() {
        User foundUser = userEntityService.findByEmail("user1@example.com");
        assertNotNull(foundUser, "User should be found by email");
        assertEquals("nickname", foundUser.getNick(), "Nicks should match for found user");
    }

    @Test
    public void testFindAll() {
        List<User> users = userEntityService.findAll();
        assertFalse(users.isEmpty(), "Users list should not be empty");
    }

    @Test
    public void testSave() {
        User newUser = new User();
        newUser.setId(1L);
        newUser.setActive((byte) 1);
        newUser.setEmail("user1@example.com");
        newUser.setHash("hashvalue");
        newUser.setNick("nickname");
        newUser.setPassword("securepassword");
        newUser.setPicture("path/to/picture");
        newUser.setRole("ROLE_USER");

        User savedUser = userEntityService.save(newUser);
        assertNotNull(savedUser, "Saved user should not be null");
        assertNotNull(savedUser.getId(), "Saved user should have an ID");
    }

    @Test
    @Transactional
    public void testFindByRole() {
        List<User> users = userEntityService.findByRole("ROLE_USER");
        assertFalse(users.isEmpty(), "Should find users by role");
        assertTrue(users.stream().anyMatch(user -> "ROLE_USER".equals(user.getRole())), "Found users should have the correct role");
    }

}
