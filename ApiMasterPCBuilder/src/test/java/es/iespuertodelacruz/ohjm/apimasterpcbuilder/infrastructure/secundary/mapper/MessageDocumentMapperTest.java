package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Message;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.MessageDocumentMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.MessageDocument;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.text.ParseException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
public class MessageDocumentMapperTest {

    private final MessageDocumentMapper messageDocumentMapper = new MessageDocumentMapper();

    @Test
    public void toDomain_ok_test() {
        MessageDocument messageDocument = new MessageDocument();
        messageDocument.setAuthor("author");
        messageDocument.setReceiver("receiver");
        messageDocument.setContent("content");
        messageDocument.setTopic("topic");
        messageDocument.setDate(99996400000L); // 1973-03-03 09:46:40

        Message domain = messageDocumentMapper.toDomain(messageDocument);

        assertEquals(messageDocument.getAuthor(), domain.getAuthor());
        assertEquals(messageDocument.getReceiver(), domain.getReceiver());
        assertEquals(messageDocument.getContent(), domain.getContent());
        assertEquals(messageDocument.getTopic(), domain.getTopic());
        assertEquals("1973-03-03 08:46:40", domain.getDate());
    }

    @Test
    public void toPersistence_ok_test() throws ParseException {
        Message message = new Message();
        message.setAuthor("author");
        message.setReceiver("receiver");
        message.setContent("content");
        message.setTopic("topic");
        message.setDate("1973-03-03 09:46:40");

        MessageDocument document = messageDocumentMapper.toPersistence(message);

        assertEquals(message.getAuthor(), document.getAuthor());
        assertEquals(message.getReceiver(), document.getReceiver());
        assertEquals(message.getContent(), document.getContent());
        assertEquals(message.getTopic(), document.getTopic());
        assertEquals(100000000000L, document.getDate());
    }

    @Test
    public void toPersistence_nullDate_test() {
        Message message = new Message();
        message.setAuthor("author");
        message.setReceiver("receiver");
        message.setContent("content");
        message.setTopic("topic");

        assertThrows(NullPointerException.class, () -> messageDocumentMapper.toPersistence(message));
    }

    @Test
    public void toPersistence_wrongDate_test() {
        Message message = new Message();
        message.setAuthor("author");
        message.setReceiver("receiver");
        message.setContent("content");
        message.setTopic("topic");
        message.setDate(".-gdgruh698345");

        assertThrows(ParseException.class, () -> messageDocumentMapper.toPersistence(message));
    }
}
