package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Post;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.BuildService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.UserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service.PostEntityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class PostEntityServiceTest {

    @Autowired
    private PostEntityService postEntityService;

    @Autowired
    private UserService userService;

    @Autowired
    private BuildService buildService;

    private User testUser;
    private Build testBuild;

    @BeforeEach
    void setUp() {
        testUser = createTestUser("user@example.com", "testUserNick");
        testBuild = createAndSaveTestBuild();
    }

    @Test
    void deletePostByIdTest() {
        Build testBuildForPost = createAndSaveTestBuild();
        Post post = new Post();
        post.setTitle("Post to Delete");
        post.setUser(testUser);
        post.setBuild(testBuildForPost);
        Post savedPost = postEntityService.save(post);

        boolean deleted = postEntityService.deleteById(savedPost.getId());
        assertTrue(deleted, "Post should have been successfully deleted");
    }

    @Test
    void updatePostTest() {
        Post post = new Post();
        post.setTitle("Original Title");
        post.setDescription("Original Description");
        post.setUser(testUser);
        post.setBuild(testBuild);
        Post savedPost = postEntityService.save(post);

        savedPost.setTitle("Updated Title");
        boolean updated = postEntityService.update(savedPost);
        assertTrue(updated, "Post should have been successfully updated");

        Post updatedPost = postEntityService.findById(savedPost.getId());
        assertNotNull(updatedPost, "Updated post should exist");
        assertEquals("Updated Title", updatedPost.getTitle(), "Post title should be updated");
    }

    @Test
    void findByTitleTest() {
        String title = "Unique Title for Search";
        Post post = new Post();
        post.setTitle(title);
        post.setDescription("Searching by this title should return this post");
        post.setUser(testUser);
        Build buildForUser = createAndSaveTestBuild();
        post.setBuild(buildForUser);
        System.out.println(post.toString());
        Post save = postEntityService.save(post);
        System.out.println(save);

        List<Post> foundPosts = postEntityService.findByTitle(title);
        assertFalse(foundPosts.isEmpty(), "Should find at least one post with the given title");
        assertEquals(1, foundPosts.size(), "Exactly one post with the given title should be found");
    }

    @Test
    void findByBuildIdTest() {
        Post post = new Post();
        post.setTitle("Post for Build");
        post.setDescription("This post is associated with a specific build");
        post.setUser(testUser);
        post.setBuild(testBuild);
        postEntityService.save(post);

        List<Post> foundPosts = postEntityService.findByBuildId(testBuild.getId());
        assertFalse(foundPosts.isEmpty(), "Should find posts for the given build ID");
        assertTrue(foundPosts.stream().anyMatch(p -> p.getBuild().getId()==(testBuild.getId())), "Found posts should include one with the specified build ID");
    }

    @Test
    void findByUserIdTest() {
        Post post = new Post();
        post.setTitle("Post for User");
        post.setDescription("This post is associated with a specific user");
        post.setUser(testUser);
        post.setBuild(createAndSaveTestBuild());
        postEntityService.save(post);

        List<Post> foundPosts = postEntityService.findByUserId(testUser.getId());
        assertFalse(foundPosts.isEmpty(), "Should find posts for the given user ID");
        assertTrue(foundPosts.stream().anyMatch(p -> p.getUser().getId()==(testUser.getId())), "Found posts should include one with the specified user ID");
    }

    // Auxiliary methods to create User and Build
    private User createTestUser(String email, String nick) {
        User user = new User();
        user.setId(1L);
        user.setActive((byte) 1);
        user.setRole("ROLE_USER");
        user.setEmail("user1@example.com");
        user.setHash("hashvalue");
        user.setNick("nickname");
        user.setPassword("securepassword");
        user.setPicture("path/to/picture");
        // Additional configurations...
        return userService.save(user); // Assumes userService.save() handles persistence.
    }

    private Build createAndSaveTestBuild() {
        Build build = new Build();
        build.setName("Test");
        build.setCategory("Test");
        build.setNotes("Test");
        build.setDateOfCreation("2021-06-01");
        build.setTotalPrice(1000.0);
        User user = new User();
        user.setId(1L);
        user.setActive((byte) 1);
        user.setRole("ROLE_USER");
        user.setEmail("user1@example.com");
        user.setHash("hashvalue");
        user.setNick("nickname");
        user.setPassword("securepassword");
        user.setPicture("path/to/picture");
        build.setUser(user);
        return buildService.save(build); // Assumes buildService.save() handles persistence.
    }
}
