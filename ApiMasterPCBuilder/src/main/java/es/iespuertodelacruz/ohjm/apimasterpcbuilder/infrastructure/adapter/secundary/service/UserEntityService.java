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
import java.util.List;
import java.util.Optional;

@Service
public class UserEntityService implements IUserRepository {

    @Autowired
    IUserEntityRepository repo;

    UserEntityMapper mapper;

    public UserEntityService() {
        mapper = new UserEntityMapper();
    }

    @Override
    public User findById(Long id) {
        User user = null;
        if (id != null) {
            Optional<UserEntity> opt = repo.findById(id);
            if (opt.isPresent()) {
                UserEntity userEntity = opt.get();
                user = mapper.toDomain(userEntity);
            }
        }
        return user;
    }

    @Override
    public User findByNick(String nick) {
        User user = null;
        if (nick != null) {
            UserEntity ue = repo.findByNick(nick);
            if (ue == null) {
                return null;
            }
            user = mapper.toDomain(ue);
        }
        return user;
    }

    @Override
    public User findByEmail(String email) {
        User user = null;
        if (email != null) {
            UserEntity ue = repo.findByEmail(email);
            user = mapper.toDomain(ue);
        }
        return user;
    }

    @Override
    public List<User> findAll() {
        List<User> users = new ArrayList<>();
        Iterable<UserEntity> repoAll = repo.findAll();
        for (UserEntity ue : repoAll) {
            User domain = mapper.toDomain(ue);
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
                UserEntity ue = mapper.toPersistance(user);
                if (user.getFriends() != null && !user.getFriends().isEmpty()) {
                    List<UserEntity> friends = new ArrayList<>();
                    for (User u : user.getFriends()) {
                        UserEntity ueFriend = mapper.toPersistance(u);
                        friends.add(ueFriend);
                    }
                    ue.setFriends(friends);
                }
                UserEntity save = repo.save(ue);

                res = mapper.toDomain(save);
                if (user.getFriends() != null && !user.getFriends().isEmpty()) {
                    List<User> friends = new ArrayList<>();
                    for (UserEntity ueFriend : save.getFriends()) {
                        User u = mapper.toDomain(ueFriend);
                        friends.add(u);
                    }
                    res.setFriends(friends);
                }
            } catch (RuntimeException | ParseException e) {
                return null;
            }
        }
        return res;
    }
}
