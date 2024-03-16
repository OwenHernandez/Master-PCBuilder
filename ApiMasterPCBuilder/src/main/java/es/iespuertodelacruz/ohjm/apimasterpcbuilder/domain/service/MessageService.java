package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Message;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IMessageRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService implements IMessageService {

    @Autowired
    IMessageRepository repo;

    @Override
    public Message save(Message message) {
        return repo.save(message);
    }

    @Override
    public List<Message> findAll() {
        return repo.findAll();
    }

    @Override
    public Message findById(String id) {
        return repo.findById(id);
    }

    @Override
    public boolean deleteById(String id) {
        return repo.deleteById(id);
    }

    @Override
    public boolean update(Message message) {
        return repo.update(message);
    }

    @Override
    public List<Message> findByAuthor(String author) {
        return repo.findByAuthor(author);
    }

    @Override
    public List<Message> findByReceiver(String receiver) {
        return repo.findByReceiver(receiver);
    }
}