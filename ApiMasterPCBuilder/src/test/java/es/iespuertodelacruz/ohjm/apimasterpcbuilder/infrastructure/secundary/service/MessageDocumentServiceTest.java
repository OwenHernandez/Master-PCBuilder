package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Message;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.MessageDocumentMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.MessageDocument;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IMessageDocumentRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service.MessageDocumentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
public class MessageDocumentServiceTest {
    @InjectMocks
    private MessageDocumentService messageDocumentService;

    @Mock
    private MessageDocumentMapper messageDocumentMapper;

    @Mock
    private IMessageDocumentRepository messageDocumentRepository;

    @BeforeEach
    public void init() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSave() throws ParseException {
        // Datos de entrada
        Message message = new Message();
        message.setAuthor("testAuthor");
        message.setReceiver("testReceiver");
        message.setContent("testContent");
        message.setTopic("testTopic");
        message.setDate("2022-01-01 00:00:00");

        // Configuración del objeto de dominio retornado por el mapper
        MessageDocument messageDocument = new MessageDocument();
        messageDocument.setAuthor(message.getAuthor());
        messageDocument.setReceiver(message.getReceiver());
        messageDocument.setContent(message.getContent());
        messageDocument.setTopic(message.getTopic());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = sdf.parse(message.getDate());
        messageDocument.setDate(date.getTime());

        // Configuración de los mocks
        when(messageDocumentMapper.toPersistence(any(Message.class))).thenReturn(messageDocument);
        when(messageDocumentRepository.save(any(MessageDocument.class))).thenReturn(messageDocument);
        when(messageDocumentMapper.toDomain(any(MessageDocument.class))).thenReturn(message);

        // Ejecución del método bajo prueba
        Message savedMessage = messageDocumentService.save(message);

        // Verificaciones
        assertNotNull(savedMessage, "El mensaje guardado no debe ser nulo");
        verify(messageDocumentRepository).save(any(MessageDocument.class));
        verify(messageDocumentRepository).save(messageDocument); // Verifica que se guarda el documento
        verify(messageDocumentMapper).toPersistence(message);     // Verifica la transformación a persistencia
        verify(messageDocumentMapper).toDomain(messageDocument);  // Verifica la transformación a dominio
    }


}
