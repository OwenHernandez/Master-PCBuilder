package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.GroupChat;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service.GroupChatEntityService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service.UserEntityService;
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
public class GroupChatEntityServiceTest {
    @Autowired
    private GroupChatEntityService groupChatEntityService;
    @Autowired
    private UserEntityService userEntityService;
    private GroupChat createTestGroupChat(String name, Long adminId) {
        GroupChat groupChat = new GroupChat();
        groupChat.setName("Default Name");
        groupChat.setDescription("Default Description");
        groupChat.setPicture("Default Picture");
        groupChat.setDateOfCreation("2023-01-01");
        groupChat.setAdmin(createAdmin());
        groupChat.setUsers(List.of(createUser()));
        return groupChatEntityService.save(groupChat);
    }
    private User createAdmin() {
        User admin = new User();
        admin.setId(1L);
        admin.setActive((byte) 1);
        admin.setEmail("admin@example.com");
        admin.setHash("hashvalue");
        admin.setNick("admin");
        admin.setPassword("securepassword");
        admin.setPicture("path/to/picture");
        admin.setRole("ROLE_ADMIN");

        return userEntityService.save(admin);
    }
    private User createUser() {
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
    @Test
    public void testFindAll() {
        GroupChat groupChat1 = createTestGroupChat("Chat1", 1L);
        GroupChat groupChat2 = createTestGroupChat("Chat2", 2L);

        List<GroupChat> groupChats = groupChatEntityService.findAll();
        assertTrue(groupChats.size() >= 2, "Should find at least two group chats");
    }

    @Test
    public void testSaveAndFindById() {
        GroupChat groupChat = createTestGroupChat("New Chat", 1L);
        assertNotNull(groupChat, "Group chat should not be null after save");

        GroupChat foundChat = groupChatEntityService.findById(groupChat.getId());
        assertNotNull(foundChat, "Should retrieve group chat by ID");
        assertEquals("Default Name", foundChat.getName(), "Group chat name should match");
    }

    @Test
    public void testDeleteById() {
        GroupChat groupChat = createTestGroupChat("Chat to Delete", 1L);
        boolean deleteResult = groupChatEntityService.deleteById(groupChat.getId());
        assertTrue(deleteResult, "Group chat should be deleted successfully");

        GroupChat foundChat = groupChatEntityService.findById(groupChat.getId());
        assertNull(foundChat, "Group chat should not exist after deletion");
    }

    @Test
    public void testUpdate() {
        GroupChat groupChat = createTestGroupChat("Chat to Update", 1L);
        groupChat.setName("Updated Chat");
        boolean updateResult = groupChatEntityService.update(groupChat);

        assertTrue(updateResult, "Group chat should be updated successfully");
        GroupChat updatedChat = groupChatEntityService.findById(groupChat.getId());
        assertEquals("Updated Chat", updatedChat.getName(), "Group chat name should be updated");
    }
    @Test
    public void testSaveGroupChat() {
        // 1. Crear un nuevo grupo de chat
        GroupChat groupChat = createTestGroupChat("Test Group Chat", 1L);

        // 2. Guardar el grupo de chat
        GroupChat savedGroupChat = groupChatEntityService.save(groupChat);

        // 3. Recuperar el grupo de chat guardado
        GroupChat foundGroupChat = groupChatEntityService.findById(savedGroupChat.getId());

        // 4. Comprobar que el grupo de chat recuperado no es nulo y que sus propiedades coinciden con las del grupo de chat original
        assertNotNull(foundGroupChat, "El grupo de chat no debería ser nulo después de guardarlo");
        assertEquals(groupChat.getName(), foundGroupChat.getName(), "El nombre del grupo de chat debería coincidir");
        assertEquals(groupChat.getAdmin().getId(), foundGroupChat.getAdmin().getId(), "El ID del administrador del grupo de chat debería coincidir");
    }
    @Test
    public void testFindByName() {
        createTestGroupChat("UniqueNameChat", 1L);
        List<GroupChat> foundChats = groupChatEntityService.findByName("Default Name");
        System.out.println(foundChats);
        assertNotNull(foundChats, "Should not be null when searching by name");
        assertFalse(foundChats.isEmpty(), "Should find group chats by name");
        assertEquals(1, foundChats.size(), "Should find exactly one group chat with unique name");
    }

    @Test
    public void testFindByUserId() {
        GroupChat groupChat = createTestGroupChat("ChatWithUser", 1L);
        groupChat.setUsers(List.of(createUser())); // Assuming there's a method to add users
        groupChatEntityService.save(groupChat);

        List<GroupChat> foundChats = groupChatEntityService.findByUserId(1L);
        assertFalse(foundChats.isEmpty(), "Should find group chats by user ID");
    }

    @Test
    public void testFindByAdminId() {
        createTestGroupChat("ChatWithAdmin", 1L);
        List<GroupChat> foundChats = groupChatEntityService.findByAdminId(1L);
        assertFalse(foundChats.isEmpty(), "Should find group chats by admin ID");
    }
}
