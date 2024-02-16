package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model;

import java.util.List;

public class Build {

    private long id;

    private String name;

    private String notes;

    private double totalPrice;

    private User user;

    private List<BuildComponent> buildsComponents;

    //private List<Post> post;

    public Build() {}

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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<BuildComponent> getBuildsComponents() {
        return buildsComponents;
    }

    public void setBuildsComponents(List<BuildComponent> buildsComponents) {
        this.buildsComponents = buildsComponents;
    }
}