package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto;

public class ProductEbayDTO {
    private String title;
    private String url;
    private String price;
    private String details;
    private String sellerInfo;
    private String shippingCost;
    private String location;
    private String sold;

    public ProductEbayDTO() {
    }

    public ProductEbayDTO(String title, String url, String price, String details, String sellerInfo, String shippingCost, String location, String sold) {
        this.title = title;
        this.url = url;
        this.price = price;
        this.details = details;
        this.sellerInfo = sellerInfo;
        this.shippingCost = shippingCost;
        this.location = location;
        this.sold = sold;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getSellerInfo() {
        return sellerInfo;
    }

    public void setSellerInfo(String sellerInfo) {
        this.sellerInfo = sellerInfo;
    }

    public String getShippingCost() {
        return shippingCost;
    }

    public void setShippingCost(String shippingCost) {
        this.shippingCost = shippingCost;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSold() {
        return sold;
    }

    public void setSold(String sold) {
        this.sold = sold;
    }
}
