package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto;

import java.util.List;

public class PostOutputDTO {

    private long id;

    private String description;

    private String image;

    private String title;

    private long buildId;

    private long userId;

    private List<Long> usersWhoLikedIds;

    public PostOutputDTO() {}

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

    public long getBuildId() {
        return buildId;
    }

    public void setBuildId(long buildId) {
        this.buildId = buildId;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public List<Long> getUsersWhoLikedIds() {
        return usersWhoLikedIds;
    }

    public void setUsersWhoLikedIds(List<Long> usersWhoLikedIds) {
        this.usersWhoLikedIds = usersWhoLikedIds;
    }
}
