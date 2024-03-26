package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IUserRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.UserEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.UserEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IUserEntityRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
public class UserEntityService implements IUserRepository {

    @Autowired
    private IUserEntityRepository repo;

    private final UserEntityMapper mapper = new UserEntityMapper();

    @Transactional
    @Override
    public User findById(Long id) {
        User user = null;
        if (id != null) {
            Optional<UserEntity> opt = repo.findById(id);
            if (opt.isPresent()) {
                UserEntity userEntity = opt.get();
                user = mapper.toDomain(userEntity, new HashSet<Long>(), new HashSet<Long>(), "findById");
            }
        }
        return user;
    }

    @Transactional
    @Override
    public User findByNick(String nick) {
        User user = null;
        if (nick != null) {
            UserEntity ue = repo.findByNick(nick);
            if (ue == null) {
                return null;
            }
            user = mapper.toDomain(ue, new HashSet<Long>(), new HashSet<Long>(), "findByNick");
        }
        return user;
    }

    @Transactional
    @Override
    public User findByEmail(String email) {
        User user = null;
        if (email != null) {
            UserEntity ue = repo.findByEmail(email);
            user = mapper.toDomain(ue, new HashSet<Long>(), new HashSet<Long>(), "findByEmail");
        }
        return user;
    }

    @Transactional
    @Override
    public List<User> findAll() {
        List<User> users = new ArrayList<>();
        Iterable<UserEntity> repoAll = repo.findAll();
        for (UserEntity ue : repoAll) {
            User domain = mapper.toDomain(ue, new HashSet<Long>(), new HashSet<Long>(), "findAll");
            users.add(domain);
        }

        return users;
    }

    @Override
    @Transactional
    public User save(User user) {
        User res = null;
        if (user != null) {
            try {
                UserEntity ue = mapper.toPersistence(user, new HashSet<>(), new HashSet<>(), "save");
                UserEntity save = repo.save(ue);

                res = mapper.toDomain(save, new HashSet<Long>(), new HashSet<Long>(), "save");
            } catch (RuntimeException | ParseException e) {
                return null;
            }
        }
        return res;
    }

    @Override
    public List<User> findByRole(String role) {
        List<User> users = new ArrayList<>();
        List<UserEntity> repoByRole = this.repo.findByRole(role);
        for (UserEntity ue : repoByRole) {
            User domain = mapper.toDomain(ue, new HashSet<Long>(), new HashSet<Long>(), "findByRole");
            users.add(domain);
        }

        return users;
    }
}
