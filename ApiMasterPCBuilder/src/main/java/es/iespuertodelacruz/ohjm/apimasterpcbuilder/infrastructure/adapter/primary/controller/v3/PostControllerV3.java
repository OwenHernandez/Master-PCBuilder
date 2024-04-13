package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v3;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Post;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IBuildService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IPostService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.FileStorageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.PostInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.PostOutputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.exception.GraphQLErrorException;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.PostDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;

import java.util.Base64;
import java.util.List;

@Controller
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class PostControllerV3 {

    @Autowired
    private IPostService postService;

    @Autowired
    private IBuildService buildService;

    @Autowired
    private FileStorageService storageService;

    @Autowired
    private IUserService userService;

    private final PostDTOMapper postDTOMapper = new PostDTOMapper();

    @SchemaMapping(typeName = "Query", field = "posts")
    public List<PostOutputDTO> getPosts() {
        return postService.findAll().stream().map(postDTOMapper::toDTO).toList();
    }

    @SchemaMapping(typeName = "Query", field = "post")
    public PostOutputDTO getPost(@Argument Long id) {
        Post byId = postService.findById(id);
        if (byId == null) {
            throw new GraphQLErrorException("Post not found", HttpStatus.NOT_FOUND);
        }
        return postDTOMapper.toDTO(byId);
    }

    @SchemaMapping(typeName = "Mutation", field = "savePost")
    public PostOutputDTO save(@Argument PostInputDTO post) {
        Object principal =
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User userByNick = userService.findByNick(username);
        Post newPost = postDTOMapper.toDomain(post);

        String codedPicture = post.getImage64();
        byte[] photoBytes = Base64.getDecoder().decode(codedPicture);
        String newFileName = storageService.save(post.getTitle() + "_" + post.getImage(), photoBytes);
        newPost.setImage(newFileName);

        Build build = buildService.findById(post.getBuildId());
        if (build == null) {
            throw new GraphQLErrorException("Build not found", HttpStatus.NOT_FOUND);
        }
        if (build.getUser().getId() != userByNick.getId()) {
            throw new GraphQLErrorException("You can't post other user's builds", HttpStatus.FORBIDDEN);
        }
        newPost.setBuild(build);
        newPost.setUser(userByNick);

        return postDTOMapper.toDTO(postService.save(newPost));
    }

    @SchemaMapping(typeName = "Mutation", field = "deletePost")
    public boolean delete(@Argument Long id) {
        return postService.deleteById(id);
    }

    @SchemaMapping(typeName = "Mutation", field = "updatePost")
    public PostOutputDTO update(@Argument Long id, @Argument PostInputDTO post) {
        Post postToUpdate = postService.findById(id);
        if (postToUpdate == null) {
            throw new GraphQLErrorException("Post not found", HttpStatus.NOT_FOUND);
        }

        postToUpdate.setDescription(post.getDescription());
        postToUpdate.setTitle(post.getTitle());

        if (post.getImage64() != null) {
            byte[] photoBytes = Base64.getDecoder().decode(post.getImage64());
            String newFileName = storageService.save(post.getTitle() + "_" + post.getImage(), photoBytes);
            postToUpdate.setImage(newFileName);
        }

        Build build = buildService.findById(post.getBuildId());
        if (build == null) {
            throw new GraphQLErrorException("Build not found", HttpStatus.NOT_FOUND);
        }
        postToUpdate.setBuild(build);

        return postDTOMapper.toDTO(postService.save(postToUpdate));
    }
}
