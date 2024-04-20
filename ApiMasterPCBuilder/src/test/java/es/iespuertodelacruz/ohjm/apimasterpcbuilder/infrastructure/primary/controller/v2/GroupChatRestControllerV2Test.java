package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.primary.controller.v2;

import com.fasterxml.jackson.databind.ObjectMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.GroupChat;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IGroupChatService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.FileStorageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2.GroupChatRestControllerV2;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.GroupChatInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(GroupChatRestControllerV2.class)
@ExtendWith(MockitoExtension.class)
public class GroupChatRestControllerV2Test {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private IGroupChatService groupChatService;

    @MockBean
    private IUserService userService;

    @MockBean
    private FileStorageService fileStorageService;

    @MockBean
    private JwtService jwtService;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @BeforeEach
    public void setup() {
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .build();
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getByUserId_ok_test() throws Exception {
        GroupChat groupChat = new GroupChat();
        groupChat.setId(1L);
        groupChat.setName("Test GroupChat");

        User user = new User();
        user.setId(1);
        user.setNick("user");
        groupChat.setAdmin(user);

        List<GroupChat> groupChats = Arrays.asList(groupChat);

        when(userService.findById(any(Long.class))).thenReturn(user);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(groupChatService.findByUserId(any(Long.class))).thenReturn(groupChats);

        mockMvc.perform(get("/api/v2/groups")
                        .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value(groupChat.getName()));
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getByUserId_unauthorized_test() throws Exception {

        when(userService.findById(any(Long.class))).thenReturn(null);

        when(userService.findByNick(any(String.class))).thenReturn(null);

        mockMvc.perform(get("/api/v2/groups")
                        .param("userId", "1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getByUserId_notFound_test() throws Exception {
        User user = new User();
        user.setId(1);
        user.setNick("user");

        when(userService.findById(any(Long.class))).thenReturn(user);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(groupChatService.findByUserId(any(Long.class))).thenReturn(null);

        mockMvc.perform(get("/api/v2/groups")
                        .param("userId", "1"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getByUserId_forbidden_test() throws Exception {

        User user1 = new User();
        user1.setId(1);
        user1.setNick("user1");

        User user2 = new User();
        user2.setId(2);
        user2.setNick("user2");

        when(userService.findById(any(Long.class))).thenReturn(user1);

        when(userService.findByNick(any(String.class))).thenReturn(user2);

        mockMvc.perform(get("/api/v2/groups")
                        .param("userId", "1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void save_ok_test() throws Exception {
        GroupChatInputDTO groupChatInputDTO = new GroupChatInputDTO();
        groupChatInputDTO.setName("Test GroupChat");
        groupChatInputDTO.setPicture("Test Image");
        groupChatInputDTO.setPictureBase64("hghsdfhgfsjuighsfdujhsdfjungnhrdfnhsgujifdhguihsrighrdighhsdkjngjfdngkjsfhdgsrhdgurhlrudhgihdsrhusughsruidhgrdshgurhdsluigh");

        GroupChat groupChat = new GroupChat();
        groupChat.setId(1L);
        groupChat.setName("Test GroupChat");

        User user = new User();
        user.setId(1);
        user.setNick("user");
        groupChat.setAdmin(user);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(groupChatService.save(any(GroupChat.class))).thenReturn(groupChat);

        when(fileStorageService.save(any(String.class), any(byte[].class))).thenReturn("Test Image");

        mockMvc.perform(post("/api/v2/groups")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(groupChatInputDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is(groupChat.getName())));
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void save_unauthorized_test() throws Exception {

        when(userService.findByNick(any(String.class))).thenReturn(null);

        mockMvc.perform(post("/api/v2/groups")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new GroupChatInputDTO())))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void save_internalServerError_test() throws Exception {
        GroupChatInputDTO groupChatInputDTO = new GroupChatInputDTO();
        groupChatInputDTO.setName("Test GroupChat");
        groupChatInputDTO.setPicture("Test Image");
        groupChatInputDTO.setPictureBase64("hghsdfhgfsjuighsfdujhsdfjungnhrdfnhsgujifdhguihsrighrdighhsdkjngjfdngkjsfhdgsrhdgurhlrudhgihdsrhusughsruidhgrdshgurhdsluigh");

        User user = new User();
        user.setId(1);
        user.setNick("user");

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(groupChatService.save(any(GroupChat.class))).thenReturn(null);

        when(fileStorageService.save(any(String.class), any(byte[].class))).thenReturn("Test Image");

        mockMvc.perform(post("/api/v2/groups")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(groupChatInputDTO)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getFiles_ok_test() throws Exception {
        long compId = 1L;
        String filename = "testImage.jpg";

        // Simulación de la obtención del componente
        GroupChat mockGroupChat = new GroupChat();
        mockGroupChat.setId(compId);
        mockGroupChat.setName("Test Component");
        mockGroupChat.setPicture(filename);
        when(groupChatService.findById(any(Long.class))).thenReturn(mockGroupChat);

        // Simulación del usuario y autenticación
        User mockUser = mock(User.class);
        when(userService.findByNick("user")).thenReturn(mockUser);

        // Simulación de la obtención del recurso (imagen)
        Resource mockResource = mock(Resource.class);
        when(mockResource.getInputStream()).thenReturn(mock(InputStream.class));
        when(fileStorageService.get(filename)).thenReturn(mockResource);

        mockMvc.perform(get("/api/v2/groups/img/{id}/{filename}", compId, filename))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getFiles_notFound_compNull_test() throws Exception {
        long compId = 1L;
        String filename = "testImage.jpg";

        // Simulación de la obtención del componente
        GroupChat mockGroupChat = new GroupChat();
        mockGroupChat.setId(compId);
        mockGroupChat.setName("Test Component");
        mockGroupChat.setPicture(filename);
        when(groupChatService.findById(any(Long.class))).thenReturn(null);

        mockMvc.perform(get("/api/v2/groups/img/{id}/{filename}", compId, filename))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getFiles_notFound_noImg_test() throws Exception {
        long compId = 1L;
        String filename = "testImage.jpg";

        // Simulación de la obtención del componente
        GroupChat mockGroupChat = new GroupChat();
        mockGroupChat.setId(compId);
        mockGroupChat.setName("Test Component");
        mockGroupChat.setPicture(filename);
        when(groupChatService.findById(any(Long.class))).thenReturn(mockGroupChat);

        // Simulación del usuario y autenticación
        User mockUser = mock(User.class);
        when(userService.findByNick("user")).thenReturn(mockUser);

        when(fileStorageService.get(filename)).thenThrow(new RuntimeException());

        mockMvc.perform(get("/api/v2/groups/img/{id}/{filename}", compId, filename))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getFiles_unauthorized_test() throws Exception {
        long compId = 1L;
        String filename = "testImage.jpg";

        // Simulación de la obtención del componente
        GroupChat mockGroupChat = new GroupChat();
        mockGroupChat.setId(compId);
        mockGroupChat.setName("Test Component");
        mockGroupChat.setPicture(filename);
        when(groupChatService.findById(any(Long.class))).thenReturn(mockGroupChat);

        when(userService.findByNick("user")).thenReturn(null);

        mockMvc.perform(get("/api/v2/groups/img/{id}/{filename}", compId, filename))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void update_ok_test() throws Exception {
        GroupChatInputDTO groupChatInputDTO = new GroupChatInputDTO();
        groupChatInputDTO.setName("Test Component");
        groupChatInputDTO.setPicture("Test Image");
        groupChatInputDTO.setPictureBase64("hghsdfhgfsjuighsfdujhsdfjungnhrdfnhgujifdhguihsrighrdighhsdkjngjfdngkjsfhdgsrhdgurhlrudhgihdsrhusughsruidhgrdshgurhdsluigh");

        GroupChat groupChat = new GroupChat();
        groupChat.setId(1L);
        groupChat.setName("Test Component");

        User user = new User();
        user.setId(1);
        user.setNick("user");
        groupChat.setAdmin(user);

        when(groupChatService.findById(any(Long.class))).thenReturn(groupChat);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(groupChatService.update(any(GroupChat.class))).thenReturn(true);

        when(fileStorageService.save(any(String.class), any(byte[].class))).thenReturn("Test Image");

        mockMvc.perform(put("/api/v2/groups/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(groupChatInputDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is(groupChat.getName())));
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void update_unauthorized_test() throws Exception {

        when(userService.findByNick(any(String.class))).thenReturn(null);

        mockMvc.perform(put("/api/v2/groups/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new GroupChatInputDTO())))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void update_forbidden_test() throws Exception {
        GroupChatInputDTO groupChatInputDTO = new GroupChatInputDTO();
        groupChatInputDTO.setName("Test Component");

        GroupChat groupChat = new GroupChat();
        groupChat.setId(1L);
        groupChat.setName("Test Component");

        User user1 = new User();
        user1.setId(1);
        user1.setNick("user1");

        User user2 = new User();
        user2.setId(2);
        user2.setNick("user2");

        groupChat.setAdmin(user2);

        when(groupChatService.findById(any(Long.class))).thenReturn(groupChat);

        when(userService.findByNick(any(String.class))).thenReturn(user1);

        mockMvc.perform(put("/api/v2/groups/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(groupChatInputDTO)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void update_notFound_test() throws Exception {
        GroupChatInputDTO groupChatInputDTO = new GroupChatInputDTO();
        groupChatInputDTO.setName("Test Component");

        User user = new User();
        user.setId(1);
        user.setNick("user");

        when(groupChatService.findById(any(Long.class))).thenReturn(null);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        mockMvc.perform(put("/api/v2/groups/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(groupChatInputDTO)))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void update_internalServerError_test() throws Exception {
        GroupChatInputDTO groupChatInputDTO = new GroupChatInputDTO();
        groupChatInputDTO.setName("Test Component");
        groupChatInputDTO.setPicture("Test Image");
        groupChatInputDTO.setPictureBase64("hghsdfhgfsjuighsfdujhsdfjungnhrdfnhgujifdhguihsrighrdighhsdkjngjfdngkjsfhdgsrhdgurhlrudhgihdsrhusughsruidhgrdshgurhdsluigh");

        GroupChat groupChat = new GroupChat();
        groupChat.setId(1L);
        groupChat.setName("Test Component");

        User user = new User();
        user.setId(1);
        user.setNick("user");
        groupChat.setAdmin(user);

        when(groupChatService.findById(any(Long.class))).thenReturn(groupChat);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(groupChatService.update(any(GroupChat.class))).thenReturn(false);

        when(fileStorageService.save(any(String.class), any(byte[].class))).thenReturn("Test Image");

        mockMvc.perform(put("/api/v2/groups/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(groupChatInputDTO)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void addRemoveUser_ok_add_test() throws Exception {
        GroupChat groupChat = new GroupChat();
        groupChat.setId(1L);
        groupChat.setName("Test Component");

        User user = new User();
        user.setId(1);
        user.setNick("user");
        groupChat.setAdmin(user);

        when(groupChatService.findById(any(Long.class))).thenReturn(groupChat);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(userService.findById(any(Long.class))).thenReturn(user);

        when(groupChatService.update(any(GroupChat.class))).thenReturn(true);

        mockMvc.perform(put("/api/v2/groups/1/users/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.users[0].nick", is(user.getNick())));
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void addRemoveUser_ok_remove_test() throws Exception {
        GroupChat groupChat = new GroupChat();
        groupChat.setId(1L);
        groupChat.setName("Test Component");

        User user1 = new User();
        user1.setId(1);
        user1.setNick("user");
        groupChat.setAdmin(user1);

        User user2 = new User();
        user2.setId(2);
        user2.setNick("user2");
        groupChat.setUsers(new ArrayList<>(List.of(user2)));

        when(groupChatService.findById(any(Long.class))).thenReturn(groupChat);

        when(userService.findByNick(any(String.class))).thenReturn(user1);

        when(userService.findById(any(Long.class))).thenReturn(user2);

        when(groupChatService.update(any(GroupChat.class))).thenReturn(true);

        mockMvc.perform(put("/api/v2/groups/1/users/2"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void addRemoveUser_unauthorized_test() throws Exception {

        when(userService.findByNick(any(String.class))).thenReturn(null);

        mockMvc.perform(put("/api/v2/groups/1/users/2"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void addRemoveUser_notFound_group_test() throws Exception {
        User user1 = new User();
        user1.setId(1);
        user1.setNick("user");

        when(groupChatService.findById(any(Long.class))).thenReturn(null);

        when(userService.findByNick(any(String.class))).thenReturn(user1);

        mockMvc.perform(put("/api/v2/groups/1/users/2"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void addRemoveUser_notFound_user_test() throws Exception {
        GroupChat groupChat = new GroupChat();
        groupChat.setId(1L);
        groupChat.setName("Test Component");

        User user1 = new User();
        user1.setId(1);
        user1.setNick("user");
        groupChat.setAdmin(user1);

        when(groupChatService.findById(any(Long.class))).thenReturn(groupChat);

        when(userService.findByNick(any(String.class))).thenReturn(user1);

        when(userService.findById(any(Long.class))).thenReturn(null);

        mockMvc.perform(put("/api/v2/groups/1/users/2"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void addRemoveUser_forbidden_add_test() throws Exception {
        GroupChat groupChat = new GroupChat();
        groupChat.setId(1L);
        groupChat.setName("Test Component");

        User user1 = new User();
        user1.setId(1);
        user1.setNick("user");
        groupChat.setAdmin(user1);

        User user2 = new User();
        user2.setId(2);
        user2.setNick("user2");
        groupChat.setUsers(new ArrayList<>(List.of(user2)));

        when(groupChatService.findById(any(Long.class))).thenReturn(groupChat);

        when(userService.findByNick(any(String.class))).thenReturn(user2);

        when(userService.findById(any(Long.class))).thenReturn(user2);

        when(groupChatService.update(any(GroupChat.class))).thenReturn(true);

        mockMvc.perform(put("/api/v2/groups/1/users/2"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void addRemoveUser_forbidden_remove_admin_test() throws Exception {
        GroupChat groupChat = new GroupChat();
        groupChat.setId(1L);
        groupChat.setName("Test Component");

        User user1 = new User();
        user1.setId(1);
        user1.setNick("user");
        groupChat.setAdmin(user1);

        groupChat.setUsers(new ArrayList<>(List.of(user1)));

        when(groupChatService.findById(any(Long.class))).thenReturn(groupChat);

        when(userService.findByNick(any(String.class))).thenReturn(user1);

        when(userService.findById(any(Long.class))).thenReturn(user1);

        when(groupChatService.update(any(GroupChat.class))).thenReturn(true);

        mockMvc.perform(put("/api/v2/groups/1/users/2"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void addRemoveUser_forbidden_remove_notAdminNotUser_test() throws Exception {
        GroupChat groupChat = new GroupChat();
        groupChat.setId(1L);
        groupChat.setName("Test Component");

        User user1 = new User();
        user1.setId(1);
        user1.setNick("user");
        groupChat.setAdmin(user1);

        User user2 = new User();
        user2.setId(2);
        user2.setNick("user2");
        groupChat.setUsers(new ArrayList<>(List.of(user2)));

        User user3 = new User();
        user3.setId(3);
        user3.setNick("user3");

        when(groupChatService.findById(any(Long.class))).thenReturn(groupChat);

        when(userService.findByNick(any(String.class))).thenReturn(user2);

        when(userService.findById(any(Long.class))).thenReturn(user3);

        when(groupChatService.update(any(GroupChat.class))).thenReturn(true);

        mockMvc.perform(put("/api/v2/groups/1/users/2"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void addRemoveUser_internalServerError_test() throws Exception {
        GroupChat groupChat = new GroupChat();
        groupChat.setId(1L);
        groupChat.setName("Test Component");

        User user1 = new User();
        user1.setId(1);
        user1.setNick("user");
        groupChat.setAdmin(user1);

        User user2 = new User();
        user2.setId(2);
        user2.setNick("user2");
        groupChat.setUsers(new ArrayList<>(List.of(user2)));

        when(groupChatService.findById(any(Long.class))).thenReturn(groupChat);

        when(userService.findByNick(any(String.class))).thenReturn(user1);

        when(userService.findById(any(Long.class))).thenReturn(user2);

        when(groupChatService.update(any(GroupChat.class))).thenReturn(false);

        mockMvc.perform(put("/api/v2/groups/1/users/2"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void addRemoveAdmin_ok_test() throws Exception {
        GroupChat groupChat = new GroupChat();
        groupChat.setId(1L);
        groupChat.setName("Test Component");

        User user1 = new User();
        user1.setId(1);
        user1.setNick("user");
        groupChat.setAdmin(user1);

        User user2 = new User();
        user2.setId(2);
        user2.setNick("user2");
        groupChat.setUsers(new ArrayList<>(List.of(user2)));

        when(groupChatService.findById(any(Long.class))).thenReturn(groupChat);

        when(userService.findByNick(any(String.class))).thenReturn(user1);

        when(userService.findById(any(Long.class))).thenReturn(user2);

        when(groupChatService.update(any(GroupChat.class))).thenReturn(true);

        mockMvc.perform(put("/api/v2/groups/1/admins/2"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void addRemoveAdmin_unauthorized_test() throws Exception {

        when(userService.findByNick(any(String.class))).thenReturn(null);

        mockMvc.perform(put("/api/v2/groups/1/admins/2"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void addRemoveAdmin_notFound_group_test() throws Exception {

        User user1 = new User();
        user1.setId(1);
        user1.setNick("user");

        when(groupChatService.findById(any(Long.class))).thenReturn(null);

        when(userService.findByNick(any(String.class))).thenReturn(user1);

        mockMvc.perform(put("/api/v2/groups/1/admins/2"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void addRemoveAdmin_notFound_user_test() throws Exception {
        GroupChat groupChat = new GroupChat();
        groupChat.setId(1L);
        groupChat.setName("Test Component");

        User user1 = new User();
        user1.setId(1);
        user1.setNick("user");
        groupChat.setAdmin(user1);

        when(groupChatService.findById(any(Long.class))).thenReturn(groupChat);

        when(userService.findByNick(any(String.class))).thenReturn(user1);

        when(userService.findById(any(Long.class))).thenReturn(null);

        mockMvc.perform(put("/api/v2/groups/1/admins/2"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void addRemoveAdmin_forbidden_test() throws Exception {
        GroupChat groupChat = new GroupChat();
        groupChat.setId(1L);
        groupChat.setName("Test Component");

        User user1 = new User();
        user1.setId(1);
        user1.setNick("user");
        groupChat.setAdmin(user1);

        User user2 = new User();
        user2.setId(2);
        user2.setNick("user2");
        groupChat.setUsers(new ArrayList<>(List.of(user2)));

        when(groupChatService.findById(any(Long.class))).thenReturn(groupChat);

        when(userService.findByNick(any(String.class))).thenReturn(user2);

        when(userService.findById(any(Long.class))).thenReturn(user2);

        mockMvc.perform(put("/api/v2/groups/1/admins/2"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void addRemoveAdmin_badRequest_test() throws Exception {
        GroupChat groupChat = new GroupChat();
        groupChat.setId(1L);
        groupChat.setName("Test Component");

        User user1 = new User();
        user1.setId(1);
        user1.setNick("user");
        groupChat.setAdmin(user1);

        User user2 = new User();
        user2.setId(2);
        user2.setNick("user2");

        when(groupChatService.findById(any(Long.class))).thenReturn(groupChat);

        when(userService.findByNick(any(String.class))).thenReturn(user1);

        when(userService.findById(any(Long.class))).thenReturn(user2);

        when(groupChatService.update(any(GroupChat.class))).thenReturn(true);

        mockMvc.perform(put("/api/v2/groups/1/admins/2"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void addRemoveAdmin_internalServerError_test() throws Exception {
        GroupChat groupChat = new GroupChat();
        groupChat.setId(1L);
        groupChat.setName("Test Component");

        User user1 = new User();
        user1.setId(1);
        user1.setNick("user");
        groupChat.setAdmin(user1);

        User user2 = new User();
        user2.setId(2);
        user2.setNick("user2");
        groupChat.setUsers(new ArrayList<>(List.of(user2)));

        when(groupChatService.findById(any(Long.class))).thenReturn(groupChat);

        when(userService.findByNick(any(String.class))).thenReturn(user1);

        when(userService.findById(any(Long.class))).thenReturn(user2);

        when(groupChatService.update(any(GroupChat.class))).thenReturn(false);

        mockMvc.perform(put("/api/v2/groups/1/admins/2"))
                .andExpect(status().isInternalServerError());
    }
}