package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Post;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.PostOutputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.UserDTO;

import java.util.ArrayList;
import java.util.List;

public class PostOutputDTOMapper {

    UserDTOMapper userDTOMapper = new UserDTOMapper();

    BuildOutputDTOMapper buildMapper = new BuildOutputDTOMapper();

    public PostOutputDTO toDTO(Post post) {
        PostOutputDTO outputDTO = new PostOutputDTO();
        outputDTO.setId(post.getId());
        outputDTO.setDescription(post.getDescription());
        outputDTO.setImage(post.getImage());
        outputDTO.setTitle(post.getTitle());
        outputDTO.setBuild(buildMapper.toDTO(post.getBuild()));
        outputDTO.setUser(userDTOMapper.toDTO(post.getUser()));
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