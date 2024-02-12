package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.UserEntity;

import java.util.ArrayList;
import java.util.List;

public class UserEntityMapper {
    public User toDomain(UserEntity userEntity) {
        User res = new User();
        res.setId(userEntity.getId());
        res.setNick(userEntity.getNick());
        res.setPassword(userEntity.getPassword());
        res.setRole(userEntity.getRole());
        res.setActive(userEntity.getActive());
        res.setEmail(userEntity.getEmail());
        res.setPicture(userEntity.getPicture());
        res.setHash(userEntity.getHash());

        List<User> friends = null;
        if (userEntity.getFriends() != null && !userEntity.getFriends().isEmpty()) {
            friends = new ArrayList<>();
            for (UserEntity ue : userEntity.getFriends()) {
                User u = toDomain(ue);
                friends.add(u);
            }
        }
        res.setFriends(friends);
        return res;
    }

    public UserEntity toPersistance(User user) {
        UserEntity ue = new UserEntity();
        ue.setId(user.getId());
        ue.setNick(user.getNick());
        ue.setPassword(user.getPassword());
        ue.setRole(user.getRole());
        ue.setEmail(user.getEmail());
        ue.setActive(user.getActive());
        ue.setHash(user.getHash());
        ue.setPicture(user.getPicture());
        List<UserEntity> friends = null;
        if (user.getFriends() != null && user.getFriends().isEmpty()) {
            friends = new ArrayList<>();
            for (User u : user.getFriends()) {
                UserEntity userEntity = toPersistance(u);
                friends.add(userEntity);
            }
        }
        ue.setFriends(friends);

        return ue;
    }
}
