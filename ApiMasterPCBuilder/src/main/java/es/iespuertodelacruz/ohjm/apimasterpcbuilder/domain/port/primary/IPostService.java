package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Post;

import java.util.List;

public interface IPostService {

    List<Post> findAll();

    Post save(Post build);

    Post findById(Long id);

    boolean deleteById(long id);

    boolean update(Post post);

    List<Post> findByTitle(String title);

    List<Post> findByBuildId(Long buildId);

    List<Post> findByUserId(Long userId);
}
