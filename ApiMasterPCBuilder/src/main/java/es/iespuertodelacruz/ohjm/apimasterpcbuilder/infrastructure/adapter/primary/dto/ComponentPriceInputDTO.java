package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto;

public class ComponentPriceInputDTO {
    private String description;

    private String name;
    private double amazon_price;
    private double ebay_price;

    public ComponentPriceInputDTO() {
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    @Override
    public String toString() {
        return "ComponentPriceInputDTO{" +
                "description='" + description + '\'' +
                ", name='" + name + '\'' +
                ", amazon_price=" + amazon_price +
                ", ebay_price=" + ebay_price +
                '}';
    }
}
