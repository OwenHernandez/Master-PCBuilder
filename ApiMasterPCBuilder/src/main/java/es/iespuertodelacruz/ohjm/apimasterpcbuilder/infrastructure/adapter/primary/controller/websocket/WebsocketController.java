package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.websocket;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Message;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.MessageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.security.Principal;
import java.util.Date;

class MessageTo {
    private String author;
    private String receiver;
    private String content;
    private String topic;

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

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }
}

@Controller
@CrossOrigin
public class WebsocketController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private UserService userService;

    @Autowired
    private MessageService messageService;

    @MessageMapping("/public/{topic}")
    public void sendMessage(@DestinationVariable String topic, @Payload MessageTo chatMessage) {
        User byNick = userService.findByNick(chatMessage.getAuthor());
        if (byNick == null) {
            return;
        }
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User byNickPrincipal = userService.findByNick(username);
        if (byNickPrincipal == null) {
            return;
        }
        if (!byNickPrincipal.equals(byNick)) {
            return;
        }

        // Crear y guardar el mensaje, asegurándote de usar el tópico especificado
        Message m = Message.newPublic(chatMessage.getAuthor(), topic, chatMessage.getContent());
        messageService.save(m);

        // Enviar el mensaje al tópico especificado
        simpMessagingTemplate.convertAndSend("/topic/" + topic, chatMessage);
    }

    //Este metodo sera para enviar mensajes a los usuarios de los administradores se tiene que usar en la app admin
    @MessageMapping("/admin/message/{userId}")
    public void sendResponseToUserFromAdmin(@DestinationVariable String userNick, MessageTo response) {
        // Aquí puedes incluir la lógica para procesar el mensaje y posiblemente reenviarlo al usuario
        User byNick = userService.findByNick(userNick);
        if (byNick == null) {
            return;
        }
        Message message = Message.newPrivate("admins", userNick, response.getContent());
        messageService.save(message);

        simpMessagingTemplate.convertAndSend("/queue/replies-" + userNick, response);
    }

    //Este metodo sera para enviar mensajes a los administradores se tiene que usar en la app rn
    @MessageMapping("/message/admins")
    public void sendResponseToAdmin(@Payload MessageTo chatMessage) {
        // Aquí puedes incluir la lógica para procesar el mensaje y posiblemente reenviarlo a los administradores
        User byNick = userService.findByNick(chatMessage.getAuthor());
        if (byNick == null) {
            return;
        }
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User userByNick = userService.findByNick(username);
        if (userByNick == null) {
            return;
        }
        if (!userByNick.equals(byNick)) {
            return;
        }
        Message message = Message.newPrivate(chatMessage.getAuthor(), "admins", chatMessage.getContent());
        messageService.save(message);

        simpMessagingTemplate.convertAndSend("/topic/admins", chatMessage);
    }

    @MessageMapping("/private")
    public void sendSpecific(@Payload MessageTo msg, Principal user, @Header("simpSessionId") String sessionId) throws Exception {
        User author = userService.findByNick(msg.getAuthor());
        if (author != null) {
            String username = ((UserDetails) user).getUsername();
            User byNickPrincipal = userService.findByNick(username);
            if (byNickPrincipal != null) {
                if (byNickPrincipal.equals(author)) {
                    User receiver = userService.findByNick(msg.getReceiver());
                    if (receiver != null) {
                        Message m = Message.newPrivate(msg.getAuthor(), msg.getReceiver(), msg.getContent());

                        messageService.save(m);

                        simpMessagingTemplate.convertAndSendToUser(msg.getReceiver(), "/queue/messages", msg);
                    }
                }
            }
        }
    }
}

