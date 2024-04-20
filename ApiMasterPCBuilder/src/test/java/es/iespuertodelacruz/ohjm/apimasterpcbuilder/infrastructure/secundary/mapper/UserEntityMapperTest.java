package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.UserEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.ComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.SellerEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.UserEntity;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.text.ParseException;
import java.util.HashSet;
import java.util.List;

import static com.mongodb.assertions.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class UserEntityMapperTest {

    private final UserEntityMapper userEntityMapper = new UserEntityMapper();

    @Test
    void toDomain_ok_everything_test() {
        UserEntity userEntity = new UserEntity();
        userEntity.setId(1L);
        userEntity.setNick("nick");
        userEntity.setPassword("password");
        userEntity.setRole("role");
        userEntity.setActive((byte) 1);
        userEntity.setEmail("email");
        userEntity.setPicture("picture");
        userEntity.setHash("hash");

        ComponentEntity componentEntity = new ComponentEntity();
        componentEntity.setId(1);
        componentEntity.setName("name");
        componentEntity.setSeller(new SellerEntity());
        componentEntity.setUser(new UserEntity());

        userEntity.setComponentsCreated(List.of(componentEntity));
        userEntity.setComponentsWanted(List.of(componentEntity));

        UserEntity friend = new UserEntity();
        userEntity.setFriends(List.of(friend));

        UserEntity blockedUser = new UserEntity();
        userEntity.setBlockedUsers(List.of(blockedUser));

        User domain = userEntityMapper.toDomain(userEntity, new HashSet<>(), new HashSet<>(), "test");

        assertEquals(userEntity.getId(), domain.getId());
        assertEquals(userEntity.getNick(), domain.getNick());
        assertEquals(userEntity.getPassword(), domain.getPassword());
        assertEquals(userEntity.getRole(), domain.getRole());
        assertEquals(userEntity.getActive(), domain.getActive());
        assertEquals(userEntity.getEmail(), domain.getEmail());
        assertEquals(userEntity.getPicture(), domain.getPicture());
        assertEquals(userEntity.getHash(), domain.getHash());
        assertNotNull(domain.getComponentsCreated());
        assertNotNull(domain.getComponentsWanted());
        assertNotNull(domain.getFriends());
        assertNotNull(domain.getBlockedUsers());
    }

    @Test
    void toDomain_ok_noOtherTables_test() {
        UserEntity userEntity = new UserEntity();
        userEntity.setId(1L);
        userEntity.setNick("nick");
        userEntity.setPassword("password");
        userEntity.setRole("role");
        userEntity.setActive((byte) 1);
        userEntity.setEmail("email");
        userEntity.setPicture("picture");
        userEntity.setHash("hash");

        User domain = userEntityMapper.toDomain(userEntity, new HashSet<>(), new HashSet<>(), "test");

        assertEquals(userEntity.getId(), domain.getId());
        assertEquals(userEntity.getNick(), domain.getNick());
        assertEquals(userEntity.getPassword(), domain.getPassword());
        assertEquals(userEntity.getRole(), domain.getRole());
        assertEquals(userEntity.getActive(), domain.getActive());
        assertEquals(userEntity.getEmail(), domain.getEmail());
        assertEquals(userEntity.getPicture(), domain.getPicture());
        assertEquals(userEntity.getHash(), domain.getHash());
        assertNull(domain.getComponentsCreated());
        assertNull(domain.getComponentsWanted());
        assertNull(domain.getFriends());
        assertNull(domain.getBlockedUsers());
    }

    @Test
    void toPersistence_ok_everything_test() throws ParseException {
        User user = new User();
        user.setId(1L);
        user.setNick("nick");
        user.setPassword("password");
        user.setRole("role");
        user.setActive((byte) 1);
        user.setEmail("email");
        user.setPicture("picture");
        user.setHash("hash");

        Component component = new Component();
        component.setId(1);
        component.setName("name");
        component.setSeller(new Seller());
        component.setUserWhoCreated(new User());

        user.setComponentsCreated(List.of(component));
        user.setComponentsWanted(List.of(component));

        User friend = new User();
        user.setFriends(List.of(friend));

        User blockedUser = new User();
        user.setBlockedUsers(List.of(blockedUser));

        UserEntity userEntity = userEntityMapper.toPersistence(user, new HashSet<>(), new HashSet<>(), "test");

        assertEquals(user.getId(), userEntity.getId());
        assertEquals(user.getNick(), userEntity.getNick());
        assertEquals(user.getPassword(), userEntity.getPassword());
        assertEquals(user.getRole(), userEntity.getRole());
        assertEquals(user.getActive(), userEntity.getActive());
        assertEquals(user.getEmail(), userEntity.getEmail());
        assertEquals(user.getPicture(), userEntity.getPicture());
        assertEquals(user.getHash(), userEntity.getHash());
        assertNotNull(userEntity.getComponentsCreated());
        assertNotNull(userEntity.getComponentsWanted());
        assertNotNull(userEntity.getFriends());
        assertNotNull(userEntity.getBlockedUsers());
    }

    @Test
    void toPersistence_ok_noOtherTables_test() throws ParseException {
        User user = new User();
        user.setId(1L);
        user.setNick("nick");
        user.setPassword("password");
        user.setRole("role");
        user.setActive((byte) 1);
        user.setEmail("email");
        user.setPicture("picture");
        user.setHash("hash");

        UserEntity userEntity = userEntityMapper.toPersistence(user, new HashSet<>(), new HashSet<>(), "test");

        assertEquals(user.getId(), userEntity.getId());
        assertEquals(user.getNick(), userEntity.getNick());
        assertEquals(user.getPassword(), userEntity.getPassword());
        assertEquals(user.getRole(), userEntity.getRole());
        assertEquals(user.getActive(), userEntity.getActive());
        assertEquals(user.getEmail(), userEntity.getEmail());
        assertEquals(user.getPicture(), userEntity.getPicture());
        assertEquals(user.getHash(), userEntity.getHash());
        assertNotNull(userEntity.getComponentsCreated());
        assertNotNull(userEntity.getComponentsWanted());
        assertNotNull(userEntity.getFriends());
        assertNotNull(userEntity.getBlockedUsers());
    }
}
