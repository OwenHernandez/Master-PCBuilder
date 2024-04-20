package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.GroupChat;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IGroupChatRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.GroupChatEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.GroupChatEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IGroupChatEntityRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IMessageDocumentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class GroupChatEntityService implements IGroupChatRepository {

    @Autowired
    IGroupChatEntityRepository repo;

    @Autowired
    private IMessageDocumentRepository messageRepo;

    private final GroupChatEntityMapper mapper = new GroupChatEntityMapper();

    @Override
    @Transactional
    public List<GroupChat> findAll() {
        List<GroupChat> res = new ArrayList<>();
        repo.findAll().forEach(groupChatEntity -> res.add(mapper.toDomain(groupChatEntity)));
        return res;
    }

    @Override
    @Transactional
    public GroupChat save(GroupChat groupChat) {
        try {
            return mapper.toDomain(repo.save(mapper.toPersistence(groupChat)));
        } catch (ParseException e) {
            return null;
        }
    }

    @Override
    @Transactional
    public GroupChat findById(Long id) {
        Optional<GroupChatEntity> byId = repo.findById(id);
        return byId.map(mapper::toDomain).orElse(null);
    }

    @Override
    @Transactional
    public boolean deleteById(long id) {
        if (!repo.existsById(id)) {
            return false;
        }
        messageRepo.deleteByTopic("groupChat" + id);
        repo.deleteById(id);
        return true;
    }

    @Override
    @Transactional
    public boolean update(GroupChat groupChat) {
        try {
            if (!repo.existsById(groupChat.getId())) {
                return false;
            }
            repo.save(mapper.toPersistence(groupChat));
            return true;
        } catch (ParseException e) {
            return false;
        }
    }

    @Override
    @Transactional
    public List<GroupChat> findByName(String name) {
        if (name == null) {
            return null;
        }
        List<GroupChatEntity> byName = repo.findByName(name);
        if (byName != null) {
            List<GroupChat> res = new ArrayList<>();
            byName.forEach(postEntity -> res.add(mapper.toDomain(postEntity)));
            return res;
        } else {
            return null;
        }
    }

    @Override
    @Transactional
    public List<GroupChat> findByUserId(Long userId) {
        if (userId == null) {
            return null;
        }
        List<GroupChatEntity> byUserId = repo.findByUserId(userId);
        if (byUserId != null) {
            List<GroupChat> res = new ArrayList<>();
            byUserId.forEach(postEntity -> res.add(mapper.toDomain(postEntity)));
            return res;
        } else {
            return null;
        }
    }

    @Override
    @Transactional
    public List<GroupChat> findByAdminId(Long adminId) {
        if (adminId == null) {
            return null;
        }
        List<GroupChatEntity> byAdminId = repo.findByAdminId(adminId);
        if (byAdminId != null) {
            List<GroupChat> res = new ArrayList<>();
            byAdminId.forEach(postEntity -> res.add(mapper.toDomain(postEntity)));
            return res;
        } else {
            return null;
        }
    }
}
