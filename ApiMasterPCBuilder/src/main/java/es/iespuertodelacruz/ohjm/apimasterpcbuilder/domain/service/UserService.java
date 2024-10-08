package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements IUserService {

    @Autowired
    IUserRepository repo;

    @Override
    public List<User> findAll() {
        return repo.findAll();
    }

    @Override
    public User save(User user) {

        if (user == null) {
            return null;
        }
        return repo.save(user);
    }

    @Override
    public boolean delete(Long id) {
        if (id == null) {
            return false;
        }
        return repo.delete(id);
    }

    @Override
    public User findById(Long id) {
        User u = null;
        if (id != null) {
            u = repo.findById(id);
        }
        return u;
    }

    @Override
    public User findByNick(String nick) {

        if (nick == null || nick.isBlank()) {
            return null;
        }
        return repo.findByNick(nick);
    }

    @Override
    public User findByEmail(String email) {

        if (email == null || email.isBlank()) {
            return null;
        }
        return repo.findByEmail(email);
    }

    @Override
    public List<User> findByRole(String role) {
        if (role == null || role.isBlank()) {
            return null;
        }
        return repo.findByRole(role);
    }

}
