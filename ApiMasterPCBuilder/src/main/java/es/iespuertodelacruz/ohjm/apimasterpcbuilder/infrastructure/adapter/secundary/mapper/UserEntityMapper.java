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
        List<User> friends = new ArrayList<>();
        for (UserEntity ue : userEntity.getFriends()) {
            User u = new User();
            u.setId(ue.getId());
            u.setNick(ue.getNick());
            u.setPassword(ue.getPassword());
            u.setRole(ue.getRole());
            u.setActive(ue.getActive());
            u.setEmail(ue.getEmail());
            u.setPicture(ue.getPicture());
            friends.add(u);
        }
        res.setFriends(friends);
        return res;
    }

    public UserEntity toPersistance(User user) {

    }
}
