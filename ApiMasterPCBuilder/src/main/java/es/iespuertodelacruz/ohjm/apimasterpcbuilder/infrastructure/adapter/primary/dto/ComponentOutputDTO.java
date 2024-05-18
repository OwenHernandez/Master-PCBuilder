package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.PriceHistory;

import java.util.List;

public class ComponentOutputDTO {

    private long id;

    private String description;

    private String image;

    private String name;

    private String type;

    private double price;
    private double amazon_price;
    private double ebay_price;
    private boolean deleted;

    private String sellerName;

    private String userNick;
    private List<PriceHistory> priceHistory;
    public ComponentOutputDTO() {}

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public List<PriceHistory> getPriceHistory() {
        return priceHistory;
    }

    public void setPriceHistory(List<PriceHistory> priceHistory) {
        this.priceHistory = priceHistory;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUserNick() {
        return userNick;
    }

    public void setUserNick(String userNick) {
        this.userNick = userNick;
    }

    public String getDescription() {
        return description;
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

    public String getSellerName() {
        return sellerName;
    }

    public void setSellerName(String sellerName) {
        this.sellerName = sellerName;
    }
}
