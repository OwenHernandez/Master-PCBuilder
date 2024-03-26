package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.GroupChat;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IGroupChatService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IGroupChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupChatService implements IGroupChatService {

    @Autowired
    IGroupChatRepository repo;

    @Override
    public List<GroupChat> findAll() {
        return repo.findAll();
    }

    @Override
    public GroupChat save(GroupChat groupChat) {
        if (groupChat == null) {
            return null;
        }
        return repo.save(groupChat);
    }

    @Override
    public GroupChat findById(Long id) {
        if (id == null) {
            return null;
        }
        return repo.findById(id);
    }

    @Override
    public boolean deleteById(long id) {
        return repo.deleteById(id);
    }

    @Override
    public boolean update(GroupChat groupChat) {
        return repo.update(groupChat);
    }

    @Override
    public List<GroupChat> findByName(String name) {
        if (name == null) {
            return null;
        }
        return repo.findByName(name);
    }

    @Override
    public List<GroupChat> findByUserId(Long userId) {
        if (userId == null) {
            return null;
        }
        return repo.findByUserId(userId);
    }

    @Override
    public List<GroupChat> findByAdminId(Long adminId) {
        if (adminId == null) {
            return null;
        }
        return repo.findByAdminId(adminId);
    }
}
