package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Message;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/v2/messages")
public class MessageRestControllerV2 {

    @Autowired
    private MessageService messageService;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String receiver, @RequestParam(required = false) String author) {
        if (receiver != null && author != null) {
            List<Message> byReceiverAndAuthor = messageService.findByReceiverAndAuthor(receiver, author);
            return ResponseEntity.ok(byReceiverAndAuthor);
        } else if (receiver != null) {
            List<Message> byReceiver = messageService.findByReceiver(receiver);
            return ResponseEntity.ok(byReceiver);
        } else if (author != null) {
            List<Message> byAuthor = messageService.findByAuthor(author);
            return ResponseEntity.ok(byAuthor);
        }
        List<Message> all = messageService.findAll();
        return ResponseEntity.ok(all);
    }
}
