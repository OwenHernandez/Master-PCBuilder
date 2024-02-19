package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model;

import java.util.List;

public class User {
    private long id;

    private byte active;

    private String email;

    private String hash;

    private String nick;

    private String password;

    private String picture;

    private String role;

    private List<User> friends;

    private List<Component> componentsCreated;

    private List<Post> postsMade;

    private List<Post> likedPosts;

    public User() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public byte getActive() {
        return active;
    }

    public void setActive(byte active) {
        this.active = active;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public String getNick() {
        return nick;
    }

    public void setNick(String nick) {
        this.nick = nick;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<User> getFriends() {
        return friends;
    }

    public void setFriends(List<User> friends) {
        this.friends = friends;
    }

    public List<Component> getComponentsCreated() {
        return componentsCreated;
    }

    public void setComponentsCreated(List<Component> componentsCreated) {
        this.componentsCreated = componentsCreated;
    }

    public List<Post> getPostsMade() {
        return postsMade;
    }

    public void setPostsMade(List<Post> postsMade) {
        this.postsMade = postsMade;
    }

    public List<Post> getLikedPosts() {
        return likedPosts;
    }

    public void setLikedPosts(List<Post> likedPosts) {
        this.likedPosts = likedPosts;
    }
}
