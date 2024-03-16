package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.websocket;

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

    public String getReceiver() {
        return receiver;
    }

    public String getContent() {
        return content;
    }
}

@Controller
@CrossOrigin
public class WebsocketController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    //@Autowired
    //private MensajeService mensajeService;

    @MessageMapping("/publicmessage")
    @SendTo("/topic/chatroom")
    public MessageTo sendMessage(@Payload MessageTo chatMessage) {
        //Mensaje m = Mensaje.newPublic(chatMessage.getAuthor(), "chatroom", chatMessage.getContent());
        //m.setFecha(new java.util.Date());
        //Mensaje save = mensajeService.save(m);
        return chatMessage;
    }

    @MessageMapping("/private")
    public void sendSpecific(@Payload MessageTo msg, Principal user, @Header("simpSessionId") String sessionId) throws Exception {
        //Mensaje m = Mensaje.newPrivado(msg.getAuthor(), msg.getReceiver(), msg.getContent());
        //m.setFecha(new java.util.Date());
        //Mensaje save = mensajeService.save(m);

        simpMessagingTemplate.convertAndSendToUser(msg.getReceiver(), "/queue/messages", msg);
    }
}

