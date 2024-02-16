package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model;

import java.util.List;

public class Component {

    private long id;

    private String description;

    private String image;

    private String name;

    private String type;

    private double price;

    private List<BuildComponent> buildsComponents;

    private Seller seller;

    private User userWhoCreated;

    public Component() {}

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Seller getSeller() {
        return seller;
    }

    public void setSeller(Seller seller) {
        this.seller = seller;
    }

    public List<BuildComponent> getBuildsComponents() {
        return buildsComponents;
    }

    public void setBuildsComponents(List<BuildComponent> buildsComponents) {
        this.buildsComponents = buildsComponents;
    }

    public User getUserWhoCreated() {
        return userWhoCreated;
    }

    public void setUserWhoCreated(User userWhoCreated) {
        this.userWhoCreated = userWhoCreated;
    }
}