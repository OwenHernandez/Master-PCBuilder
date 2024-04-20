package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;

import java.util.List;

public interface IBuildService {

    List<Build> findAll();

    Build save(Build build);

    Build findById(Long id);

    boolean deleteById(long id);

    boolean update(Build build);

    List<Build> findByName(String name);

    List<Build> findByUserId(Long userId);
}
