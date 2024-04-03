package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.GroupChat;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.GroupChatEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.UserEntity;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;

public class GroupChatEntityMapper {

    private final UserEntityMapper userEntityMapper = new UserEntityMapper();

    public GroupChat toDomain(GroupChatEntity entity) {
        GroupChat groupChat = new GroupChat();
        groupChat.setId(entity.getId());
        groupChat.setName(entity.getName());
        groupChat.setDescription(entity.getDescription());
        groupChat.setPicture(entity.getPicture());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date(entity.getDateOfCreation());
        String dateStr = sdf.format(date);
        groupChat.setDateOfCreation(dateStr);
        groupChat.setAdmin(userEntityMapper.toDomain(entity.getGroupAdmin(), new HashSet<>(), new HashSet<>(), "groupChat"));
        if (entity.getUsers() != null && !entity.getUsers().isEmpty()) {
            groupChat.setUsers(new ArrayList<>());
            for (UserEntity ue : entity.getUsers()) {
                groupChat.getUsers().add(userEntityMapper.toDomain(ue, new HashSet<>(), new HashSet<>(), "groupChat"));
            }
        }
        return groupChat;
    }

    public GroupChatEntity toPersistence(GroupChat groupChat) throws ParseException {
        GroupChatEntity entity = new GroupChatEntity();
        entity.setId(groupChat.getId());
        entity.setName(groupChat.getName());
        entity.setDescription(groupChat.getDescription());
        entity.setPicture(groupChat.getPicture());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        entity.setDateOfCreation(sdf.parse(groupChat.getDateOfCreation()).getTime());
        entity.setGroupAdmin(userEntityMapper.toPersistence(groupChat.getAdmin(), new HashSet<>(), new HashSet<>(), "groupChat"));
        if (groupChat.getUsers() != null && !groupChat.getUsers().isEmpty()) {
            entity.setUsers(new ArrayList<>());
            for (User u : groupChat.getUsers()) {
                entity.getUsers().add(userEntityMapper.toPersistence(u, new HashSet<>(), new HashSet<>(), "groupChat"));
            }
        }
        return entity;
    }
}
