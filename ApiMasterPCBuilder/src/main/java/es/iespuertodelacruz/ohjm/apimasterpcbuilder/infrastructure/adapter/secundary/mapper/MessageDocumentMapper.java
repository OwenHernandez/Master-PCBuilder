package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Message;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.MessageDocument;

public class MessageDocumentMapper {

    public Message toDomain(MessageDocument messageDocument) {
        Message message = new Message();
        message.setAuthor(messageDocument.getAuthor());
        message.setReceiver(messageDocument.getReceiver());
        message.setContent(messageDocument.getContent());
        return message;
    }

    public MessageDocument toPersistance(Message message) {
        MessageDocument messageDocument = new MessageDocument();
        messageDocument.setAuthor(message.getAuthor());
        messageDocument.setReceiver(message.getReceiver());
        messageDocument.setContent(message.getContent());
        return messageDocument;
    }
}
