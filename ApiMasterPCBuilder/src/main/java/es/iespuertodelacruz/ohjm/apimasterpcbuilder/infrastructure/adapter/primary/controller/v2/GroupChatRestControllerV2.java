package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.GroupChat;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IGroupChatService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.FileStorageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.GroupChatInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.GroupChatOutputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.GroupChatDTOMapper;
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
import java.util.List;

@RestController
@RequestMapping("/api/v2/groups")
public class GroupChatRestControllerV2 {

    @Autowired
    private IGroupChatService groupChatService;

    @Autowired
    private IUserService userService;

    @Autowired
    FileStorageService storageService;

    private final GroupChatDTOMapper mapper = new GroupChatDTOMapper();

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(value = "userId") Long userId) {
        User byId = userService.findById(userId);
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User byNick = userService.findByNick(username);

        if (byId != null && byNick != null) {
            if (!byId.getNick().equals(byNick.getNick())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not allowed to see this user's group chats");
            }
            List<GroupChat> byUserId = groupChatService.findByUserId(userId);
            if (byUserId != null) {
                List<GroupChatOutputDTO> res = new ArrayList<>();
                for (GroupChat groupChat : byUserId) {
                    res.add(mapper.toDTO(groupChat));
                }
                return ResponseEntity.ok(res);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("There is nothing to show");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") Long id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User byNick = userService.findByNick(username);

        if (byNick != null) {
            GroupChat groupChat = groupChatService.findById(id);
            if (groupChat != null) {
                return ResponseEntity.ok(mapper.toDTO(groupChat));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("There is nothing to show");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
        }
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody GroupChatInputDTO inputDTO) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User byNick = userService.findByNick(username);

        if (byNick != null) {
            GroupChat groupChat = mapper.toDomain(inputDTO);
            String codedPicture = inputDTO.getPictureBase64();
            byte[] photoBytes = Base64.getDecoder().decode(codedPicture);
            String newFileName = storageService.save(groupChat.getName() + "_" + inputDTO.getPicture(), photoBytes);
            groupChat.setAdmin(byNick);
            groupChat.setPicture(newFileName);
            groupChat.setUsers(new ArrayList<>());
            groupChat.getUsers().add(byNick);
            GroupChat save = groupChatService.save(groupChat);
            if (save != null) {
                return ResponseEntity.ok(mapper.toDTO(save));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Something went wrong");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
        }
    }

    @GetMapping("/img/{id}/{filename}")
    public ResponseEntity<?> getFiles(@PathVariable("id") long groupId, @PathVariable("filename") String filename) {
        GroupChat byId = groupChatService.findById(groupId);
        if (byId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The group does not exist");
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

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable("id") Long id, @RequestBody GroupChatInputDTO inputDTO) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User byNick = userService.findByNick(username);

        if (byNick != null) {
            GroupChat byId = groupChatService.findById(id);
            if (byId == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("There is not a group chat with that id");
            }
            if (!byId.getAdmin().getNick().equals(byNick.getNick())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not the admin of this group chat");
            }
            if (!inputDTO.getPictureBase64().isBlank()) {
                String codedPicture = inputDTO.getPictureBase64();
                byte[] photoBytes = Base64.getDecoder().decode(codedPicture);
                String newFileName = storageService.save("GroupChat" + byId.getId() + "_" + inputDTO.getPicture(), photoBytes);
                byId.setPicture(newFileName);
            }
            if (!inputDTO.getName().isBlank()) {
                byId.setName(inputDTO.getName());
            }
            if (!inputDTO.getDescription().isBlank()) {
                byId.setDescription(inputDTO.getDescription());
            }
            boolean update = groupChatService.update(byId);
            if (update) {
                return ResponseEntity.ok(mapper.toDTO(byId));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Something went wrong");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
        }
    }

    @PutMapping("/{id}/users/{userId}")
    public ResponseEntity<?> addRemoveUser(@PathVariable("id") Long id, @PathVariable("userId") Long userId) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User byNick = userService.findByNick(username);

        if (byNick != null) {
            GroupChat byId = groupChatService.findById(id);
            if (byId == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("There is not a group chat with that id");
            }
            User user = userService.findById(userId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("There is not a user with that id");
            }
            if (byId.getUsers() == null) {
                byId.setUsers(new ArrayList<>());
            }
            if (byId.getUsers().contains(user)) {
                if (!byId.getAdmin().getNick().equals(byNick.getNick()) && !byNick.getNick().equals(user.getNick())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not the admin of this group chat or the user you are trying to remove is not you");
                } else {
                    if (byId.getAdmin().getNick().equals(user.getNick())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can't remove the admin from the group chat");
                    }
                    byId.getUsers().remove(user);
                }
            } else {
                if (!byId.getAdmin().getNick().equals(byNick.getNick())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not the admin of this group chat");
                }
                byId.getUsers().add(user);
            }
            boolean update = groupChatService.update(byId);
            if (update) {
                return ResponseEntity.ok(mapper.toDTO(byId));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Something went wrong");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
        }
    }

    @PutMapping("/{id}/admins/{userId}")
    public ResponseEntity<?> addRemoveAdmin(@PathVariable("id") Long id, @PathVariable("userId") Long userId) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User byNick = userService.findByNick(username);

        if (byNick != null) {
            GroupChat byId = groupChatService.findById(id);
            if (byId == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("There is not a group chat with that id");
            }
            User user = userService.findById(userId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("There is not a user with that id");
            }
            if (byId.getUsers() == null) {
                byId.setUsers(new ArrayList<>());
            }
            if (byId.getUsers().contains(user)) {
                if (!byId.getAdmin().getNick().equals(byNick.getNick())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not the admin of this group chat");
                }
                byId.setAdmin(user);
                boolean update = groupChatService.update(byId);
                if (update) {
                    return ResponseEntity.ok(mapper.toDTO(byId));
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Something went wrong");
                }
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The user you are trying to make admin is not in the group chat");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
        }
    }
}
