package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Post;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IPostRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.PostEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.PostEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IPostEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PostEntityService implements IPostRepository {

    @Autowired
    IPostEntityRepository repo;

    PostEntityMapper mapper = new PostEntityMapper();

    @Override
    public List<Post> findAll() {
        List<Post> res = new ArrayList<>();
        List<PostEntity> all = repo.findAll();

        for (PostEntity postEntity : all) {
            Post post = mapper.toDomain(postEntity);
            res.add(post);
        }

        return res;
    }

    @Override
    public Post save(Post post) {
        try {
            if (post != null) {
                PostEntity postEntity = mapper.toPersistance(post);
                PostEntity save = repo.save(postEntity);
                return mapper.toDomain(save);
            } else {
                return null;
            }
        } catch (RuntimeException | ParseException e) {
            return null;
        }
    }

    @Override
    public Post findById(Long id) {
        try {
            if (id != null) {
                Optional<PostEntity> postEntity = repo.findById(id);
                return postEntity.map(entity -> mapper.toDomain(entity)).orElse(null);
            } else {
                return null;
            }
        } catch (RuntimeException e) {
            return null;
        }
    }

    @Override
    public boolean deleteById(long id) {
        try {
            Optional<PostEntity> byId = repo.findById(id);
            if (byId.isPresent()) {
                repo.deleteById(id);
                return true;
            } else {
                return false;
            }
        } catch (RuntimeException e) {
            return false;
        }
    }

    @Override
    public boolean update(Post post) {
        try {
            Optional<PostEntity> byId = repo.findById(post.getId());
            if (byId.isPresent()) {
                PostEntity postEntity = mapper.toPersistance(post);
                repo.save(postEntity);
                return true;
            } else {
                return false;
            }
        } catch (RuntimeException | ParseException e) {
            return false;
        }
    }

    @Override
    public List<Post> findByTitle(String title) {
        try {
            if (title != null) {
                List<PostEntity> byTitle = repo.findByTitle(title);
                if (byTitle != null) {
                    List<Post> res = new ArrayList<>();
                    for (PostEntity postEntity : byTitle) {
                        Post post = mapper.toDomain(postEntity);
                        res.add(post);
                    }
                    return res;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (RuntimeException e) {
            return null;
        }
    }

    @Override
    public List<Post> findByBuildId(Long buildId) {
        try {
            if (buildId != null) {
                List<PostEntity> byBuildId = repo.findByBuildId(buildId);
                if (byBuildId != null) {
                    List<Post> res = new ArrayList<>();
                    for (PostEntity postEntity : byBuildId) {
                        Post post = mapper.toDomain(postEntity);
                        res.add(post);
                    }
                    return res;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (RuntimeException e) {
            return null;
        }
    }

    @Override
    public List<Post> findByUserId(Long userId) {
        try {
            if (userId != null) {
                List<PostEntity> byUserId = repo.findByUserId(userId);
                if (byUserId != null) {
                    List<Post> res = new ArrayList<>();
                    for (PostEntity postEntity : byUserId) {
                        Post post = mapper.toDomain(postEntity);
                        res.add(post);
                    }
                    return res;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (RuntimeException e) {
            return null;
        }
    }
}
