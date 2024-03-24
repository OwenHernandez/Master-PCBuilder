package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto;

public class ComponentInputDTO {
    private String description;

    private String image;

    private String image64;

    private String name;

    private String type;

    private double price;
    private double amazon_price;
    private double ebay_price;

    private String sellerName;

    public ComponentInputDTO() {
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getImage64() {
        return image64;
    }

    public void setImage64(String image64) {
        this.image64 = image64;
    }
}
