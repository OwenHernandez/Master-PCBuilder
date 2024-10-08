package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.ComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.UserEntity;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class UserEntityMapper {

    private final ComponentEntityMapper compMapper = new ComponentEntityMapper();

    public User toDomain(UserEntity userEntity, Set<Long> processedFriendsIds, Set<Long> processedBlockedUsersIds, String calledBy) {

        if (calledBy.equals("friends")) {
            if (processedFriendsIds.contains(userEntity.getId())) {
                // Esta entidad ya ha sido procesada, evitar la recursión infinita.
                return null;
            } else {
                processedFriendsIds.add(userEntity.getId());
            }
        }

        if (calledBy.equals("blockedUsers")) {
            if (processedBlockedUsersIds.contains(userEntity.getId())) {
                // Esta entidad ya ha sido procesada, evitar la recursión infinita.
                return null;
            } else {
                processedBlockedUsersIds.add(userEntity.getId());
            }
        }

        User res = new User();
        res.setId(userEntity.getId());
        res.setNick(userEntity.getNick());
        res.setPassword(userEntity.getPassword());
        res.setRole(userEntity.getRole());
        res.setActive(userEntity.getActive());
        res.setDeleted(userEntity.getDeleted());
        res.setEmail(userEntity.getEmail());
        res.setPicture(userEntity.getPicture());
        res.setHash(userEntity.getHash());

        if (userEntity.getComponentsCreated() != null && !userEntity.getComponentsCreated().isEmpty()) {
            res.setComponentsCreated(new ArrayList<>());
            for (ComponentEntity ce : userEntity.getComponentsCreated()) {
                if (ce.getDeleted() == 1) {
                    continue;
                }
                Component c = compMapper.toDomain(ce);
                c.setUserWhoCreated(res);
                res.getComponentsCreated().add(c);
            }
        }

        if (userEntity.getComponentsWanted() != null && !userEntity.getComponentsWanted().isEmpty()) {
            List<Component> componentsWanted = new ArrayList<>();
            for (ComponentEntity ce : userEntity.getComponentsWanted()) {
                Component c = compMapper.toDomain(ce);
                c.setUserWhoCreated(res);
                componentsWanted.add(c);
            }
            res.setComponentsWanted(componentsWanted);
        }

        if (userEntity.getFriends() != null && !userEntity.getFriends().isEmpty()) {
            res.setFriends(new ArrayList<>());
            for (UserEntity ue : userEntity.getFriends()) {
                User u = toDomain(ue, new HashSet<>(processedFriendsIds), new HashSet<>(processedBlockedUsersIds), "friends");
                res.getFriends().add(u);
            }
        }

        if (userEntity.getBlockedUsers() != null && !userEntity.getBlockedUsers().isEmpty()) {
            res.setBlockedUsers(new ArrayList<>());
            for (UserEntity ue : userEntity.getBlockedUsers()) {
                User u = toDomain(ue, new HashSet<>(processedFriendsIds), new HashSet<>(processedBlockedUsersIds), "blockedUsers");
                res.getBlockedUsers().add(u);
            }
        }

        return res;
    }

    public UserEntity toPersistence(User user, Set<Long> processedFriendsIds, Set<Long> processedBlockedUsersIds, String calledBy) throws ParseException {
        if (calledBy.equals("friends")) {
            if (processedFriendsIds.contains(user.getId())) {
                // Esta entidad ya ha sido procesada, evitar la recursión infinita.
                return null;
            } else {
                processedFriendsIds.add(user.getId());
            }
        }

        if (calledBy.equals("blockedUsers")) {
            if (processedBlockedUsersIds.contains(user.getId())) {
                // Esta entidad ya ha sido procesada, evitar la recursión infinita.
                return null;
            } else {
                processedBlockedUsersIds.add(user.getId());
            }
        }

        UserEntity res = new UserEntity();
        res.setId(user.getId());
        res.setNick(user.getNick());
        res.setPassword(user.getPassword());
        res.setRole(user.getRole());
        res.setEmail(user.getEmail());
        res.setActive(user.getActive());
        res.setDeleted(user.getDeleted());
        res.setHash(user.getHash());
        res.setPicture(user.getPicture());

        res.setComponentsCreated(new ArrayList<>());
        if (user.getComponentsCreated() != null && !user.getComponentsCreated().isEmpty()) {
            for (Component c : user.getComponentsCreated()) {
                if (c == null || c.getDeleted() == 1) {
                    continue;
                }
                ComponentEntity ce = compMapper.toPersistence(c);
                ce.setUser(res);
                res.getComponentsCreated().add(ce);
            }
        }

        res.setComponentsWanted(new ArrayList<>());
        if (user.getComponentsWanted() != null) {
            for (Component c : user.getComponentsWanted()) {
                if (c == null || c.getDeleted() == 1) {
                    continue;
                }
                ComponentEntity ce = compMapper.toPersistence(c);
                ce.setUser(res);
                res.getComponentsWanted().add(ce);
            }
        }

        res.setFriends(new ArrayList<>());
        if (user.getFriends() != null && !user.getFriends().isEmpty()) {
            for (User u : user.getFriends()) {
                if (u == null) {
                    continue;
                }
                UserEntity ue = toPersistence(u, new HashSet<>(processedFriendsIds), new HashSet<>(processedBlockedUsersIds), "friends");
                res.getFriends().add(ue);
            }
        }

        res.setBlockedUsers(new ArrayList<>());
        if (user.getBlockedUsers() != null && !user.getBlockedUsers().isEmpty()) {
            for (User u : user.getBlockedUsers()) {
                if (u == null) {
                    continue;
                }
                UserEntity ue = toPersistence(u, new HashSet<>(processedFriendsIds), new HashSet<>(processedBlockedUsersIds), "blockedUsers");
                res.getBlockedUsers().add(ue);
            }
        }

        return res;
    }
}
