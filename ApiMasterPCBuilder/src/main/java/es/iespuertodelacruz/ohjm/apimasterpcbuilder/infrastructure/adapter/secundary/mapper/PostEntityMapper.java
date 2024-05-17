package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Post;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.PostEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.UserEntity;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashSet;

public class PostEntityMapper {

    private final BuildEntityMapper buildMapper = new BuildEntityMapper();

    private final UserEntityMapper userMapper = new UserEntityMapper();

    public Post toDomain(PostEntity postEntity) {
        Post res = new Post();

        res.setId(postEntity.getId());
        res.setTitle(postEntity.getTitle());
        res.setDescription(postEntity.getDescription());
        res.setImage(postEntity.getImage());
        res.setBuild(buildMapper.toDomain(postEntity.getBuild()));
        res.setUser(userMapper.toDomain(postEntity.getUser(), new HashSet<Long>(), new HashSet<Long>(), "posts"));
        res.setDeleted(postEntity.getDeleted());
        if (postEntity.getUsersWhoLiked() != null) {
            res.setUsersWhoLiked(new ArrayList<>());
            for (UserEntity userEntity : postEntity.getUsersWhoLiked()) {
                res.getUsersWhoLiked().add(userMapper.toDomain(userEntity, new HashSet<Long>(), new HashSet<Long>(), "posts"));
            }
        }

        return res;
    }

    public PostEntity toPersistence(Post post) throws ParseException {
        PostEntity res = new PostEntity();

        res.setId(post.getId());
        res.setTitle(post.getTitle());
        res.setDescription(post.getDescription());
        res.setImage(post.getImage());
        res.setBuild(buildMapper.toPersistence(post.getBuild()));
        res.setUser(userMapper.toPersistence(post.getUser(), new HashSet<>(), new HashSet<>(), "posts"));
        res.setDeleted(post.getDeleted());
        if (post.getUsersWhoLiked() != null) {
            res.setUsersWhoLiked(new ArrayList<>());
            for (User user : post.getUsersWhoLiked()) {
                res.getUsersWhoLiked().add(userMapper.toPersistence(user, new HashSet<>(), new HashSet<>(), "posts"));
            }
        }

        return res;
    }
}
