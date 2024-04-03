package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model;

import java.math.BigInteger;
import java.util.List;

public class Build {

    private long id;

    private String name;

    private String notes;

    private String category;
    private String dateOfCreation;

    private double totalPrice;

    private User user;

    private List<BuildComponent> buildsComponents;

    //private List<Post> post;

    public Build() {}

    public String getDateOfCreation() {
        return dateOfCreation;
    }

    public void setDateOfCreation(String dateOfCreation) {
        this.dateOfCreation = dateOfCreation;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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

    @Override
    public String toString() {
        return "Build{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", notes='" + notes + '\'' +
                ", category='" + category + '\'' +
                ", totalPrice=" + totalPrice +
                ", user=" + user.toString() +
                ", buildsComponents=" + buildsComponents +
                '}';
    }
}
