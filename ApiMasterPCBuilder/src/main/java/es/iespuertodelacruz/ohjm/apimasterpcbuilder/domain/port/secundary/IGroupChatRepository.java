package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.GroupChat;

import java.util.List;

public interface IGroupChatRepository {

    List<GroupChat> findAll();

    GroupChat save(GroupChat groupChat);

    GroupChat findById(Long id);

    boolean deleteById(long id);

    boolean update(GroupChat groupChat);

    List<GroupChat> findByName(String name);

    List<GroupChat> findByUserId(Long userId);
    List<GroupChat> findByAdminId(Long adminId);
}
