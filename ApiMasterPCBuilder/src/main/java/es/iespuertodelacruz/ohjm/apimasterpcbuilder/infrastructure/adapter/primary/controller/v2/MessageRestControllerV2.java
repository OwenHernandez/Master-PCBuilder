package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Message;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IMessageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.MessageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/v2/messages")
public class MessageRestControllerV2 {

    @Autowired
    private IMessageService messageService;

    @Autowired
    private IUserService userService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String receiver, @RequestParam(required = false) String author, @RequestParam(required = false) String topic) {
        Object principal =
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User userByNick = userService.findByNick(username);
        if (userByNick == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You must be logged in to see your messages");
        }
        if (receiver != null && author != null) {
            if (userByNick.getNick().equals(receiver) || userByNick.getNick().equals(author)) {
                List<Message> byReceiverAndAuthor = messageService.findByReceiverAndAuthor(receiver, author);
                return ResponseEntity.ok(byReceiverAndAuthor);
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only see your messages");
        } else if (topic != null) {
            List<Message> byTopic = messageService.findByTopic(topic);
            return ResponseEntity.ok(byTopic);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You must provide a receiver and an author or a topic");
    }
}
