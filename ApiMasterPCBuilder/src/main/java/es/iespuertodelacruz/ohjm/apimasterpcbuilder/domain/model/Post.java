package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model;

import java.util.List;

public class Post {

    private long id;

    private String description;

    private String image;

    private String title;

    private Build build;

    private User user;

    private List<User> usersWhoLiked;

    public Post() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Build getBuild() {
        return build;
    }

    public void setBuild(Build build) {
        this.build = build;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<User> getUsersWhoLiked() {
        return usersWhoLiked;
    }

    public void setUsersWhoLiked(List<User> usersWhoLiked) {
        this.usersWhoLiked = usersWhoLiked;
    }
}
