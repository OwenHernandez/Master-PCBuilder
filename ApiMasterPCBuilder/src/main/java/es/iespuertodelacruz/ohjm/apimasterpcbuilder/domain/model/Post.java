package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model;

import java.util.List;
import java.util.Objects;

public class Post {

    private long id;

    private String description;

    private String image;

    private String title;

    private Build build;

    private User user;

    private List<User> usersWhoLiked;

    private byte deleted;

    public Post() {}

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Post post = (Post) o;
        return id == post.id;
    }

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

    public byte getDeleted() {
        return deleted;
    }

    public void setDeleted(byte deleted) {
        this.deleted = deleted;
    }

    @Override
    public String toString() {
        return "Post{" +
                "id=" + id +
                ", description='" + description + '\'' +
                ", image='" + image + '\'' +
                ", title='" + title + '\'' +
                ", build=" + build +
                ", user=" + user +
                ", usersWhoLiked=" + usersWhoLiked +
                '}';
    }
}
