package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
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
import java.util.Base64;

@RestController
@CrossOrigin
@RequestMapping("/api/v2/users")
public class UserRestControllerV2 {

    @Autowired
    IUserService userService;

    @Autowired
    FileStorageService storageService;

    UserDTOMapper mapper = new UserDTOMapper();

    @GetMapping
    public ResponseEntity<?> getByNick(@RequestParam("nick") String nick) {
        if (nick == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The nick parameter is required");
        } else {
            User byNick = userService.findByNick(nick);
            UserDTO userDTO = mapper.toDTO(byNick);
            return ResponseEntity.ok(userDTO);
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

                userService.save(byId);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
            }
        }
    }

    @GetMapping("/img/{id}/{filename}")
    public ResponseEntity<?> getFiles(@PathVariable("id") long userId, @PathVariable("filename") String filename) {
        System.out.println("coso");
        User byId = userService.findById(userId);
        if (byId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The user does not exist");
        }
        Object principal =
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User userByNick = userService.findByNick(username);

        if (userByNick != null) {
            if (byId.getId() != userByNick.getId()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not that user");
            }
            Resource resource = storageService.get(filename);

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

}
