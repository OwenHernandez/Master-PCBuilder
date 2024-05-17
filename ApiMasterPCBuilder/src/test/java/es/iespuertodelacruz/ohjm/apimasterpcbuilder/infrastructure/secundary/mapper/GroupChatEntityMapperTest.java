package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.GroupChat;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.GroupChatEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.GroupChatEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.UserEntity;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class GroupChatEntityMapperTest {

    private final GroupChatEntityMapper groupChatEntityMapper = new GroupChatEntityMapper();

    @Test
    void toDomain_ok_test() {
        GroupChatEntity groupChatEntity = new GroupChatEntity();
        groupChatEntity.setId(1);
        groupChatEntity.setName("name");
        groupChatEntity.setDescription("description");
        groupChatEntity.setPicture("picture");
        groupChatEntity.setDateOfCreation(86400000L);// 1970-01-02
        UserEntity groupAdmin = new UserEntity();
        groupAdmin.setId(1);
        groupChatEntity.setGroupAdmin(groupAdmin);
        groupChatEntity.setUsers(List.of(groupAdmin));

        GroupChat groupChat = groupChatEntityMapper.toDomain(groupChatEntity);

        assertEquals(groupChatEntity.getId(), groupChat.getId());
        assertEquals(groupChatEntity.getName(), groupChat.getName());
        assertEquals(groupChatEntity.getDescription(), groupChat.getDescription());
        assertEquals(groupChatEntity.getPicture(), groupChat.getPicture());
        assertEquals("1970-01-02", groupChat.getDateOfCreation());
        assertNotNull(groupChat.getAdmin());
        assertNotNull(groupChat.getUsers());
    }

    @Test
    void toDomain_nullDate_test() {
        GroupChatEntity groupChatEntity = new GroupChatEntity();
        groupChatEntity.setId(1);
        groupChatEntity.setName("name");
        groupChatEntity.setDescription("description");
        groupChatEntity.setPicture("picture");
        groupChatEntity.setDateOfCreation(null);

        assertThrows(NullPointerException.class, () -> groupChatEntityMapper.toDomain(groupChatEntity));
    }

    @Test
    void toDomain_nullAdmin_test() {
        GroupChatEntity groupChatEntity = new GroupChatEntity();
        groupChatEntity.setId(1);
        groupChatEntity.setName("name");
        groupChatEntity.setDescription("description");
        groupChatEntity.setPicture("picture");
        groupChatEntity.setDateOfCreation(86400000L);

        assertThrows(NullPointerException.class, () -> groupChatEntityMapper.toDomain(groupChatEntity));
    }

    @Test
    void toDomain_nullUsers_test() {
        GroupChatEntity groupChatEntity = new GroupChatEntity();
        groupChatEntity.setId(1);
        groupChatEntity.setName("name");
        groupChatEntity.setDescription("description");
        groupChatEntity.setPicture("picture");
        groupChatEntity.setDateOfCreation(86400000L);
        UserEntity groupAdmin = new UserEntity();
        groupAdmin.setId(1);
        groupChatEntity.setGroupAdmin(groupAdmin);

        assertThrows(NullPointerException.class, () -> groupChatEntityMapper.toDomain(groupChatEntity));
    }

    @Test
    void toPersistence_ok_test() throws ParseException {
        GroupChat groupChat = new GroupChat();
        groupChat.setId(1);
        groupChat.setName("name");
        groupChat.setDescription("description");
        groupChat.setPicture("picture");
        groupChat.setDateOfCreation("1970-01-02");
        User groupAdmin = new User();
        groupAdmin.setId(1);
        groupChat.setAdmin(groupAdmin);
        groupChat.setUsers(List.of(groupAdmin));

        GroupChatEntity groupChatEntity = groupChatEntityMapper.toPersistence(groupChat);

        assertEquals(groupChat.getId(), groupChatEntity.getId());
        assertEquals(groupChat.getName(), groupChatEntity.getName());
        assertEquals(groupChat.getDescription(), groupChatEntity.getDescription());
        assertEquals(groupChat.getPicture(), groupChatEntity.getPicture());
        assertEquals(82800000L, groupChatEntity.getDateOfCreation());
        assertNotNull(groupChatEntity.getGroupAdmin());
        assertNotNull(groupChatEntity.getUsers());
    }

    @Test
    void toPersistence_nullDate_test() {
        GroupChat groupChat = new GroupChat();
        groupChat.setId(1);
        groupChat.setName("name");
        groupChat.setDescription("description");
        groupChat.setPicture("picture");
        groupChat.setDateOfCreation(null);

        assertThrows(NullPointerException.class, () -> groupChatEntityMapper.toPersistence(groupChat));
    }

    @Test
    void toPersistence_wrongDate_test() {
        GroupChat groupChat = new GroupChat();
        groupChat.setId(1);
        groupChat.setName("name");
        groupChat.setDescription("description");
        groupChat.setPicture("picture");
        groupChat.setDateOfCreation("-g.-dfgnhsdui48");

        assertThrows(ParseException.class, () -> groupChatEntityMapper.toPersistence(groupChat));
    }

    @Test
    void toPersistence_nullAdmin_test() {
        GroupChat groupChat = new GroupChat();
        groupChat.setId(1);
        groupChat.setName("name");
        groupChat.setDescription("description");
        groupChat.setPicture("picture");
        groupChat.setDateOfCreation("1970-01-02");

        assertThrows(NullPointerException.class, () -> groupChatEntityMapper.toPersistence(groupChat));
    }

    @Test
    void toPersistence_nullUsers_test() {
        GroupChat groupChat = new GroupChat();
        groupChat.setId(1);
        groupChat.setName("name");
        groupChat.setDescription("description");
        groupChat.setPicture("picture");
        groupChat.setDateOfCreation("1970-01-02");
        User groupAdmin = new User();
        groupAdmin.setId(1);
        groupChat.setAdmin(groupAdmin);

        assertThrows(NullPointerException.class, () -> groupChatEntityMapper.toPersistence(groupChat));
    }
}
