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
        repo.findAll().forEach(postEntity -> res.add(mapper.toDomain(postEntity)));
        return res;
    }

    @Override
    public Post save(Post post) {
        try {
            return mapper.toDomain(repo.save(mapper.toPersistence(post)));
        } catch (RuntimeException | ParseException e) {
            return null;
        }
    }

    @Override
    public Post findById(Long id) {
        Optional<PostEntity> byId = repo.findById(id);
        if (byId.isPresent()) {
            return mapper.toDomain(byId.get());
        } else {
            return null;
        }
    }

    @Override
    public boolean deleteById(long id) {
        try {
            if (!repo.existsById(id)) {
                return false;
            }
            repo.deleteById(id);
            return true;
        } catch (RuntimeException e) {
            return false;
        }
    }

    @Override
    public boolean update(Post post) {
        try {
            if (!repo.existsById(post.getId())) {
                return false;
            }
            repo.save(mapper.toPersistence(post));
            return true;
        } catch (RuntimeException | ParseException e) {
            return false;
        }
    }

    @Override
    public List<Post> findByTitle(String title) {
        if (title == null) {
            return null;
        }
        List<PostEntity> byTitle = repo.findByTitle(title);
        if (byTitle != null) {
            List<Post> res = new ArrayList<>();
            byTitle.forEach(postEntity -> res.add(mapper.toDomain(postEntity)));
            return res;
        } else {
            return null;
        }
    }

    @Override
    public List<Post> findByBuildId(Long buildId) {
        if (buildId == null) {
            return null;
        }
        List<PostEntity> byBuildId = repo.findByBuildId(buildId);
        if (byBuildId != null) {
            List<Post> res = new ArrayList<>();
            byBuildId.forEach(postEntity -> res.add(mapper.toDomain(postEntity)));
            return res;
        } else {
            return null;
        }
    }

    @Override
    public List<Post> findByUserId(Long userId) {
        if (userId == null) {
            return null;
        }
        List<PostEntity> byUserId = repo.findByUserId(userId);
        if (byUserId != null) {
            List<Post> res = new ArrayList<>();
            byUserId.forEach(postEntity -> res.add(mapper.toDomain(postEntity)));
            return res;
        } else {
            return null;
        }
    }
}
