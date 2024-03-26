package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.GroupChat;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.GroupChatInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.GroupChatOutputDTO;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class GroupChatDTOMapper {

    private final UserDTOMapper userDTOMapper = new UserDTOMapper();

    public GroupChat toDomain(GroupChatInputDTO groupChatInputDTO) {
        GroupChat groupChat = new GroupChat();
        groupChat.setName(groupChatInputDTO.getName());
        groupChat.setDescription(groupChatInputDTO.getDescription());
        groupChat.setPicture(groupChatInputDTO.getPicture());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date();
        String dateStr = sdf.format(date);
        groupChat.setDateOfCreation(dateStr);

        return groupChat;
    }

    public GroupChatOutputDTO toDTO(GroupChat groupChat) {
        GroupChatOutputDTO groupChatOutputDTO = new GroupChatOutputDTO();
        groupChatOutputDTO.setId(groupChat.getId());
        groupChatOutputDTO.setName(groupChat.getName());
        groupChatOutputDTO.setDescription(groupChat.getDescription());
        groupChatOutputDTO.setPicture(groupChat.getPicture());
        groupChatOutputDTO.setDateOfCreation(groupChat.getDateOfCreation());
        groupChatOutputDTO.setAdmin(userDTOMapper.toDTO(groupChat.getAdmin()));
        if (groupChat.getUsers() != null) {
            groupChatOutputDTO.setUsers(groupChat.getUsers().stream().map(userDTOMapper::toDTO).collect(Collectors.toList()));
        }
        return groupChatOutputDTO;
    }
}
