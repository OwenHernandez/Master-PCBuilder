package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;

import java.util.List;

public interface IUserRepository {

    List<User> findAll();

    User save(User user);

    boolean delete(Long id);

    User findById(Long id);

    User findByNick(String nick);

    User findByEmail(String email);

    List<User> findByRole(String role);
}
