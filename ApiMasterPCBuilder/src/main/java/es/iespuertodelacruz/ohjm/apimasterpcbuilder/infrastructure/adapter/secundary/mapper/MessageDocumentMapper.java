package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Message;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.MessageDocument;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class MessageDocumentMapper {

    public Message toDomain(MessageDocument messageDocument) {
        Message message = new Message();
        message.setAuthor(messageDocument.getAuthor());
        message.setReceiver(messageDocument.getReceiver());
        message.setContent(messageDocument.getContent());
        message.setTopic(messageDocument.getTopic());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        message.setDate(sdf.format(new Date(messageDocument.getDate())));
        return message;
    }

    public MessageDocument toPersistence(Message message) throws ParseException {
        MessageDocument messageDocument = new MessageDocument();
        messageDocument.setAuthor(message.getAuthor());
        messageDocument.setReceiver(message.getReceiver());
        messageDocument.setContent(message.getContent());
        messageDocument.setTopic(message.getTopic());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date parse = sdf.parse(message.getDate());
        messageDocument.setDate(parse.getTime());
        return messageDocument;
    }
}
