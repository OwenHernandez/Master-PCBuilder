package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v3;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Message;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IMessageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.exception.GraphQLErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class MessageControllerV3 {

    @Autowired
    private IMessageService messageService;

    @SchemaMapping(typeName = "Query", field = "messages")
    public List<Message> getMessages() {
        return messageService.findAll();
    }

    @SchemaMapping(typeName = "Query", field = "message")
    public Message getMessage(@Argument String id) {
        return messageService.findById(id);
    }

    @SchemaMapping(typeName = "Query", field = "byTopic")
    public List<Message> getByTopic(@Argument String topic) {
        return messageService.findByTopic(topic);
    }

    @SchemaMapping(typeName = "Query", field = "byReceiverAndAuthor")
    public List<Message> getByReceiverAndAuthor(@Argument String author, @Argument String receiver) {
        return messageService.findByReceiverAndAuthor(receiver, author);
    }

    @SchemaMapping(typeName = "Mutation", field = "deleteMessage")
    public boolean delete(@Argument String id) {
        Message byId = messageService.findById(id);
        if (byId == null) {
            throw new GraphQLErrorException("Message not found", HttpStatus.NOT_FOUND);
        }
        return messageService.deleteById(id);
    }
}
