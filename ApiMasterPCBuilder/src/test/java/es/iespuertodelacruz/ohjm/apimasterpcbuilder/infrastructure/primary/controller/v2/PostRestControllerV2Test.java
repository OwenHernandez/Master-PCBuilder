package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.primary.controller.v2;

import com.fasterxml.jackson.databind.ObjectMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Post;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IBuildService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IPostService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.FileStorageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2.PostRestControllerV2;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.PostInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.PostOutputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.PostDTOMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.security.JwtService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.context.WebApplicationContext;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(PostRestControllerV2.class)
public class PostRestControllerV2Test {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private IPostService service;
    @MockBean
    private JwtService jwtService;
    @MockBean
    private IBuildService buildService;

    @MockBean
    private IUserService userService;

    @MockBean
    private FileStorageService storageService;
    @Autowired
    private WebApplicationContext webApplicationContext;
    @MockBean
    private PlatformTransactionManager transactionManager;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    void findAllWhenNoParamsProvided() throws Exception {
        Post post = new Post();
        post.setId(1L);
        post.setTitle("Test Post");

        Build build = new Build();
        build.setId(1L);
        build.setName("My Build");
        post.setBuild(build);

        User user = new User();
        user.setId(1L);
        user.setNick("user");
        post.setUser(user);
        build.setUser(user);

        given(service.findAll()).willReturn(Arrays.asList(post));

        mockMvc.perform(get("/api/v2/posts")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(post.getId()))
                .andExpect(jsonPath("$[0].title").value(post.getTitle()));
    }
    @Test
    @WithMockUser(username = "user", roles = "USER")
    void savePost() throws Exception {
        PostInputDTO inputDTO = new PostInputDTO();
        inputDTO.setTitle("Test Post");
        inputDTO.setBuildId(1L);
        inputDTO.setImage("image");
        inputDTO.setImage64("base64ImageStringkhdfhjghjdkshruhgislghirhiugrihsgrhguidhgsvhgirdshgddrighrd");

        User user = new User();
        user.setId(1L);
        user.setNick("user");

        Build build = new Build();
        build.setId(1L);
        build.setName("My Build");
        build.setNotes("This is a description of my build.");
        build.setTotalPrice(1000.00);
        build.setBuildsComponents(Arrays.asList(new BuildComponent(), new BuildComponent()));
        build.setUser(user);
        Post post = new Post();
        post.setId(1L);
        post.setBuild(build);
        post.setTitle("Test Post");
        post.setUser(user);


        given(userService.findByNick(anyString())).willReturn(user);
        given(buildService.findById(anyLong())).willReturn(build);
        given(storageService.save(anyString(), any(byte[].class))).willReturn("newFileName.jpg");
        given(service.save(any(Post.class))).willReturn(post);

        mockMvc.perform(post("/api/v2/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(inputDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(post.getTitle()));
    }
    @Test
    @WithMockUser(username = "user", roles = "USER")
    void getFiles() throws Exception {
        Post post = new Post();
        post.setId(1L);
        post.setImage("testImage.jpg");

        User user = new User();
        user.setId(1L);
        user.setNick("user");
        post.setUser(user);

        Resource resource = new ByteArrayResource("Test Image Content".getBytes()) {
            @Override
            public String getFilename() {
                return "testImage.jpg";
            }
        };

        given(service.findById(anyLong())).willReturn(post);
        given(userService.findByNick(anyString())).willReturn(user);
        given(storageService.get(anyString())).willReturn(resource);

        mockMvc.perform(get("/api/v2/posts/img/{id}/{filename}", 1, "testImage.jpg"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/octet-stream"));
    }
    @Test
    void findPostById() throws Exception {
        Post post = new Post();
        post.setId(1L);
        post.setTitle("Test Post");

        Build build = new Build();
        build.setId(1L);
        build.setName("My Build");
        post.setBuild(build);

        User user = new User();
        user.setId(1L);
        user.setNick("user");
        post.setUser(user);
        build.setUser(user);

        given(service.findById(anyLong())).willReturn(post);

        mockMvc.perform(get("/api/v2/posts/{id}", 1)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(post.getTitle()));
    }
    @Test
    @WithMockUser(username = "user", roles = "USER")
    void deletePost() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setNick("user");

        Post post = new Post();
        post.setId(1L);
        post.setUser(user);

        given(userService.findByNick(anyString())).willReturn(user);
        given(service.findById(anyLong())).willReturn(post);
        given(service.save(any(Post.class))).willReturn(post);

        mockMvc.perform(delete("/api/v2/posts/{id}", 1))
                .andExpect(status().isOk())
                .andExpect(content().string("Post Successfully Deleted"));
    }
    @Test
    @WithMockUser(username = "user", roles = "USER")
    void updatePost() throws Exception {
        PostInputDTO inputDTO = new PostInputDTO();
        inputDTO.setTitle("Updated Test Post");
        inputDTO.setBuildId(1L);
        inputDTO.setImage("image");
        inputDTO.setImage64("base64ImageStringkhdfhjghjdkshruhgislghirhiugrihsgrhguidhgsvhgirdshgddrighrd");

        User user = new User();
        user.setId(1L);
        user.setNick("user");

        Build build = new Build();
        build.setId(1L);
        build.setName("My Build");
        build.setNotes("This is a description of my build.");
        build.setTotalPrice(1000.00);
        build.setBuildsComponents(Arrays.asList(new BuildComponent(), new BuildComponent()));
        build.setUser(user);

        Post post = new Post();
        post.setId(1L);
        post.setTitle("Updated Test Post");
        post.setUser(user);
        post.setImage("newFileName.jpg");

        given(userService.findByNick(anyString())).willReturn(user);
        given(service.findById(anyLong())).willReturn(post);
        given(buildService.findById(anyLong())).willReturn(build);
        given(storageService.save(anyString(), any(byte[].class))).willReturn("newFileName.jpg");
        given(service.update(any(Post.class))).willReturn(true);

        mockMvc.perform(put("/api/v2/posts/{id}", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(inputDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Post Successfully Updated"));
    }


}
