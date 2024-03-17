package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model;

import java.util.Date;

public class Message {

    private String author;
    private String receiver;
    private String content;
    private Date date;

    public Message() {}

    public static Message newPublic(String author, String topic, String content) {
        Message m = new Message();
        m.setAuthor(author);
        m.setContent(content);
        m.setDate(new Date());
        return m;
    }

    public static Message newPrivate(String author, String receiver, String content) {
        Message m = new Message();
        m.setAuthor(author);
        m.setReceiver(receiver);
        m.setContent(content);
        m.setDate(new Date());
        return m;
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

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
