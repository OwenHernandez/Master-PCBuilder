package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IUserRepository {

    List<User> findAll();

    User save(User user);

    User findById(Long id);

    User findByNick(String nick);

    User findByEmail(String email);

    List<User> findByRole(String role);
}
