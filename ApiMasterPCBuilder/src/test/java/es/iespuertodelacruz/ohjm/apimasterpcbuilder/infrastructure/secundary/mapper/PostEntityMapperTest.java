package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Post;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.PostEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.PostEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.UserEntity;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.text.ParseException;
import java.util.List;

import static com.mongodb.assertions.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class PostEntityMapperTest {

    private final PostEntityMapper postEntityMapper = new PostEntityMapper();

    @Test
    public void toDomain_ok_everything_test() {
        PostEntity postEntity = new PostEntity();
        postEntity.setId(1L);
        postEntity.setTitle("title");
        postEntity.setDescription("description");
        postEntity.setImage("image");

        UserEntity userEntity = new UserEntity();

        postEntity.setUser(userEntity);

        BuildEntity buildEntity = new BuildEntity();
        buildEntity.setDateOfCreation(123456789L);
        buildEntity.setUser(userEntity);

        postEntity.setBuild(buildEntity);

        postEntity.setBuild(buildEntity);
        postEntity.setUsersWhoLiked(List.of(userEntity));

        Post domain = postEntityMapper.toDomain(postEntity);

        assertEquals(domain.getId(), postEntity.getId());
        assertEquals(domain.getTitle(), postEntity.getTitle());
        assertEquals(domain.getDescription(), postEntity.getDescription());
        assertEquals(domain.getImage(), postEntity.getImage());
        assertNotNull(domain.getUser());
        assertNotNull(domain.getBuild());
        assertNotNull(domain.getUsersWhoLiked());
    }

    @Test
    public void toDomain_ok_noLikes_test() {
        PostEntity postEntity = new PostEntity();
        postEntity.setId(1L);
        postEntity.setTitle("title");
        postEntity.setDescription("description");
        postEntity.setImage("image");

        UserEntity userEntity = new UserEntity();

        postEntity.setUser(userEntity);

        BuildEntity buildEntity = new BuildEntity();
        buildEntity.setDateOfCreation(123456789L);
        buildEntity.setUser(userEntity);

        postEntity.setBuild(buildEntity);

        postEntity.setBuild(buildEntity);

        Post domain = postEntityMapper.toDomain(postEntity);

        assertEquals(domain.getId(), postEntity.getId());
        assertEquals(domain.getTitle(), postEntity.getTitle());
        assertEquals(domain.getDescription(), postEntity.getDescription());
        assertEquals(domain.getImage(), postEntity.getImage());
        assertNotNull(domain.getUser());
        assertNotNull(domain.getBuild());
        assertNull(domain.getUsersWhoLiked());
    }

    @Test
    public void toDomain_nullBuild_test() {
        PostEntity postEntity = new PostEntity();
        postEntity.setId(1L);
        postEntity.setTitle("title");
        postEntity.setDescription("description");
        postEntity.setImage("image");

        assertThrows(NullPointerException.class, () -> postEntityMapper.toDomain(postEntity));
    }

    @Test
    public void toDomain_nullUser_test() {
        PostEntity postEntity = new PostEntity();
        postEntity.setId(1L);
        postEntity.setTitle("title");
        postEntity.setDescription("description");
        postEntity.setImage("image");

        UserEntity userEntity = new UserEntity();

        BuildEntity buildEntity = new BuildEntity();
        buildEntity.setDateOfCreation(123456789L);
        buildEntity.setUser(userEntity);

        postEntity.setBuild(buildEntity);

        postEntity.setBuild(buildEntity);
        postEntity.setUsersWhoLiked(List.of(userEntity));

        assertThrows(NullPointerException.class, () -> postEntityMapper.toDomain(postEntity));
    }

    @Test
    public void toPersistence_ok_everything_test() throws ParseException {
        Post post = new Post();
        post.setId(1L);
        post.setTitle("title");
        post.setDescription("description");
        post.setImage("image");

        User user = new User();

        post.setUser(user);

        Build build = new Build();
        build.setDateOfCreation("2021-06-01");
        build.setUser(user);

        post.setBuild(build);
        post.setUsersWhoLiked(List.of(user));

        PostEntity entity = postEntityMapper.toPersistence(post);

        assertEquals(entity.getId(), post.getId());
        assertEquals(entity.getTitle(), post.getTitle());
        assertEquals(entity.getDescription(), post.getDescription());
        assertEquals(entity.getImage(), post.getImage());
        assertNotNull(entity.getUser());
        assertNotNull(entity.getBuild());
        assertNotNull(entity.getUsersWhoLiked());
    }

    @Test
    public void toPersistence_ok_noLikes_test() throws ParseException {
        Post post = new Post();
        post.setId(1L);
        post.setTitle("title");
        post.setDescription("description");
        post.setImage("image");

        User user = new User();

        post.setUser(user);

        Build build = new Build();
        build.setDateOfCreation("2021-06-01");
        build.setUser(user);

        post.setBuild(build);

        PostEntity entity = postEntityMapper.toPersistence(post);

        assertEquals(entity.getId(), post.getId());
        assertEquals(entity.getTitle(), post.getTitle());
        assertEquals(entity.getDescription(), post.getDescription());
        assertEquals(entity.getImage(), post.getImage());
        assertNotNull(entity.getUser());
        assertNotNull(entity.getBuild());
        assertNull(entity.getUsersWhoLiked());
    }

    @Test
    public void toPersistence_nullBuild_test() {
        Post post = new Post();
        post.setId(1L);
        post.setTitle("title");
        post.setDescription("description");
        post.setImage("image");

        assertThrows(NullPointerException.class, () -> postEntityMapper.toPersistence(post));
    }

    @Test
    public void toPersistence_nullUser_test() {
        Post post = new Post();
        post.setId(1L);
        post.setTitle("title");
        post.setDescription("description");
        post.setImage("image");

        User user = new User();

        Build build = new Build();
        build.setDateOfCreation("2021-06-01");
        build.setUser(user);

        post.setBuild(build);

        assertThrows(NullPointerException.class, () -> postEntityMapper.toPersistence(post));
    }
}
