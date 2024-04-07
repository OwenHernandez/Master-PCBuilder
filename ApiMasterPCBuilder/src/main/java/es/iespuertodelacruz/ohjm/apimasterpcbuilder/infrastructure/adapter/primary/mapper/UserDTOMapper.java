package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentOutputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.UserDTO;

import java.util.ArrayList;
import java.util.List;

public class UserDTOMapper {

    ComponentDTOMapper compMapper = new ComponentDTOMapper();
    public User toDomain(UserDTO userDTO) {
        User user = new User();
        user.setId(userDTO.getId());
        user.setNick(userDTO.getNick());
        user.setEmail(userDTO.getEmail());
        user.setPicture(userDTO.getPicture());
        List<User> friends = null;
        if (userDTO.getFriends() != null && !userDTO.getFriends().isEmpty()) {
            friends = new ArrayList<>();
            for (UserDTO uDTO : userDTO.getFriends()) {
                User u = toDomain(uDTO);
                friends.add(u);
            }
        }
        user.setFriends(friends);
        return user;
    }

    public UserDTO toDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setNick(user.getNick());
        userDTO.setEmail(user.getEmail());
        userDTO.setPicture(user.getPicture());
        if (user.getComponentsWanted() != null && !user.getComponentsWanted().isEmpty()) {
            List<ComponentOutputDTO> componentsWanted = new ArrayList<>();
            for (Component c : user.getComponentsWanted()) {
                ComponentOutputDTO cDTO = compMapper.toDTO(c);

                componentsWanted.add(cDTO);
            }
            userDTO.setComponentsWanted(componentsWanted);
        }else {
            userDTO.setComponentsWanted(new ArrayList<>());
        }
        if (user.getFriends() != null && !user.getFriends().isEmpty()) {
            userDTO.setFriends(new ArrayList<>());
            for (User u : user.getFriends()) {
                u.setFriends(null);
                UserDTO uDTO = toDTO(u);
                userDTO.getFriends().add(uDTO);
            }
        }else{
            userDTO.setFriends(new ArrayList<>());
        }
        if (user.getBlockedUsers() != null && !user.getBlockedUsers().isEmpty()) {
            userDTO.setBlockedUsers(new ArrayList<>());
            for (User u : user.getBlockedUsers()) {
                u.setBlockedUsers(null);
                UserDTO uDTO = toDTO(u);
                userDTO.getBlockedUsers().add(uDTO);
            }
        }else {
            userDTO.setBlockedUsers(new ArrayList<>());
        }
        return userDTO;
    }
}
