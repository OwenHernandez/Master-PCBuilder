package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

public class Message {
    private String id;
    private String author;
    private String receiver;
    private String content;
    private String topic;
    private String date;

    public Message() {}

    public static Message newPublic(String author, String topic, String content) {
        Message m = new Message();
        m.setAuthor(author);
        m.setContent(content);
        m.setTopic(topic);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        sdf.setTimeZone(TimeZone.getTimeZone("Europe/London"));
        m.setDate(sdf.format(new Date()));

        return m;
    }

    public static Message newPrivate(String author, String receiver, String content) {
        Message m = new Message();
        m.setAuthor(author);
        m.setReceiver(receiver);
        m.setContent(content);
        m.setTopic("private");
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        sdf.setTimeZone(TimeZone.getTimeZone("Europe/London"));
        m.setDate(sdf.format(new Date()));

        return m;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
