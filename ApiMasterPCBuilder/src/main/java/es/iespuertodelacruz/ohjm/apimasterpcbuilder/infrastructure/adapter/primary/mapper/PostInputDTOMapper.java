package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Post;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.PostInputDTO;

public class PostInputDTOMapper {

    public Post toDomain(PostInputDTO inputDTO) {
        Post post = new Post();
        post.setDescription(inputDTO.getDescription());
        post.setImage(inputDTO.getImage());
        post.setTitle(inputDTO.getTitle());
        return post;
    }
}
