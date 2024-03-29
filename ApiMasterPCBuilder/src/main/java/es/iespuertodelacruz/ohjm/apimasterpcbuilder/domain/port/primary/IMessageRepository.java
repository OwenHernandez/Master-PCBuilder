package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Message;

import java.util.List;

public interface IMessageRepository {

    Message save(Message message);

    List<Message> findAll();

    Message findById(String id);

    boolean deleteById(String id);

    boolean update(Message message);

    List<Message> findByAuthor(String author);

    List<Message> findByReceiver(String receiver);

    List<Message> findByReceiverAndAuthor(String receiver, String author);

    List<Message> findByTopic(String topic);
}
