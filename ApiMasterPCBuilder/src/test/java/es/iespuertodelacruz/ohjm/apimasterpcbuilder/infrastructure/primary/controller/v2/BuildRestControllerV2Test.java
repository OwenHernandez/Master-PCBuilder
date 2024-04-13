package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.primary.controller.v2;

import static org.hamcrest.CoreMatchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.List;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IBuildService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2.BuildRestControllerV2;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.BuildInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;


@WebMvcTest(BuildRestControllerV2.class)
@ExtendWith(MockitoExtension.class)
public class BuildRestControllerV2Test {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private IBuildService buildService;

    @MockBean
    private IUserService userService;

    @MockBean
    IComponentService componentService;

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
        Build build = new Build();
        build.setId(1L);
        build.setName("Test Build");

        List<Build> builds = Arrays.asList(build);

        when(userService.findByNick(any(String.class))).thenReturn(new User());

        when(buildService.findByUserId(any(Long.class))).thenReturn(builds);

        mockMvc.perform(get("/api/v2/builds"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value(build.getName()));
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getByUserId_notFound_test() throws Exception {

        when(userService.findByNick(any(String.class))).thenReturn(new User());

        when(buildService.findByUserId(any(Long.class))).thenReturn(null);

        mockMvc.perform(get("/api/v2/builds"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getByUserId_unauthorized_test() throws Exception {

        when(userService.findByNick(any(String.class))).thenReturn(null);

        mockMvc.perform(get("/api/v2/builds"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void save_test() throws Exception {
        BuildInputDTO buildInputDTO = new BuildInputDTO();
        buildInputDTO.setCategory("Gaming");
        buildInputDTO.setName("Test Build");
        buildInputDTO.setComponentsIds(List.of(1L, 2L));


        Build build = new Build();
        build.setId(1L);
        build.setName("Test Build");

        when(userService.findByNick(any(String.class))).thenReturn(new User());

        when(componentService.findById(any(Long.class))).thenReturn(new Component());

        when(buildService.save(any(Build.class))).thenReturn(build);

        mockMvc.perform(post("/api/v2/builds")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildInputDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is(build.getName())));
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void save_unauthorized_test() throws Exception {

        when(userService.findByNick(any(String.class))).thenReturn(null);

        mockMvc.perform(post("/api/v2/builds")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new BuildInputDTO())))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void save_badRequest_bodyNull_test() throws Exception {

        mockMvc.perform(post("/api/v2/builds")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(null)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void save_badRequest_wrongCategory_test() throws Exception {

        when(userService.findByNick(any(String.class))).thenReturn(new User());

        BuildInputDTO buildInputDTO = new BuildInputDTO();
        buildInputDTO.setCategory("Coso");
        buildInputDTO.setName("Test Build");

        mockMvc.perform(post("/api/v2/builds")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildInputDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void save_badRequest_compNull_test() throws Exception {

        when(userService.findByNick(any(String.class))).thenReturn(new User());

        BuildInputDTO buildInputDTO = new BuildInputDTO();
        buildInputDTO.setCategory("Gaming");
        buildInputDTO.setName("Test Build");
        buildInputDTO.setComponentsIds(List.of(1L, 2L));

        when(componentService.findById(any(Long.class))).thenReturn(null);

        mockMvc.perform(post("/api/v2/builds")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildInputDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void save_internalServerError_test() throws Exception {

        when(userService.findByNick(any(String.class))).thenReturn(new User());

        BuildInputDTO buildInputDTO = new BuildInputDTO();
        buildInputDTO.setCategory("Gaming");
        buildInputDTO.setName("Test Build");
        buildInputDTO.setComponentsIds(List.of(1L, 2L));

        when(componentService.findById(any(Long.class))).thenReturn(new Component());

        when(buildService.save(any(Build.class))).thenReturn(null);

        mockMvc.perform(post("/api/v2/builds")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildInputDTO)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void delete_test() throws Exception {
        Build build = new Build();
        build.setId(1L);
        build.setName("Test Build");

        User user = new User();
        user.setId(1);
        build.setUser(user);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(buildService.findById(any(Long.class))).thenReturn(build);

        when(buildService.deleteById(any(Long.class))).thenReturn(true);

        mockMvc.perform(delete("/api/v2/builds/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void delete_badRequest_test() throws Exception {

        mockMvc.perform(delete("/api/v2/builds/null"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void delete_unauthorized_test() throws Exception {

        when(userService.findByNick(any(String.class))).thenReturn(null);

        mockMvc.perform(delete("/api/v2/builds/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void delete_notFound_test() throws Exception {
        Build build = new Build();
        build.setId(1L);
        build.setName("Test Build");

        User user = new User();
        user.setId(1);
        build.setUser(user);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(buildService.findById(any(Long.class))).thenReturn(null);

        mockMvc.perform(delete("/api/v2/builds/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void delete_forbidden_test() throws Exception {
        Build build = new Build();
        build.setId(1L);
        build.setName("Test Build");

        User user1 = new User();
        user1.setId(1);
        build.setUser(user1);

        User user2 = new User();
        user2.setId(2);

        when(userService.findByNick(any(String.class))).thenReturn(user2);

        when(buildService.findById(any(Long.class))).thenReturn(build);

        mockMvc.perform(delete("/api/v2/builds/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void delete_internalServerError_test() throws Exception {
        Build build = new Build();
        build.setId(1L);
        build.setName("Test Build");

        User user = new User();
        user.setId(1);
        build.setUser(user);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(buildService.findById(any(Long.class))).thenReturn(build);

        when(buildService.deleteById(any(Long.class))).thenReturn(false);

        mockMvc.perform(delete("/api/v2/builds/1"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void update_test() throws Exception {
        BuildInputDTO buildInputDTO = new BuildInputDTO();
        buildInputDTO.setCategory("Gaming");
        buildInputDTO.setName("Test Build");
        buildInputDTO.setComponentsIds(List.of(1L, 2L));

        Build build = new Build();
        build.setId(1L);
        build.setName("Test Build");
        build.setCategory("Gaming");

        User user = new User();
        user.setId(1);
        build.setUser(user);

        when(buildService.findById(any(Long.class))).thenReturn(build);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(componentService.findById(any(Long.class))).thenReturn(new Component());

        when(buildService.update(any(Build.class))).thenReturn(true);

        mockMvc.perform(put("/api/v2/builds/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildInputDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", is("Build Successfully updated")));
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void update_badRequest_bodyParamNull_test() throws Exception {

        mockMvc.perform(put("/api/v2/builds/null")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(null)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void update_badRequest_wrongCategory_test() throws Exception {
        BuildInputDTO buildInputDTO = new BuildInputDTO();
        buildInputDTO.setCategory("Coso");
        buildInputDTO.setName("Test Build");

        Build build = new Build();
        build.setId(1L);
        build.setName("Test Build");
        build.setCategory("Gaming");

        User user = new User();
        user.setId(1);
        build.setUser(user);

        when(buildService.findById(any(Long.class))).thenReturn(build);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        mockMvc.perform(put("/api/v2/builds/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildInputDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void update_badRequest_compNull_test() throws Exception {
        BuildInputDTO buildInputDTO = new BuildInputDTO();
        buildInputDTO.setCategory("Gaming");
        buildInputDTO.setName("Test Build");
        buildInputDTO.setComponentsIds(List.of(1L, 2L));

        Build build = new Build();
        build.setId(1L);
        build.setName("Test Build");
        build.setCategory("Gaming");

        User user = new User();
        user.setId(1);
        build.setUser(user);

        when(buildService.findById(any(Long.class))).thenReturn(build);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(componentService.findById(any(Long.class))).thenReturn(null);

        mockMvc.perform(put("/api/v2/builds/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildInputDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void update_unauthorized_test() throws Exception {
        BuildInputDTO buildInputDTO = new BuildInputDTO();
        buildInputDTO.setCategory("Gaming");
        buildInputDTO.setName("Test Build");
        buildInputDTO.setComponentsIds(List.of(1L, 2L));

        when(userService.findByNick(any(String.class))).thenReturn(null);

        mockMvc.perform(put("/api/v2/builds/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildInputDTO)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void update_notFound_test() throws Exception {
        BuildInputDTO buildInputDTO = new BuildInputDTO();
        buildInputDTO.setCategory("Gaming");
        buildInputDTO.setName("Test Build");
        buildInputDTO.setComponentsIds(List.of(1L, 2L));

        User user = new User();
        user.setId(1);

        when(buildService.findById(any(Long.class))).thenReturn(null);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        mockMvc.perform(put("/api/v2/builds/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildInputDTO)))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void update_forbidden_test() throws Exception {
        BuildInputDTO buildInputDTO = new BuildInputDTO();
        buildInputDTO.setCategory("Gaming");
        buildInputDTO.setName("Test Build");
        buildInputDTO.setComponentsIds(List.of(1L, 2L));

        Build build = new Build();
        build.setId(1L);
        build.setName("Test Build");
        build.setCategory("Gaming");

        User user1 = new User();
        user1.setId(1);
        build.setUser(user1);

        User user2 = new User();
        user2.setId(2);

        when(buildService.findById(any(Long.class))).thenReturn(build);

        when(userService.findByNick(any(String.class))).thenReturn(user2);

        mockMvc.perform(put("/api/v2/builds/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildInputDTO)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void update_internalServerError_test() throws Exception {
        BuildInputDTO buildInputDTO = new BuildInputDTO();
        buildInputDTO.setCategory("Gaming");
        buildInputDTO.setName("Test Build");
        buildInputDTO.setComponentsIds(List.of(1L, 2L));

        Build build = new Build();
        build.setId(1L);
        build.setName("Test Build");
        build.setCategory("Gaming");

        User user = new User();
        user.setId(1);
        build.setUser(user);

        when(buildService.findById(any(Long.class))).thenReturn(build);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(componentService.findById(any(Long.class))).thenReturn(new Component());

        when(buildService.update(any(Build.class))).thenReturn(false);

        mockMvc.perform(put("/api/v2/builds/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildInputDTO)))
                .andExpect(status().isInternalServerError());
    }
}
