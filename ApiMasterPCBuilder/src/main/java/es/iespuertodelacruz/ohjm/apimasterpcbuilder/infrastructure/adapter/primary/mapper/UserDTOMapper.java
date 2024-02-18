package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.UserDTO;

import java.util.ArrayList;
import java.util.List;

public class UserDTOMapper {
    public User toDomain(UserDTO userDTO) {
        User user = new User();
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
        userDTO.setNick(user.getNick());
        userDTO.setEmail(user.getEmail());
        userDTO.setPicture(user.getPicture());
        List<UserDTO> friends = null;
        if (user.getFriends() != null && !user.getFriends().isEmpty()) {
            friends = new ArrayList<>();
            for (User u : user.getFriends()) {
                UserDTO uDTO = toDTO(u);
                friends.add(uDTO);
            }
        }
        userDTO.setFriends(friends);
        return userDTO;
    }
}
