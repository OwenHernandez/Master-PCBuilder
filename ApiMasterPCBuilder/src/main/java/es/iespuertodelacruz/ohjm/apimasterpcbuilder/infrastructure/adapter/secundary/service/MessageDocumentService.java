package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Message;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IMessageRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.MessageDocumentMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.MessageDocument;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IMessageDocumentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MessageDocumentService implements IMessageRepository {

    @Autowired
    private IMessageDocumentRepository repo;

    private final MessageDocumentMapper mapper = new MessageDocumentMapper();

    @Override
    @Transactional
    public List<Message> findAll() {
        List<MessageDocument> all = repo.findAll();
        List<Message> res = new ArrayList<>();

        for (MessageDocument me : all) {
            Message message = mapper.toDomain(me);
            res.add(message);
        }

        return res;
    }

    @Override
    @Transactional
    public Message save(Message message) {
        try {
            if (message != null) {
                MessageDocument messageDocument = mapper.toPersistance(message);
                MessageDocument save = repo.save(messageDocument);
                return mapper.toDomain(save);
            }
            return null;
        } catch (RuntimeException | ParseException e) {
            return null;
        }
    }

    @Override
    @Transactional
    public Message findById(String id) {
        Message res = null;
        if (id != null) {
            Optional<MessageDocument> opt = repo.findById(id);
            if (opt.isPresent()) {
                MessageDocument messageDocument = opt.get();
                res = mapper.toDomain(messageDocument);
            }
        }
        return res;
    }

    @Override
    @Transactional
    public boolean deleteById(String id) {
        try {
            repo.deleteById(id);
            return true;
        } catch (RuntimeException e) {
            return false;
        }
    }

    @Override
    @Transactional
    public boolean update(Message message) {
        try {
            MessageDocument messageDocument = mapper.toPersistance(message);
            repo.save(messageDocument);

            return true;
        } catch (RuntimeException | ParseException e) {
            return false;
        }
    }

    @Override
    @Transactional
    public List<Message> findByAuthor(String author) {
        List<MessageDocument> byAuthor = repo.findByAuthor(author);
        List<Message> res = new ArrayList<>();

        for (MessageDocument me : byAuthor) {
            Message message = mapper.toDomain(me);
            res.add(message);
        }

        return res;
    }

    @Override
    @Transactional
    public List<Message> findByReceiver(String receiver) {
        List<MessageDocument> byReceiver = repo.findByReceiver(receiver);
        List<Message> res = new ArrayList<>();

        for (MessageDocument me : byReceiver) {
            Message message = mapper.toDomain(me);
            res.add(message);
        }

        return res;
    }

    @Override
    @Transactional
    public List<Message> findByReceiverAndAuthor(String receiver, String author) {
        List<MessageDocument> byReceiverAndAuthor = repo.findByReceiverAndAuthor(receiver, author);
        List<Message> res = new ArrayList<>();

        for (MessageDocument me : byReceiverAndAuthor) {
            Message message = mapper.toDomain(me);
            res.add(message);
        }

        return res;
    }
}
