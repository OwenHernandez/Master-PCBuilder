package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.primary.controller.v2;

import com.fasterxml.jackson.databind.ObjectMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.ISellerService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.FileStorageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2.ComponentRestControllerV2;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.BuildInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.net.URLConnection;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(ComponentRestControllerV2.class)
@ExtendWith(MockitoExtension.class)
public class ComponentRestControllerV2Test {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private IComponentService componentService;

    @MockBean
    private IUserService userService;

    @MockBean
    private ISellerService sellerService;

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
    public void get_ok_all_test() throws Exception {
        Component component = new Component();
        component.setId(1L);
        component.setName("Test Component");
        component.setSeller(new Seller());
        component.setUserWhoCreated(new User());

        List<Component> components = Arrays.asList(component);

        when(userService.findByNick(any(String.class))).thenReturn(new User());

        when(componentService.findAll()).thenReturn(components);

        mockMvc.perform(get("/api/v2/components"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value(component.getName()));
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void get_ok_byName_test() throws Exception {
        Component component = new Component();
        component.setId(1L);
        component.setName("Test Component");
        component.setSeller(new Seller());
        component.setUserWhoCreated(new User());

        List<Component> components = Arrays.asList(component);

        when(userService.findByNick(any(String.class))).thenReturn(new User());

        when(componentService.findByName(any(String.class))).thenReturn(components);

        mockMvc.perform(get("/api/v2/components")
                        .param("name", "Test Component"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value(component.getName()));
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void get_ok_byUserId_test() throws Exception {
        Component component = new Component();
        component.setId(1L);
        component.setName("Test Component");
        component.setSeller(new Seller());
        component.setUserWhoCreated(new User());

        List<Component> components = Arrays.asList(component);

        when(userService.findByNick(any(String.class))).thenReturn(new User());

        when(componentService.findByUserId(any(Long.class))).thenReturn(components);

        mockMvc.perform(get("/api/v2/components")
                        .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value(component.getName()));
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void get_unauthorized_test() throws Exception {

        when(userService.findByNick(any(String.class))).thenReturn(null);

        mockMvc.perform(get("/api/v2/components"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void get_notFound_name_test() throws Exception {

        when(userService.findByNick(any(String.class))).thenReturn(new User());

        when(componentService.findByName(any(String.class))).thenReturn(null);

        mockMvc.perform(get("/api/v2/components")
                        .param("name", "Test Component"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void get_notFound_userId_test() throws Exception {

        when(userService.findByNick(any(String.class))).thenReturn(new User());

        when(componentService.findByUserId(any(Long.class))).thenReturn(null);

        mockMvc.perform(get("/api/v2/components")
                        .param("userId", "1"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void save_ok_test() throws Exception {
        ComponentInputDTO componentInputDTO = new ComponentInputDTO();
        componentInputDTO.setName("Test Component");
        componentInputDTO.setSellerName("Test Seller");
        componentInputDTO.setImage("Test Image");
        componentInputDTO.setImage64("hghsdfhgfsjuighsfdujhsdfjungnhrdfnhsgujifdhguihsrighrdighhsdkjngjfdngkjsfhdgsrhdgurhlrudhgihdsrhusughsruidhgrdshgurhdsluigh");

        Component component = new Component();
        component.setId(1L);
        component.setName("Test Build");
        component.setSeller(new Seller());
        component.setUserWhoCreated(new User());

        when(userService.findByNick(any(String.class))).thenReturn(new User());

        when(sellerService.findByName(any(String.class))).thenReturn(new Seller());

        when(fileStorageService.save(any(String.class), any(byte[].class))).thenReturn("Test Image");

        when(componentService.save(any(Component.class))).thenReturn(component);

        mockMvc.perform(post("/api/v2/components")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(componentInputDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is(component.getName())));
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void save_unauthorized_test() throws Exception {

        when(userService.findByNick(any(String.class))).thenReturn(null);

        mockMvc.perform(post("/api/v2/components")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ComponentInputDTO())))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void save_badRequest_bodyNull_test() throws Exception {

        mockMvc.perform(post("/api/v2/components")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(null)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void save_badRequest_sellerNull_test() throws Exception {

        when(userService.findByNick(any(String.class))).thenReturn(new User());

        when(sellerService.findByName(any(String.class))).thenReturn(null);

        mockMvc.perform(post("/api/v2/components")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ComponentInputDTO())))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void save_internalServerError_test() throws Exception {
        ComponentInputDTO componentInputDTO = new ComponentInputDTO();
        componentInputDTO.setName("Test Component");
        componentInputDTO.setSellerName("Test Seller");
        componentInputDTO.setImage("Test Image");
        componentInputDTO.setImage64("hghsdfhgfsjuighsfdujhsdfjungnhrdfnhsgujifdhguihsrighrdighhsdkjngjfdngkjsfhdgsrhdgurhlrudhgihdsrhusughsruidhgrdshgurhdsluigh");

        when(userService.findByNick(any(String.class))).thenReturn(new User());

        when(sellerService.findByName(any(String.class))).thenReturn(new Seller());

        when(fileStorageService.save(any(String.class), any(byte[].class))).thenReturn("Test Image");

        when(componentService.save(any(Component.class))).thenReturn(null);

        mockMvc.perform(post("/api/v2/components")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(componentInputDTO)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getFiles_ok_test() throws Exception {
        long compId = 1L;
        String filename = "testImage.jpg";

        // Simulación de la obtención del componente
        Component mockComponent = new Component();
        mockComponent.setId(compId);
        mockComponent.setName("Test Component");
        mockComponent.setImage(filename);
        when(componentService.findById(any(Long.class))).thenReturn(mockComponent);

        // Simulación del usuario y autenticación
        User mockUser = mock(User.class);
        when(userService.findByNick("user")).thenReturn(mockUser);

        // Simulación de la obtención del recurso (imagen)
        Resource mockResource = mock(Resource.class);
        when(mockResource.getInputStream()).thenReturn(mock(InputStream.class));
        when(fileStorageService.get(filename)).thenReturn(mockResource);

        mockMvc.perform(get("/api/v2/components/img/{id}/{filename}", compId, filename))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getFiles_notFound_compNull_test() throws Exception {
        long compId = 1L;
        String filename = "testImage.jpg";

        // Simulación de la obtención del componente
        Component mockComponent = new Component();
        mockComponent.setId(compId);
        mockComponent.setName("Test Component");
        mockComponent.setImage(filename);
        when(componentService.findById(any(Long.class))).thenReturn(null);

        mockMvc.perform(get("/api/v2/components/img/{id}/{filename}", compId, filename))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getFiles_notFound_noImg_test() throws Exception {
        long compId = 1L;
        String filename = "testImage.jpg";

        // Simulación de la obtención del componente
        Component mockComponent = new Component();
        mockComponent.setId(compId);
        mockComponent.setName("Test Component");
        mockComponent.setImage(filename);
        when(componentService.findById(any(Long.class))).thenReturn(mockComponent);

        // Simulación del usuario y autenticación
        User mockUser = mock(User.class);
        when(userService.findByNick("user")).thenReturn(mockUser);

        when(fileStorageService.get(filename)).thenThrow(new RuntimeException());

        mockMvc.perform(get("/api/v2/components/img/{id}/{filename}", compId, filename))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getFiles_forbidden_test() throws Exception {
        long compId = 1L;
        String filename = "testImage.jpg";

        // Simulación de la obtención del componente
        Component mockComponent = new Component();
        mockComponent.setId(compId);
        mockComponent.setName("Test Component");
        mockComponent.setImage(filename);
        when(componentService.findById(any(Long.class))).thenReturn(mockComponent);

        // Simulación del usuario y autenticación
        User mockUser = mock(User.class);
        when(userService.findByNick("user")).thenReturn(mockUser);

        mockMvc.perform(get("/api/v2/components/img/{id}/{filename}", compId, "testImageForbidden.jpg"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getFiles_unauthorized_test() throws Exception {
        long compId = 1L;
        String filename = "testImage.jpg";

        // Simulación de la obtención del componente
        Component mockComponent = new Component();
        mockComponent.setId(compId);
        mockComponent.setName("Test Component");
        mockComponent.setImage(filename);
        when(componentService.findById(any(Long.class))).thenReturn(mockComponent);

        when(userService.findByNick("user")).thenReturn(null);

        mockMvc.perform(get("/api/v2/components/img/{id}/{filename}", compId, filename))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void delete_ok_test() throws Exception {
        Component component = new Component();
        component.setId(1L);
        component.setName("Test Component");

        User user = new User();
        user.setId(1);
        component.setUserWhoCreated(user);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(componentService.findById(any(Long.class))).thenReturn(component);

        when(componentService.deleteById(any(Long.class))).thenReturn(true);

        mockMvc.perform(delete("/api/v2/components/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void delete_badRequest_test() throws Exception {

        mockMvc.perform(delete("/api/v2/components/null"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void delete_unauthorized_test() throws Exception {

        when(userService.findByNick(any(String.class))).thenReturn(null);

        mockMvc.perform(delete("/api/v2/components/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void delete_notFound_test() throws Exception {
        User user = new User();
        user.setId(1);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(componentService.findById(any(Long.class))).thenReturn(null);

        mockMvc.perform(delete("/api/v2/components/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void delete_forbidden_test() throws Exception {
        Component component = new Component();
        component.setId(1L);
        component.setName("Test Component");

        User user = new User();
        user.setId(1);
        component.setUserWhoCreated(new User());

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(componentService.findById(any(Long.class))).thenReturn(component);

        mockMvc.perform(delete("/api/v2/components/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void delete_internalServerError_test() throws Exception {
        Component component = new Component();
        component.setId(1L);
        component.setName("Test Component");

        User user = new User();
        user.setId(1);
        component.setUserWhoCreated(user);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(componentService.findById(any(Long.class))).thenReturn(component);

        when(componentService.deleteById(any(Long.class))).thenReturn(false);

        mockMvc.perform(delete("/api/v2/components/1"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void update_ok_test() throws Exception {
        ComponentInputDTO componentInputDTO = new ComponentInputDTO();
        componentInputDTO.setName("Test Component");
        componentInputDTO.setSellerName("Test Seller");
        componentInputDTO.setImage("Test Image");
        componentInputDTO.setImage64("hghsdfhgfsjuighsfdujhsdfjungnhrdfnhsgujifdhguihsrighrdighhsdkjngjfdngkjsfhdgsrhdgurhlrudhgihdsrhusughsruidhgrdshgurhdsluigh");

        Component component = new Component();
        component.setId(1L);
        component.setName("Test Component");

        User user = new User();
        user.setId(1);
        component.setUserWhoCreated(user);

        when(componentService.findById(any(Long.class))).thenReturn(component);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(sellerService.findByName(any(String.class))).thenReturn(new Seller());

        when(componentService.update(any(Component.class))).thenReturn(true);

        mockMvc.perform(put("/api/v2/components/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(componentInputDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", is("Component Successfully updated")));
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void update_badRequest_bodyParamNull_test() throws Exception {

        mockMvc.perform(put("/api/v2/components/null")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(null)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void update_unauthorized_test() throws Exception {

        when(userService.findByNick(any(String.class))).thenReturn(null);

        mockMvc.perform(put("/api/v2/components/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ComponentInputDTO())))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void update_notFound_test() throws Exception {

        when(componentService.findById(any(Long.class))).thenReturn(null);

        when(userService.findByNick(any(String.class))).thenReturn(new User());

        mockMvc.perform(put("/api/v2/components/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ComponentInputDTO())))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void update_forbidden_test() throws Exception {
        ComponentInputDTO componentInputDTO = new ComponentInputDTO();
        componentInputDTO.setName("Test Component");

        Component component = new Component();
        component.setId(1L);
        component.setName("Test Component");

        User user = new User();
        user.setId(1);
        component.setUserWhoCreated(new User());

        when(componentService.findById(any(Long.class))).thenReturn(component);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        mockMvc.perform(put("/api/v2/components/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(componentInputDTO)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void update_badRequest_sellerNull_test() throws Exception {
        ComponentInputDTO componentInputDTO = new ComponentInputDTO();
        componentInputDTO.setName("Test Component");
        componentInputDTO.setSellerName("Test Seller");

        Component component = new Component();
        component.setId(1L);
        component.setName("Test Component");

        User user = new User();
        user.setId(1);
        component.setUserWhoCreated(user);

        when(componentService.findById(any(Long.class))).thenReturn(component);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(sellerService.findByName(any(String.class))).thenReturn(null);

        mockMvc.perform(put("/api/v2/components/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(componentInputDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void update_internalServerError_test() throws Exception {
        ComponentInputDTO componentInputDTO = new ComponentInputDTO();
        componentInputDTO.setName("Test Component");
        componentInputDTO.setSellerName("Test Seller");
        componentInputDTO.setImage("Test Image");
        componentInputDTO.setImage64("hghsdfhgfsjuighsfdujhsdfjungnhrdfnhsgujifdhguihsrighrdighhsdkjngjfdngkjsfhdgsrhdgurhlrudhgihdsrhusughsruidhgrdshgurhdsluigh");

        Component component = new Component();
        component.setId(1L);
        component.setName("Test Component");

        User user = new User();
        user.setId(1);
        component.setUserWhoCreated(user);

        when(componentService.findById(any(Long.class))).thenReturn(component);

        when(userService.findByNick(any(String.class))).thenReturn(user);

        when(sellerService.findByName(any(String.class))).thenReturn(new Seller());

        when(componentService.update(any(Component.class))).thenReturn(false);

        mockMvc.perform(put("/api/v2/components/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(componentInputDTO)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void amazon_ok_test() throws Exception {
        Component component = new Component();
        component.setId(1L);
        component.setName("Test Component");

        List<Component> components = Arrays.asList(component);

        when(componentService.searchAmazon(any(String.class))).thenReturn(components);

        mockMvc.perform(get("/api/v2/components/amazon/testSearch"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void amazon_notFound_test() throws Exception {

        when(componentService.searchAmazon(any(String.class))).thenReturn(null);

        mockMvc.perform(get("/api/v2/components/amazon/testSearch"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void ebay_ok_test() throws Exception {
        Component component = new Component();
        component.setId(1L);
        component.setName("Test Component");

        List<Component> components = Arrays.asList(component);

        when(componentService.searchEbay(any(String.class))).thenReturn(components);

        mockMvc.perform(get("/api/v2/components/ebay/testSearch"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void ebay_notFound_test() throws Exception {

        when(componentService.searchEbay(any(String.class))).thenReturn(null);

        mockMvc.perform(get("/api/v2/components/ebay/testSearch"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void updatePrice_ok_test() throws Exception {
        ComponentInputDTO componentInputDTO = new ComponentInputDTO();
        componentInputDTO.setName("Test Component");

        Component component = new Component();
        component.setId(1L);
        component.setName("Test Component");

        when(componentService.findById(any(Long.class))).thenReturn(component);

        when(componentService.update(any(Component.class))).thenReturn(true);

        mockMvc.perform(put("/api/v2/components/price/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(componentInputDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", is("Component Successfully updated")));
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void updatePrice_badRequest_test() throws Exception {

        mockMvc.perform(put("/api/v2/components/price/null")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(null)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void updatePrice_notFound_test() throws Exception {
        ComponentInputDTO componentInputDTO = new ComponentInputDTO();
        componentInputDTO.setName("Test Component");

        when(componentService.findById(any(Long.class))).thenReturn(null);

        mockMvc.perform(put("/api/v2/components/price/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(componentInputDTO)))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", password = "password", roles = "USER")
    public void updatePrice_internalServerError_test() throws Exception {
        ComponentInputDTO componentInputDTO = new ComponentInputDTO();
        componentInputDTO.setName("Test Component");

        Component component = new Component();
        component.setId(1L);
        component.setName("Test Component");

        when(componentService.findById(any(Long.class))).thenReturn(component);

        when(componentService.update(any(Component.class))).thenReturn(false);

        mockMvc.perform(put("/api/v2/components/price/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(componentInputDTO)))
                .andExpect(status().isInternalServerError());
    }
}
