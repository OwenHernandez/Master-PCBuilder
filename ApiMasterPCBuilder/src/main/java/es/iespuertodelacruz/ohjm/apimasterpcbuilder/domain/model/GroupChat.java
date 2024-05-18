package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model;

import java.util.List;

public class GroupChat {

    private long id;

    private String name;

    private String description;

    private String picture;

    private String dateOfCreation;

    private User admin;

    private List<User> users;

    private byte deleted;

    public GroupChat() {}

    public GroupChat(long id, String name, String description, String picture, String dateOfCreation, User admin, List<User> users, byte deleted) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.picture = picture;
        this.dateOfCreation = dateOfCreation;
        this.admin = admin;
        this.users = users;
        this.deleted = deleted;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public String getDateOfCreation() {
        return dateOfCreation;
    }

    public void setDateOfCreation(String dateOfCreation) {
        this.dateOfCreation = dateOfCreation;
    }

    public User getAdmin() {
        return admin;
    }

    public void setAdmin(User admin) {
        this.admin = admin;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public byte getDeleted() {
        return deleted;
    }

    public void setDeleted(byte deleted) {
        this.deleted = deleted;
    }
}
