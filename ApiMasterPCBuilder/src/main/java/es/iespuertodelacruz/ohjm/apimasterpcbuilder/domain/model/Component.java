package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model;

import java.util.List;
import java.util.Objects;

public class Component {

    private long id;

    private String description;

    private String image;

    private String name;

    private String type;

    private double price;
    private double amazon_price;
    private double ebay_price;

    private List<BuildComponent> buildsComponents;
    private List<PriceHistory> priceHistories;

    private Seller seller;

    private User userWhoCreated;

    private List<User> usersWhoWants;

    public Component() {}

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Component component = (Component) o;
        return id == component.id;
    }

    public List<PriceHistory> getPriceHistories() {
        return priceHistories;
    }

    public void setPriceHistories(List<PriceHistory> priceHistories) {
        this.priceHistories = priceHistories;
    }

    public double getAmazon_price() {
        return amazon_price;
    }

    public void setAmazon_price(double amazon_price) {
        this.amazon_price = amazon_price;
    }

    public double getEbay_price() {
        return ebay_price;
    }

    public void setEbay_price(double ebay_price) {
        this.ebay_price = ebay_price;
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

    public List<User> getUsersWhoWants() {
        return usersWhoWants;
    }

    public void setUsersWhoWants(List<User> usersWhoWants) {
        this.usersWhoWants = usersWhoWants;
    }

    @Override
    public String toString() {
        return "Component{" +
                "id=" + id +
                ", description='" + description + '\'' +
                ", image='" + image + '\'' +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", price=" + price +
                ", amazon_price=" + amazon_price +
                ", ebay_price=" + ebay_price +
                ", buildsComponents=" + buildsComponents +
                ", seller=" + seller +
                ", userWhoCreated=" + userWhoCreated +
                ", usersWhoWants=" + usersWhoWants +
                '}';
    }
}
