package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Post;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.PostEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.UserEntity;

import java.text.ParseException;

public class PostEntityMapper {

    BuildEntityMapper buildMapper = new BuildEntityMapper();

    UserEntityMapper userMapper = new UserEntityMapper();

    public Post toDomain(PostEntity postEntity) {
        Post res = new Post();

        res.setId(postEntity.getId());
        res.setDescription(postEntity.getDescription());
        res.setImage(postEntity.getImage());
        res.setTitle(postEntity.getTitle());
        if (postEntity.getBuild() != null) {
            res.setBuild(buildMapper.toDomain(postEntity.getBuild()));
        }
        if (postEntity.getUser() != null) {
            res.setUser(userMapper.toDomain(postEntity.getUser()));
        }
        if (postEntity.getUsersWhoLiked() != null) {
            for (UserEntity userEntity : postEntity.getUsersWhoLiked()) {
                res.getUsersWhoLiked().add(userMapper.toDomain(userEntity));
            }
        }

        return res;
    }

    public PostEntity toPersistance(Post post) throws ParseException {
        PostEntity res = new PostEntity();

        res.setId(post.getId());
        res.setDescription(post.getDescription());
        res.setImage(post.getImage());
        res.setTitle(post.getTitle());
        if (post.getBuild() != null) {
            res.setBuild(buildMapper.toPersistance(post.getBuild()));
        }
        if (post.getUser() != null) {
            res.setUser(userMapper.toPersistance(post.getUser()));
        }
        if (post.getUsersWhoLiked() != null) {
            for (User user : post.getUsersWhoLiked()) {
                res.getUsersWhoLiked().add(userMapper.toPersistance(user));
            }
        }

        return res;
    }
}
