package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Post;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.PostEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.UserEntity;

import java.text.ParseException;
import java.util.ArrayList;

public class PostEntityMapper {

    BuildEntityMapper buildMapper = new BuildEntityMapper();

    UserEntityMapper userMapper = new UserEntityMapper();

    public Post toDomain(PostEntity postEntity) {
        Post res = new Post();

        res.setId(postEntity.getId());
        res.setTitle(postEntity.getTitle());
        res.setDescription(postEntity.getDescription());
        if (postEntity.getBuild() != null) {
            res.setBuild(buildMapper.toDomain(postEntity.getBuild()));
        }
        if (postEntity.getUser() != null) {
            res.setUser(userMapper.toDomain(postEntity.getUser()));
        }
        if (postEntity.getUsersWhoLiked() != null) {
            res.setUsersWhoLiked(new ArrayList<>());
            for (UserEntity userEntity : postEntity.getUsersWhoLiked()) {
                res.getUsersWhoLiked().add(userMapper.toDomain(userEntity));
            }
        }

        return res;
    }

    public PostEntity toPersistence(Post post) throws ParseException {
        PostEntity res = new PostEntity();

        res.setId(post.getId());
        res.setTitle(post.getTitle());
        res.setDescription(post.getDescription());
        if (post.getBuild() != null) {
            res.setBuild(buildMapper.toPersistence(post.getBuild()));
        }
        if (post.getUser() != null) {
            res.setUser(userMapper.toPersistance(post.getUser()));
        }
        if (post.getUsersWhoLiked() != null) {
            res.setUsersWhoLiked(new ArrayList<>());
            for (User user : post.getUsersWhoLiked()) {
                res.getUsersWhoLiked().add(userMapper.toPersistance(user));
            }
        }

        return res;
    }
}
