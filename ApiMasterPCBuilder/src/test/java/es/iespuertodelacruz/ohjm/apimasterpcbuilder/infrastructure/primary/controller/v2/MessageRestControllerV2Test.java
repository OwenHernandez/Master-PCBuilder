package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.primary.controller.v2;

import com.fasterxml.jackson.databind.ObjectMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Message;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IMessageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2.MessageRestControllerV2;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MessageRestControllerV2.class)
@ExtendWith(MockitoExtension.class)
public class MessageRestControllerV2Test {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private IMessageService messageService;

    @MockBean
    private IUserService userService;

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
    public void getAll_ok_receiverAuthor_test() throws Exception {
        Message message = new Message();
        message.setAuthor("Test Author");
        message.setReceiver("Test Receiver");

        List<Message> messages = Arrays.asList(message);

        User user = new User();
        user.setNick("Test Author");

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(messageService.findByReceiverAndAuthor(any(String.class), any(String.class))).thenReturn(messages);

        mockMvc.perform(get("/api/v2/messages")
                .param("receiver", "Test Receiver")
                .param("author", "Test Author"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].author").value(message.getAuthor()));
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getAll_ok_topic_test() throws Exception {
        Message message = new Message();
        message.setTopic("Test Topic");

        List<Message> messages = Arrays.asList(message);

        when(userService.findByNick(any(String.class))).thenReturn(new User());

        when(messageService.findByTopic(any(String.class))).thenReturn(messages);

        mockMvc.perform(get("/api/v2/messages")
                        .param("topic", "Test Topic"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].topic").value(message.getTopic()));
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getAll_unauthorized_test() throws Exception {

        when(userService.findByNick(any(String.class))).thenReturn(null);

        mockMvc.perform(get("/api/v2/messages"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getAll_badRequest_test() throws Exception {

        when(userService.findByNick(any(String.class))).thenReturn(new User());

        mockMvc.perform(get("/api/v2/messages"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getAll_forbidden_test() throws Exception {

        User user = new User();
        user.setNick("Test User");

        when(userService.findByNick(any(String.class))).thenReturn(user);

        mockMvc.perform(get("/api/v2/messages")
                        .param("receiver", "Test Receiver")
                        .param("author", "Test Author"))
                .andExpect(status().isForbidden());
    }
}
