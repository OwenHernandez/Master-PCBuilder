package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Message;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service.MessageDocumentService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@DataMongoTest
@ExtendWith(SpringExtension.class)
@Import(MessageDocumentService.class)
public class MessageDocumentServiceTest {

    @Autowired
    private MessageDocumentService service;

    @Container
    public static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:4.4.6");

    @DynamicPropertySource
    static void setApplicationProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
    }

    private static boolean dataInitialized = false;

    @BeforeEach
    void setUp() {
        if (!dataInitialized) {
            Message message1 = new Message();
            message1.setAuthor("Author1");
            message1.setReceiver("Receiver1");
            message1.setContent("Hello, this is a test message");
            message1.setDate("2021-10-10 10:10:10");
            message1.setTopic("Test topic");

            Message message2 = new Message();
            message2.setAuthor("Author2");
            message2.setReceiver("Receiver2");
            message2.setContent("Another test message");
            message2.setDate("2022-01-01 12:00:00");

            service.save(message1);
            service.save(message2);
            dataInitialized = true;
        }
    }

    @Test
    void testSave() {
        Message message = new Message();
        message.setContent("Hello, world!");
        message.setAuthor("testAuthor");
        message.setReceiver("testReceiver");
        message.setDate("2021-10-10 10:10:10");

        Message savedMessage = service.save(message);
        assertNotNull(savedMessage);
        assertEquals(message.getContent(), savedMessage.getContent());
        assertEquals(message.getAuthor(), savedMessage.getAuthor());
        assertEquals(message.getReceiver(), savedMessage.getReceiver());
        assertEquals(message.getDate(), savedMessage.getDate());
    }

    @Test
    void testFindAll() {
        List<Message> messages = service.findAll();
        assertFalse(messages.isEmpty());
        assertEquals(2, messages.size());
    }

    @Test
    void testFindById() {
        List<Message> messages = service.findAll();
        Message message = messages.get(0);
        Message foundMessage = service.findById(message.getId());
        assertNotNull(foundMessage);
        assertEquals(message.getId(), foundMessage.getId());
        assertEquals(message.getContent(), foundMessage.getContent());
        assertEquals(message.getAuthor(), foundMessage.getAuthor());
        assertEquals(message.getReceiver(), foundMessage.getReceiver());
        assertEquals(message.getDate(), foundMessage.getDate());
    }

    @Test
    void testDeleteById() {
        List<Message> messages = service.findAll();
        Message message = messages.get(0);
        boolean result = service.deleteById(message.getId());
        assertTrue(result);
        assertNull(service.findById(message.getId()));
    }

    @Test
    void testUpdate() {
        List<Message> messages = service.findAll();
        Message message = messages.get(0);
        message.setContent("Updated content");
        message.setAuthor("Updated author");
        message.setReceiver("Updated receiver");
        message.setDate("2022-02-02 20:20:20");

        boolean result = service.update(message);
        assertTrue(result);

        Message updatedMessage = service.findById(message.getId());
        assertNotNull(updatedMessage);
        assertEquals(message.getId(), updatedMessage.getId());
        assertEquals(message.getContent(), updatedMessage.getContent());
        assertEquals(message.getAuthor(), updatedMessage.getAuthor());
        assertEquals(message.getReceiver(), updatedMessage.getReceiver());
        assertEquals(message.getDate(), updatedMessage.getDate());
    }

    @Test
    void testFindByAuthor() {
        List<Message> messages = service.findByAuthor("Author1");
        assertFalse(messages.isEmpty());
        assertEquals(1, messages.size());
        assertEquals("Author1", messages.get(0).getAuthor());
    }

    @Test
    void testFindByReceiver() {
        List<Message> messages = service.findByReceiver("Receiver2");
        assertFalse(messages.isEmpty());
        assertEquals(1, messages.size());
        assertEquals("Receiver2", messages.get(0).getReceiver());
    }

    @Test
    void testFindByReceiverAndAuthor() {
        List<Message> messages = service.findByReceiverAndAuthor("Receiver1", "Author1");
        assertFalse(messages.isEmpty());
        assertEquals(1, messages.size());
        assertEquals("Author1", messages.get(0).getAuthor());
        assertEquals("Receiver1", messages.get(0).getReceiver());
    }

    @Test
    void testFindByTopic() {
        List<Message> messages = service.findByTopic("Test topic");
        assertFalse(messages.isEmpty());
        assertEquals(1, messages.size());
        assertEquals("Test topic", messages.get(0).getTopic());
    }
}