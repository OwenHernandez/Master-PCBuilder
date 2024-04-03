package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.FileStorageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.UserDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.UserInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.UserDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Base64;

@RestController
@CrossOrigin
@RequestMapping("/api/v2/users")
public class UserRestControllerV2 {

    @Autowired
    IUserService userService;

    @Autowired
    IComponentService componentService;

    @Autowired
    FileStorageService storageService;

    UserDTOMapper mapper = new UserDTOMapper();

    @GetMapping
    public ResponseEntity<?> getAllOrByNickOrByBuild(@RequestParam(value = "nick", required = false) String nick) {
        if (nick != null) {
            User byNick = userService.findByNick(nick);
            UserDTO userDTO = mapper.toDTO(byNick);
            return ResponseEntity.ok(userDTO);
        } else {
            ArrayList<UserDTO> res = new ArrayList<>();
            for (User u : userService.findAll()) {
                res.add(mapper.toDTO(u));
            }
            return ResponseEntity.ok(res);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable("id") long id, @RequestBody UserInputDTO userDTO) {
        if (userDTO == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The user parameter is required");
        } else {
            Object principal =
                    SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = ((UserDetails) principal).getUsername();
            User userByNick = userService.findByNick(username);

            if (userByNick != null) {
                User byId = userService.findById(id);
                if (byId == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The user does not exist");
                } else if (byId.getId() != userByNick.getId()) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not that user");
                }
                String codedPicture = userDTO.getPictureBase64();
                byte[] photoBytes = Base64.getDecoder().decode(codedPicture);
                String newFileName = storageService.save(byId.getNick() + "_" + userDTO.getPicture(), photoBytes);
                if (userDTO.getPictureBase64() != null && !userDTO.getPictureBase64().isBlank()) {
                    byId.setPicture(newFileName);
                }
                if (userDTO.getPassword() != null && !userDTO.getPassword().isBlank()) {
                    byId.setPassword(userDTO.getPassword());
                }

                User save = userService.save(byId);
                return ResponseEntity.ok(mapper.toDTO(save));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
            }
        }
    }

    @GetMapping("/img/{id}/{filename}")
    public ResponseEntity<?> getFiles(@PathVariable("id") long userId, @PathVariable("filename") String filename) {
        User byId = userService.findById(userId);
        if (byId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The user does not exist");
        }
        Object principal =
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User userByNick = userService.findByNick(username);

        if (userByNick != null) {
            Resource resource = null;
            try {
                resource = storageService.get(filename);
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The file does not exist");
            }
            String contentType = null;
            try {
                contentType = URLConnection.guessContentTypeFromStream(resource.getInputStream());
            } catch (IOException ex) {
                System.out.println("Could not determine file type.");
            }
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            String headerValue = "attachment; filename=\"" + resource.getFilename() + "\"";
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(
                            org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                            headerValue
                    ).body(resource);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
        }
    }

    @PutMapping("/friends/{id}/{friendId}")
    public ResponseEntity<?> addRemoveFriend(@PathVariable("id") long id, @PathVariable("friendId") long friendId) {
        User byId = userService.findById(id);
        User friend = userService.findById(friendId);
        if (byId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The user does not exist");
        } else if (friend == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The friend does not exist");
        }
        Object principal =
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User userByNick = userService.findByNick(username);

        if (userByNick == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
        }
        if (byId.getId() != userByNick.getId()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not that user");
        }
        if (friend.getId() == byId.getId()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You can't add yourself as a friend");
        }
        if (byId.getBlockedUsers() != null && byId.getBlockedUsers().contains(friend)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You can't add a blocked user as a friend");
        }
        if (friend.getBlockedUsers() != null && friend.getBlockedUsers().contains(byId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You can't add a user that has blocked you as a friend");
        }
        if (byId.getFriends() == null) {
            byId.setFriends(new ArrayList<>());
        }
        if (byId.getFriends().contains(friend)) {
            byId.getFriends().remove(friend);
        } else {
            byId.getFriends().add(friend);
        }
        User save = userService.save(byId);
        if (save != null) {
            return ResponseEntity.ok(mapper.toDTO(save));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    @PutMapping("/{id}/wishlist/{componentId}")
    public ResponseEntity<?> addRemoveFromWishlist(@PathVariable("id") long id, @PathVariable("componentId") long componentId) {
        User byId = userService.findById(id);
        if (byId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The user does not exist");
        }
        Object principal =
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();

        User userByNick = userService.findByNick(username);

        if (userByNick == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
        }
        if (byId.getId() != userByNick.getId()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not that user");
        }
        Component compById = componentService.findById(componentId);
        if (compById == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The component does not exist");
        }
        if (byId.getComponentsWanted() == null) {
            byId.setComponentsWanted(new ArrayList<>());
        }
        if (byId.getComponentsWanted().contains(compById)) {
            byId.getComponentsWanted().remove(compById);
        } else {
            byId.getComponentsWanted().add(compById);
        }
        User save = userService.save(byId);
        if (save != null) {
            return ResponseEntity.ok(mapper.toDTO(save));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    @PutMapping("/block/{id}/{blockedId}")
    public ResponseEntity<?> addRemoveBlock(@PathVariable("id") long id, @PathVariable("blockedId") long blockedId) {
        User byId = userService.findById(id);
        User userBlocked = userService.findById(blockedId);
        if (byId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The user does not exist");
        } else if (userBlocked == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The friend does not exist");
        }
        Object principal =
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User userByNick = userService.findByNick(username);

        if (userByNick == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
        }
        if (byId.getId() != userByNick.getId()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not that user");
        }
        if (userBlocked.getId() == byId.getId()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You can't block yourself");
        }
        if (byId.getBlockedUsers() == null) {
            byId.setBlockedUsers(new ArrayList<>());
        }
        if (byId.getFriends() != null) {
            byId.getFriends().remove(userBlocked);
        }
        if (userBlocked.getFriends() != null) {
            userBlocked.getFriends().remove(byId);
        }
        if (byId.getBlockedUsers().contains(userBlocked)) {
            byId.getBlockedUsers().remove(userBlocked);
        } else {
            byId.getBlockedUsers().add(userBlocked);
        }
        User save = userService.save(byId);
        if (save != null) {
            return ResponseEntity.ok(mapper.toDTO(save));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }
}
