package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

class UserDTO {
    String nick;
    String email;
    String picture;
    List<UserDTO> friends;

    public UserDTO() {}

    public String getNick() {
        return nick;
    }

    public void setNick(String nick) {
        this.nick = nick;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public List<UserDTO> getFriends() {
        return friends;
    }

    public void setFriends(List<UserDTO> friends) {
        this.friends = friends;
    }
}

class UserDTOMapper {
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
@RestController
@CrossOrigin
@RequestMapping("/api/v2/users")
public class UserRestControllerV2 {

    @Autowired
    IUserService userService;

    UserDTOMapper mapper;

    @GetMapping
    public ResponseEntity<?> getAllOrByNick(@RequestParam(name = "nick", required = false) String nick) {
        mapper = new UserDTOMapper();
        if (nick == null) {
            List<User> all = userService.findAll();
            return ResponseEntity.ok(all);
        } else {
            User byNick = userService.findByNick(nick);
            UserDTO userDTO = mapper.toDTO(byNick);
            return ResponseEntity.ok(userDTO);
        }
    }
}
