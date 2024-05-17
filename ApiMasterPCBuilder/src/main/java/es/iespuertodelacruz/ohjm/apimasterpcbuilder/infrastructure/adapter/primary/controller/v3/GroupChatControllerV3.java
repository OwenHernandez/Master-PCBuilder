package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v3;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.GroupChat;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IGroupChatService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.FileStorageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.GroupChatInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.GroupChatOutputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.exception.GraphQLErrorException;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.GroupChatDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Controller
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class GroupChatControllerV3 {

    @Autowired
    private IGroupChatService groupChatService;

    @Autowired
    private IUserService userService;

    @Autowired
    private FileStorageService storageService;

    private final GroupChatDTOMapper groupChatDTOMapper = new GroupChatDTOMapper();

    @SchemaMapping(typeName = "Query", field = "groupChats")
    public List<GroupChatOutputDTO> getGroupChats() {
        return groupChatService.findAll().stream().map(groupChatDTOMapper::toDTO).toList();
    }

    @SchemaMapping(typeName = "Query", field = "groupChat")
    public GroupChatOutputDTO getGroupChat(@Argument Long id) {
        GroupChat byId = groupChatService.findById(id);
        if (byId == null) {
            throw new GraphQLErrorException("GroupChat not found", HttpStatus.NOT_FOUND);
        }
        return groupChatDTOMapper.toDTO(byId);
    }

    @SchemaMapping(typeName = "Mutation", field = "saveGroupChat")
    public GroupChatOutputDTO save(@Argument GroupChatInputDTO groupChat) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User byNick = userService.findByNick(username);

        GroupChat domain = groupChatDTOMapper.toDomain(groupChat);
        String codedPicture = groupChat.getPictureBase64();
        byte[] photoBytes = Base64.getDecoder().decode(codedPicture);
        String newFileName = storageService.save(groupChat.getName() + "_" + groupChat.getPicture(), photoBytes);
        domain.setPicture(newFileName);
        domain.setAdmin(byNick);
        domain.setUsers(new ArrayList<>());
        domain.getUsers().add(byNick);

        return groupChatDTOMapper.toDTO(groupChatService.save(domain));
    }

    @SchemaMapping(typeName = "Mutation", field = "deleteGroupChat")
    public boolean delete(@Argument Long id) {
        GroupChat byId = groupChatService.findById(id);
        if (byId == null) {
            throw new GraphQLErrorException("GroupChat not found", HttpStatus.NOT_FOUND);
        }
        byId.setDeleted((byte) 1);

        return groupChatService.update(byId);
    }

    @SchemaMapping(typeName = "Mutation", field = "updateGroupChat")
    public GroupChatOutputDTO update(@Argument Long id, @Argument GroupChatInputDTO groupChat) {
        GroupChat byId = groupChatService.findById(id);
        if (byId == null) {
            throw new GraphQLErrorException("GroupChat not found", HttpStatus.NOT_FOUND);
        }
        if (groupChat.getPictureBase64() != null && !groupChat.getPictureBase64().isEmpty()) {
            String codedPicture = groupChat.getPictureBase64();
            byte[] photoBytes = Base64.getDecoder().decode(codedPicture);
            String newFileName = storageService.save(groupChat.getName() + "_" + groupChat.getPicture(), photoBytes);
            byId.setPicture(newFileName);
        }
        if (!groupChat.getName().isEmpty()) {
            byId.setName(groupChat.getName());
        }
        if (!groupChat.getDescription().isEmpty()) {
            byId.setDescription(groupChat.getDescription());
        }
        byId.setDeleted((byte) 0);

        boolean update = groupChatService.update(byId);
        if (!update) {
            throw new GraphQLErrorException("Error updating the groupChat", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return groupChatDTOMapper.toDTO(byId);
    }

    @SchemaMapping(typeName = "Mutation", field = "addRemoveUserGroupChat")
    public GroupChatOutputDTO addRemoveUserGroupChat(@Argument Long groupId, @Argument Long userId) {
        GroupChat byId = groupChatService.findById(groupId);
        if (byId == null) {
            throw new GraphQLErrorException("GroupChat not found", HttpStatus.NOT_FOUND);
        }
        User userById = userService.findById(userId);
        if (userById == null) {
            throw new GraphQLErrorException("User not found", HttpStatus.NOT_FOUND);
        }
        if (byId.getUsers().contains(userById)) {
            byId.getUsers().remove(userById);
        } else {
            byId.getUsers().add(userById);
        }
        boolean update = groupChatService.update(byId);
        if (!update) {
            throw new GraphQLErrorException("Error updating the groupChat", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return groupChatDTOMapper.toDTO(byId);
    }

    @SchemaMapping(typeName = "Mutation", field = "addRemoveAdminGroupChat")
    public GroupChatOutputDTO addRemoveAdminGroupChat(@Argument Long groupId, @Argument Long userId) {
        GroupChat byId = groupChatService.findById(groupId);
        if (byId == null) {
            throw new GraphQLErrorException("GroupChat not found", HttpStatus.NOT_FOUND);
        }
        User userById = userService.findById(userId);
        if (userById == null) {
            throw new GraphQLErrorException("User not found", HttpStatus.NOT_FOUND);
        }
        if (byId.getAdmin().getId() == userById.getId()) {
            throw new GraphQLErrorException("User is already the admin", HttpStatus.BAD_REQUEST);
        }
        byId.setAdmin(userById);
        boolean update = groupChatService.update(byId);
        if (!update) {
            throw new GraphQLErrorException("Error updating the groupChat", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return groupChatDTOMapper.toDTO(byId);
    }
}