package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.GroupChat;

import java.util.List;

public interface IGroupChatService {

    List<GroupChat> findAll();

    GroupChat save(GroupChat groupChat);

    GroupChat findById(Long id);

    boolean deleteById(long id);

    boolean update(GroupChat groupChat);

    List<GroupChat> findByName(String name);

    List<GroupChat> findByUserId(Long userId);

    List<GroupChat> findByAdminId(Long adminId);
}
