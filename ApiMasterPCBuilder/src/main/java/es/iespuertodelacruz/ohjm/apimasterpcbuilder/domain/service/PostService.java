package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Post;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IPostService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService implements IPostService {

    @Autowired
    IPostRepository repo;


    @Override
    public List<Post> findAll() {
        return repo.findAll();
    }

    @Override
    public Post save(Post post) {
        return repo.save(post);
    }

    @Override
    public Post findById(Long id) {
        return repo.findById(id);
    }

    @Override
    public boolean deleteById(long id) {
        return repo.deleteById(id);
    }

    @Override
    public boolean update(Post post) {
        return repo.update(post);
    }

    @Override
    public List<Post> findByTitle(String title) {
        return repo.findByTitle(title);
    }

    @Override
    public List<Post> findByBuildId(Long buildId) {
        return repo.findByBuildId(buildId);
    }

    @Override
    public List<Post> findByUserId(Long userId) {
        return repo.findByUserId(userId);
    }
}
