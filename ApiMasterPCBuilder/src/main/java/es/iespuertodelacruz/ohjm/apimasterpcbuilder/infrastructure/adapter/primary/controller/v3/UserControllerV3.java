package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v3;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.FileStorageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.*;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.exception.GraphQLErrorException;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.UserDTOMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.service.AuthService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.security.UserDetailsLogin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;

import java.io.IOException;
import java.net.URLConnection;
import java.util.Base64;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Controller
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class UserControllerV3 {

    @Autowired
    private IUserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthService authService;

    @Autowired
    private FileStorageService storageService;

    private final UserDTOMapper userDTOMapper = new UserDTOMapper();

    @SchemaMapping(typeName = "Query", field = "users")
    public List<UserV3DTO> getUsers() {
        List<User> users = userService.findAll();
        return userService.findAll().stream()
                .map(userDTOMapper::toV3DTO)
                .collect(Collectors.toList());
    }

    @SchemaMapping(typeName = "Query", field = "user")
    public UserV3DTO getUser(@Argument long id) {
        User byId = userService.findById(id);
        if (byId == null) {
            throw new GraphQLErrorException("User not found", HttpStatus.NOT_FOUND);
        }
        return userDTOMapper.toV3DTO(byId);
    }

    @SchemaMapping(typeName = "Mutation", field = "saveUser")
    public UserV3DTO save(@Argument UserInputV3DTO user) {
        if (user == null) {
            throw new GraphQLErrorException("User cannot be null", HttpStatus.BAD_REQUEST);
        }
        UserDetailsLogin udl = new UserDetailsLogin();
        udl.setUsername(user.getNick());
        udl.setPassword(user.getPassword());
        udl.setEmail(user.getEmail());
        udl.setRole(user.getRole());


        User newUser = authService.registerV3(udl);

        if (user.getPicture() != null) {
            String codedPicture = user.getPictureBase64();
            byte[] photoBytes = Base64.getDecoder().decode(codedPicture);
            String newFileName = storageService.save(user.getNick() + "_" + user.getPicture(), photoBytes);
            newUser.setPicture(newFileName);
        } else {
            newUser.setPicture("default.png");
        }
        newUser.setActive((byte) 1);
        newUser.setDeleted((byte) 0);
        User save = userService.save(newUser);

        return userDTOMapper.toV3DTO(save);
    }

    @SchemaMapping(typeName = "Mutation", field = "updateUser")
    public UserV3DTO update(@Argument Long id, @Argument UserInputV3DTO user) {
        if (user == null) {
            throw new GraphQLErrorException("User cannot be null", HttpStatus.BAD_REQUEST);
        }
        User userToUpdate = userService.findById(id);
        if (userToUpdate == null) {
            throw new GraphQLErrorException("User not found", HttpStatus.NOT_FOUND);
        }
        userToUpdate.setPassword(passwordEncoder.encode(user.getPassword()));
        userToUpdate.setRole(user.getRole());


        if (user.getPicture() != null && !user.getPicture().isEmpty()) {
            String codedPicture = user.getPictureBase64();
            byte[] photoBytes = Base64.getDecoder().decode(codedPicture);
            String newFileName = storageService.save(user.getNick() + "_" + user.getPicture(), photoBytes);
            userToUpdate.setPicture(newFileName);
        }

        User save = userService.save(userToUpdate);
        return userDTOMapper.toV3DTO(save);
    }

    @SchemaMapping(typeName = "Mutation", field = "deleteUser")
    public boolean delete(@Argument long id) {
        User byId = userService.findById(id);
        if (byId == null) {
            throw new GraphQLErrorException("User not found", HttpStatus.NOT_FOUND);
        }
        byId.setDeleted((byte) 1);
        try {
            User save = userService.save(byId);
            if (save.getDeleted()==1) {
                return true;
            }
        } catch (Exception e) {
            throw new GraphQLErrorException("Error deleting user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return false;
    }

    @SchemaMapping(typeName = "Query", field = "getImage")
    public FileResponseDTO getImage(@Argument String filename) throws IOException {
        try {
            Resource resource = storageService.get(filename);
            String contentType = URLConnection.guessContentTypeFromStream(resource.getInputStream());
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            if (resource.getInputStream().readAllBytes() == null) {
                throw new GraphQLErrorException("Image not found", HttpStatus.NOT_FOUND);
            }
            String encodedfile = Base64.getEncoder().encodeToString(resource.getInputStream().readAllBytes());
            return new FileResponseDTO(contentType, encodedfile);
        } catch (IOException e) {
            throw new GraphQLErrorException("Error getting image", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}