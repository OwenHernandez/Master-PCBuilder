package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Post;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.PostInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.PostOutputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.UserDTO;

import java.util.ArrayList;
import java.util.List;

public class PostDTOMapper {

    UserDTOMapper userDTOMapper = new UserDTOMapper();

    BuildDTOMapper buildMapper = new BuildDTOMapper();

    public Post toDomain(PostInputDTO inputDTO) {
        Post post = new Post();
        post.setDescription(inputDTO.getDescription());
        post.setTitle(inputDTO.getTitle());
        post.setImage(inputDTO.getImage());
        post.setDeleted((byte) (inputDTO.isDeleted() ? 1 : 0));
        return post;
    }

    public PostOutputDTO toDTO(Post post) {
        PostOutputDTO outputDTO = new PostOutputDTO();
        outputDTO.setId(post.getId());
        outputDTO.setDescription(post.getDescription());
        outputDTO.setImage(post.getImage());
        outputDTO.setTitle(post.getTitle());
        outputDTO.setBuild(buildMapper.toDTO(post.getBuild()));
        outputDTO.setUser(userDTOMapper.toDTO(post.getUser()));
        outputDTO.setDeleted(post.getDeleted() == 1);
        if (post.getUsersWhoLiked() != null) {
            List<UserDTO> usersWhoLiked = new ArrayList<>();
            for (User user : post.getUsersWhoLiked()) {
                usersWhoLiked.add(userDTOMapper.toDTO(user));
            }

            outputDTO.setUsersWhoLiked(usersWhoLiked);
        }
        return outputDTO;
    }
}
