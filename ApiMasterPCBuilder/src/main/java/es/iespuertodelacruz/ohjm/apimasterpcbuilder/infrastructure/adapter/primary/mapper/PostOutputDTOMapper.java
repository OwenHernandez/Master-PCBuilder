package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Post;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.PostOutputDTO;

import java.util.ArrayList;
import java.util.List;

public class PostOutputDTOMapper {

    public PostOutputDTO toDTO(Post post) {
        PostOutputDTO outputDTO = new PostOutputDTO();
        outputDTO.setId(post.getId());
        outputDTO.setDescription(post.getDescription());
        outputDTO.setImage(post.getImage());
        outputDTO.setTitle(post.getTitle());
        outputDTO.setBuildId(post.getBuild().getId());
        outputDTO.setUserId(post.getUser().getId());
        if (post.getUsersWhoLiked() != null) {
            List<Long> usersWhoLikedIds = new ArrayList<>();
            for (User user : post.getUsersWhoLiked()) {
                usersWhoLikedIds.add(user.getId());
            }

            outputDTO.setUsersWhoLikedIds(usersWhoLikedIds);
        }
        return outputDTO;
    }
}
