package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.MessageDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface IMessageDocumentRepository extends MongoRepository<MessageDocument, String> {

    List<MessageDocument> findByAuthor(String author);

    List<MessageDocument> findByReceiver(String receiver);

    List<MessageDocument> findByReceiverAndAuthor(String receiver, String author);
}
