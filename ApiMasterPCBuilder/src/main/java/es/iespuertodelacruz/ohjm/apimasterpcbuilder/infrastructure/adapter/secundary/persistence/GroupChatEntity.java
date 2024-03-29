package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "GROUP_CHATS")
@NamedQuery(name="GroupChatEntity.findAll", query="SELECT gc FROM GroupChatEntity gc")
public class GroupChatEntity {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private long id;

    private String name;

    private String description;

    private String picture;

    @Column(name="DATE_OF_CREATION")
    private Long dateOfCreation;

    @ManyToOne
    @JoinColumn(name="GROUP_ADMIN_ID")
    private UserEntity groupAdmin;

    @ManyToMany
    @JoinTable(
            name = "GROUP_CHATS_USERS",
            joinColumns = @JoinColumn(name = "GROUP_CHAT_ID"),
            inverseJoinColumns = @JoinColumn(name = "USER_ID")
    )
    private List<UserEntity> users;

    public GroupChatEntity() {
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

    public Long getDateOfCreation() {
        return dateOfCreation;
    }

    public void setDateOfCreation(Long dateOfCreation) {
        this.dateOfCreation = dateOfCreation;
    }

    public UserEntity getGroupAdmin() {
        return groupAdmin;
    }

    public void setGroupAdmin(UserEntity admin) {
        this.groupAdmin = admin;
    }

    public List<UserEntity> getUsers() {
        return users;
    }

    public void setUsers(List<UserEntity> users) {
        this.users = users;
    }
}
