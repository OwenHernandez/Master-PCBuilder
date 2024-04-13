package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.primary.controller.v2;

import com.fasterxml.jackson.databind.ObjectMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.ISellerService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2.SellerRestControllerV2;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SellerRestControllerV2.class)
@ExtendWith(MockitoExtension.class)
public class SellerRestControllerV2Test {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ISellerService sellerService;

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
    public void getAllOrByName_ok_all_test() throws Exception {
        Seller seller = new Seller();
        seller.setId(1L);
        seller.setName("Test Seller");

        List<Seller> sellers = Arrays.asList(seller);

        when(sellerService.findAll()).thenReturn(sellers);

        mockMvc.perform(get("/api/v2/sellers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value(seller.getName()));
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getAllOrByName_ok_byName_test() throws Exception {
        Seller seller = new Seller();
        seller.setId(1L);
        seller.setName("Test Seller");

        when(sellerService.findByName(any(String.class))).thenReturn(seller);

        mockMvc.perform(get("/api/v2/sellers")
                .param("name", "Test Seller"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(seller.getName()));
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getAllOrByName_notFound_test() throws Exception {
        Seller seller = new Seller();
        seller.setId(1L);
        seller.setName("Test Seller");

        when(sellerService.findByName(any(String.class))).thenReturn(null);

        mockMvc.perform(get("/api/v2/sellers")
                        .param("name", "Test Seller"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getById_ok_test() throws Exception {
        Seller seller = new Seller();
        seller.setId(1L);
        seller.setName("Test Seller");

        when(sellerService.findById(any(Long.class))).thenReturn(seller);

        mockMvc.perform(get("/api/v2/sellers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(seller.getName()));
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getById_badRequest_test() throws Exception {

        mockMvc.perform(get("/api/v2/sellers/null"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    public void getById_notFound_test() throws Exception {
        Seller seller = new Seller();
        seller.setId(1L);
        seller.setName("Test Seller");

        when(sellerService.findById(any(Long.class))).thenReturn(null);

        mockMvc.perform(get("/api/v2/sellers/1"))
                .andExpect(status().isNotFound());
    }
}