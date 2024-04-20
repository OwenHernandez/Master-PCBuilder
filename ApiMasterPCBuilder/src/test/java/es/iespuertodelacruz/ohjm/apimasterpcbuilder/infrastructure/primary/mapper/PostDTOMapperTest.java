package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.primary.mapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Post;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.BuildOutputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.PostInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.PostOutputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.UserDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.BuildDTOMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.PostDTOMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.UserDTOMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

@ExtendWith(MockitoExtension.class)
class PostDTOMapperTest {

    @Mock
    private UserDTOMapper userDTOMapper;

    @Mock
    private BuildDTOMapper buildDTOMapper;

    @InjectMocks
    private PostDTOMapper postDTOMapper;

    @Test
    void toDomain_ValidInputDTO_ReturnsPost() {
        // Given
        PostInputDTO inputDTO = new PostInputDTO();
        inputDTO.setTitle("New GPU Launch");
        inputDTO.setDescription("Discussing the latest GPU technology");
        inputDTO.setImage("image_url");

        // When
        Post result = postDTOMapper.toDomain(inputDTO);

        // Then
        assertThat(result.getTitle()).isEqualTo("New GPU Launch");
        assertThat(result.getDescription()).isEqualTo("Discussing the latest GPU technology");
        assertThat(result.getImage()).isEqualTo("image_url");
    }

    @Test
    void toDTO_ValidPost_ReturnsPostOutputDTO() {
        // Given
        Post post = new Post();
        post.setId(1L);
        post.setTitle("New GPU Launch");
        post.setDescription("Discussing the latest GPU technology");
        post.setImage("image_url");

        User user = new User(); // Simplified example
        post.setUser(user);

        Build build = new Build(); // Simplified example
        post.setBuild(build);

        List<User> usersWhoLiked = Arrays.asList(new User(), new User()); // Simplified example
        post.setUsersWhoLiked(usersWhoLiked);

        when(userDTOMapper.toDTO(user)).thenReturn(new UserDTO());
        when(buildDTOMapper.toDTO(build)).thenReturn(new BuildOutputDTO());
        when(userDTOMapper.toDTO(usersWhoLiked.get(0))).thenReturn(new UserDTO());
        when(userDTOMapper.toDTO(usersWhoLiked.get(1))).thenReturn(new UserDTO());

        // When
        PostOutputDTO result = postDTOMapper.toDTO(post);

        // Then
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("New GPU Launch");
        assertThat(result.getDescription()).isEqualTo("Discussing the latest GPU technology");
        assertThat(result.getImage()).isEqualTo("image_url");
        assertThat(result.getUser()).isNotNull();
        assertThat(result.getBuild()).isNotNull();
        assertThat(result.getUsersWhoLiked()).hasSize(2);
    }
}
