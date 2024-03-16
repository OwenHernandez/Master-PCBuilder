package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "messages")
public class MessageDocument {

    private String author;
    private String receiver;
    private String content;

    public MessageDocument() {
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
