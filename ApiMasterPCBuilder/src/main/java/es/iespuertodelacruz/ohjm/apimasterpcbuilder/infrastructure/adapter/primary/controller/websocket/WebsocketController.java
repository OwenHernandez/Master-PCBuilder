package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.websocket;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Message;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.security.Principal;

class MessageTo {
    private String author;
    private String receiver;
    private String content;

    public MessageTo() {
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}

@Controller
@CrossOrigin
public class WebsocketController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private MessageService messageService;

    @MessageMapping("/publicMessage")
    @SendTo("/topic/general")
    public MessageTo sendMessage(@Payload MessageTo chatMessage) {
        Message m = Message.newPublic(chatMessage.getAuthor(), "general", chatMessage.getContent());
        messageService.save(m);
        return chatMessage;
    }

    @MessageMapping("/private")
    public void sendSpecific(@Payload MessageTo msg, Principal user, @Header("simpSessionId") String sessionId) throws Exception {
        Message m = Message.newPrivate(msg.getAuthor(), msg.getReceiver(), msg.getContent());
        messageService.save(m);

        simpMessagingTemplate.convertAndSendToUser(msg.getReceiver(), "/queue/messages", msg);
    }
}

