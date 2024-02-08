package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;

import java.util.List;

public interface IUserRepository {

    List<User> findAll();

    User save(User user);

    User findById(Integer id);

    User findByNick(String nick);

    User findByEmail(String email);
}
