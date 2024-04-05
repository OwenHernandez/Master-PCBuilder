package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.*;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.BuildInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.BuildOutputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.BuildDTOMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.ComponentDTOMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static com.mongodb.assertions.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class BuildDTOMapperTest {

    @InjectMocks
    private BuildDTOMapper buildDTOMapper;

    @Mock
    private ComponentDTOMapper componentDTOMapper; // Suponiendo que existe y es usado internamente

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void toDTO_ok_everything_test() {
        Build build = new Build();
        build.setId(1);
        build.setName("Test");
        build.setNotes("Test");
        build.setCategory("Test");
        build.setTotalPrice(0.0);

        User user = new User();
        user.setNick("Test");

        build.setUser(user);

        BuildComponent buildComponent = new BuildComponent();

        Component component = new Component();
        component.setSeller(new Seller());
        component.setUserWhoCreated(user);

        build.setBuildsComponents(List.of(buildComponent));

        BuildOutputDTO dto = buildDTOMapper.toDTO(build);

        assertEquals(build.getId(), dto.getId());
        assertEquals(build.getName(), dto.getName());
        assertEquals(build.getNotes(), dto.getNotes());
        assertEquals(build.getCategory(), dto.getCategory());
        assertEquals(build.getTotalPrice(), dto.getTotalPrice());
        assertEquals(build.getUser().getNick(), dto.getUserNick());
        assertNotNull(dto.getBuildsComponents());
    }

    @Test
    void toDTO_noBC_test() {
        Build build = new Build();
        build.setId(1L);
        build.setName("Test");
        build.setNotes("Test");
        build.setCategory("Test");
        build.setTotalPrice(0.0);

        User user = new User();
        user.setNick("Test");

        build.setUser(user);

        BuildOutputDTO dto = buildDTOMapper.toDTO(build);

        assertEquals(build.getId(), dto.getId());
        assertEquals(build.getName(), dto.getName());
        assertEquals(build.getNotes(), dto.getNotes());
        assertEquals(build.getCategory(), dto.getCategory());
        assertEquals(build.getTotalPrice(), dto.getTotalPrice());
        assertEquals(build.getUser().getNick(), dto.getUserNick());
        assertNull(dto.getBuildsComponents());
    }

    @Test
    void toDTO_noUser_test() {
        Build build = new Build();
        build.setId(1L);
        build.setName("Test");
        build.setNotes("Test");
        build.setCategory("Test");
        build.setTotalPrice(0.0);

        assertThrows(NullPointerException.class, () -> buildDTOMapper.toDTO(build));
    }

    @Test
    void toDomain_ok_test() {
        BuildInputDTO dto = new BuildInputDTO();
        dto.setName("Test");
        dto.setNotes("Test");
        dto.setCategory("Test");

        Build build = buildDTOMapper.toDomain(dto);

        assertEquals(dto.getName(), build.getName());
        assertEquals(dto.getNotes(), build.getNotes());
        assertEquals(dto.getCategory(), build.getCategory());
    }
}
