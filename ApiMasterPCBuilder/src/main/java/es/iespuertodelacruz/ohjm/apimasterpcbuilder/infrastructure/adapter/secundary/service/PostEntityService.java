package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Post;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IPostRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.PostEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.PostEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IPostEntityRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PostEntityService implements IPostRepository {

    @Autowired
    private IPostEntityRepository repo;

    private final PostEntityMapper mapper = new PostEntityMapper();

    @Override
    @Transactional
    public List<Post> findAll() {
        List<Post> res = new ArrayList<>();
        repo.findAll().forEach(postEntity -> res.add(mapper.toDomain(postEntity)));
        return res;
    }

    @Override
    @Transactional
    public Post save(Post post) {
        try {
            return mapper.toDomain(repo.save(mapper.toPersistence(post)));
        } catch (ParseException e) {
            return null;
        }
    }

    @Override
    @Transactional
    public Post findById(Long id) {
        Optional<PostEntity> byId = repo.findById(id);
        return byId.map(mapper::toDomain).orElse(null);
    }

    @Override
    @Transactional
    public boolean deleteById(long id) {
        if (!repo.existsById(id)) {
            return false;
        }
        repo.deleteById(id);
        return true;
    }

    @Override
    @Transactional
    public boolean update(Post post) {
        try {
            if (!repo.existsById(post.getId())) {
                return false;
            }
            repo.save(mapper.toPersistence(post));
            return true;
        } catch (ParseException e) {
            return false;
        }
    }

    @Override
    @Transactional
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
    @Transactional
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
    @Transactional
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
