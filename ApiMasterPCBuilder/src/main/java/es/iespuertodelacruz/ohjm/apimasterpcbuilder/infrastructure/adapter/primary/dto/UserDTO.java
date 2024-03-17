package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto;

import java.util.List;

public class UserDTO {
    private long id;
    private String nick;
    private String email;
    private String picture;
    private List<UserDTO> friends;
    private List<ComponentOutputDTO> componentsWanted;

    public UserDTO() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNick() {
        return nick;
    }

    public void setNick(String nick) {
        this.nick = nick;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public List<UserDTO> getFriends() {
        return friends;
    }

    public void setFriends(List<UserDTO> friends) {
        this.friends = friends;
    }

    public List<ComponentOutputDTO> getComponentsWanted() {
        return componentsWanted;
    }

    public void setComponentsWanted(List<ComponentOutputDTO> componentsWanted) {
        this.componentsWanted = componentsWanted;
    }
}
