package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.websocket;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Message;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.MessageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
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
    private UserService userService;

    @Autowired
    private MessageService messageService;

    @MessageMapping("/publicMessage")
    @SendTo("/topic/general")
    public MessageTo sendMessage(@Payload MessageTo chatMessage) {
        User byNick = userService.findByNick(chatMessage.getAuthor());
        if (byNick == null) {
            return null;
        }
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User byNickPrincipal = userService.findByNick(username);
        if (byNickPrincipal == null) {
            return null;
        }
        if (!byNickPrincipal.equals(byNick)) {
            return null;
        }
        Message m = Message.newPublic(chatMessage.getAuthor(), "general", chatMessage.getContent());
        messageService.save(m);
        return chatMessage;
    }

    @MessageMapping("/private")
    public void sendSpecific(@Payload MessageTo msg, Principal user, @Header("simpSessionId") String sessionId) throws Exception {
        User author = userService.findByNick(msg.getAuthor());
        if (author != null) {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = ((UserDetails) principal).getUsername();
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

