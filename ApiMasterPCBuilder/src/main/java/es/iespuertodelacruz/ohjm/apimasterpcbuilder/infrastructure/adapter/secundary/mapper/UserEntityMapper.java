package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.ComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.UserEntity;

import java.util.ArrayList;
import java.util.List;

public class UserEntityMapper {

    ComponentEntityMapper compMapper = new ComponentEntityMapper();

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
        if (userEntity.getComponentsCreated() != null && !userEntity.getComponentsCreated().isEmpty()) {
            res.setComponentsCreated(new ArrayList<>());
            for (ComponentEntity ce : userEntity.getComponentsCreated()) {
                Component c = compMapper.toDomain(ce);
                c.setUserWhoCreated(res);
                res.getComponentsCreated().add(c);
            }
        }

        if (userEntity.getComponentsWanted() != null) {
            List<Component> componentsWanted = new ArrayList<>();
            for (ComponentEntity ce : userEntity.getComponentsWanted()) {
                Component c = compMapper.toDomain(ce);
                c.setUserWhoCreated(res);
                componentsWanted.add(c);
            }
            res.setComponentsWanted(componentsWanted);
        }

        List<User> friends = null;
        if (userEntity.getFriends() != null && !userEntity.getFriends().isEmpty()) {
            friends = new ArrayList<>();
            for (UserEntity ue : userEntity.getFriends()) {
                ue.setFriends(null);
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
        ue.setFriends(null);

        return ue;
    }
}
