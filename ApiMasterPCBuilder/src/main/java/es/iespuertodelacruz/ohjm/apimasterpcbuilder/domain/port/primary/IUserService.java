package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;

import java.util.List;

public interface IUserService {

    List<User> findAll();

    User save(User user);

    User findById(Integer id);

    User findByNick(String nick);

    User findByEmail(String email);
}
