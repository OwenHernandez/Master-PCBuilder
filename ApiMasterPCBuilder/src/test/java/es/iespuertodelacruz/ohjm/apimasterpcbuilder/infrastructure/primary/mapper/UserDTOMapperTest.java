package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.primary.mapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentOutputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.UserDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.ComponentDTOMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.UserDTOMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;

@ExtendWith(MockitoExtension.class)
class UserDTOMapperTest {

    @Mock
    private ComponentDTOMapper compMapper;

    @InjectMocks
    private UserDTOMapper userDTOMapper;

    private User user;
    private UserDTO userDTO;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setNick("UserNick");
        user.setEmail("user@example.com");
        user.setPicture("user_picture_url");
        user.setFriends(Collections.emptyList()); // Inicializa con listas vacías
        user.setComponentsWanted(Collections.emptyList());

        userDTO = new UserDTO();
        userDTO.setId(1L);
        userDTO.setNick("UserNick");
        userDTO.setEmail("user@example.com");
        userDTO.setPicture("user_picture_url");
        userDTO.setFriends(Collections.emptyList()); // Inicializa con listas vacías
        userDTO.setComponentsWanted(Collections.emptyList());
    }

    @Test
    void toDomain_ValidUserDTO_ReturnsUser() {
        UserDTO friendDTO = new UserDTO();
        friendDTO.setId(2L);
        friendDTO.setNick("FriendNick");
        friendDTO.setEmail("friend@example.com");
        friendDTO.setPicture("friend_picture_url");
        userDTO.setFriends(Collections.singletonList(friendDTO));

        User result = userDTOMapper.toDomain(userDTO);

        assertThat(result.getId()).isEqualTo(userDTO.getId());
        assertThat(result.getNick()).isEqualTo(userDTO.getNick());
        assertThat(result.getEmail()).isEqualTo(userDTO.getEmail());
        assertThat(result.getPicture()).isEqualTo(userDTO.getPicture());
        assertThat(result.getFriends()).hasSize(1);
        assertThat(result.getFriends().get(0).getNick()).isEqualTo("FriendNick");
    }

    @Test
    void toDTO_ValidUser_ReturnsUserDTO() {
        User friend = new User();
        friend.setId(2L);
        friend.setNick("FriendNick");
        friend.setEmail("friend@example.com");
        friend.setPicture("friend_picture_url");
        user.setFriends(Collections.singletonList(friend));

        Component component = new Component();
        ComponentOutputDTO componentDTO = new ComponentOutputDTO();
        when(compMapper.toDTO(any(Component.class))).thenReturn(componentDTO);

        UserDTO result = userDTOMapper.toDTO(user);

        assertThat(result.getId()).isEqualTo(user.getId());
        assertThat(result.getNick()).isEqualTo(user.getNick());
        assertThat(result.getEmail()).isEqualTo(user.getEmail());
        assertThat(result.getPicture()).isEqualTo(user.getPicture());
        assertThat(result.getFriends()).hasSize(1);
        assertThat(result.getFriends().get(0).getNick()).isEqualTo("FriendNick");
        assertThat(result.getComponentsWanted()).containsExactly(componentDTO);
    }

    @Test
    void toDTO_WithNullFriendsList_ShouldHandleGracefully() {
        user.setFriends(null);

        UserDTO result = userDTOMapper.toDTO(user);

        assertThat(result.getFriends()).isEmpty();
    }

    @Test
    void toDTO_WithEmptyComponentsWantedList_ReturnsUserDTOWithEmptyList() {
        user.setComponentsWanted(Collections.emptyList());

        UserDTO result = userDTOMapper.toDTO(user);

        assertThat(result.getComponentsWanted()).isEmpty();
    }

    @Test
    void toDTO_WhenPictureIsNull_ShouldHandleGracefully() {
        user.setPicture(null);

        UserDTO result = userDTOMapper.toDTO(user);

        assertThat(result.getPicture()).isNull();
    }
}
