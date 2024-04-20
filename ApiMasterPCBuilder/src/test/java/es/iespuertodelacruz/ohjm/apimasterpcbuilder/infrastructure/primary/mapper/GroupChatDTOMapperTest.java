package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.GroupChat;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.GroupChatInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.GroupChatOutputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.UserDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.GroupChatDTOMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.UserDTOMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GroupChatDTOMapperTest {

    @Mock
    private UserDTOMapper userDTOMapper;

    @InjectMocks
    private GroupChatDTOMapper groupChatDTOMapper;

    private GroupChat groupChat;
    private GroupChatInputDTO groupChatInputDTO;
    private UserDTO userOutputDTO;
    private User admin;
    private User user1, user2;

    @BeforeEach
    void setUp() {
        // Configurando el admin
        admin = new User();
        admin.setNick("AdminNick");

        // Configurando los usuarios
        user1 = new User();
        user2 = new User();

        // Configurando el groupChat
        groupChat = new GroupChat();
        groupChat.setId(1L);
        groupChat.setName("TechTalk");
        groupChat.setDescription("Discussing the latest in tech");
        groupChat.setPicture("pictureUrl");
        groupChat.setDateOfCreation("2023-04-01");
        groupChat.setAdmin(admin);
        groupChat.setUsers(Arrays.asList(user1, user2));

        // Configurando UserDTO para el admin
        userOutputDTO = new UserDTO();
        userOutputDTO.setNick("AdminNick");

        // Configurando GroupChatInputDTO
        groupChatInputDTO = new GroupChatInputDTO();
        groupChatInputDTO.setName("TechTalk");
        groupChatInputDTO.setDescription("Discussing the latest in tech");
        groupChatInputDTO.setPicture("pictureUrl");
        groupChatInputDTO.setPictureBase64("pictureBase64gjkirheighseiuhgrhhugheusighureshughushoghsedri");
    }

    @Test
    void toDomain_ValidGroupChat_ReturnsGroupChatOutputDTO() {

        GroupChat result = groupChatDTOMapper.toDomain(groupChatInputDTO);

        assertThat(result.getName()).isEqualTo(groupChatInputDTO.getName());
        assertThat(result.getDescription()).isEqualTo(groupChatInputDTO.getDescription());
    }

    @Test
    void toDTO_ValidGroupChat_ReturnsGroupChatOutputDTO() {
        GroupChatOutputDTO result = groupChatDTOMapper.toDTO(groupChat);

        assertThat(result.getId()).isEqualTo(groupChat.getId());
        assertThat(result.getName()).isEqualTo(groupChat.getName());
        assertThat(result.getDescription()).isEqualTo(groupChat.getDescription());
        assertThat(result.getPicture()).isEqualTo(groupChat.getPicture());
        assertThat(result.getDateOfCreation()).isEqualTo(groupChat.getDateOfCreation());

        assertThat(result.getAdmin().getNick()).isEqualTo(userOutputDTO.getNick());
        assertThat(result.getUsers()).hasSize(2);
        // Aquí podrías agregar más verificaciones específicas para los UserDTO si es necesario
    }
}
