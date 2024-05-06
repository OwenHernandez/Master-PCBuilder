package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto;

public class ProductAmazonDTO {
    private String title;
    private String url;
    private String price;
    private String rating;
    private String reviews;
    private String search_url;

    public ProductAmazonDTO() {
    }

    public ProductAmazonDTO(String tile, String url, String price, String rating, String reviews, String search_url) {
        this.title = tile;
        this.url = url;
        this.price = price;
        this.rating = rating;
        this.reviews = reviews;
        this.search_url = search_url;
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

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getReviews() {
        return reviews;
    }

    public void setReviews(String reviews) {
        this.reviews = reviews;
    }

    public String getSearch_url() {
        return search_url;
    }

    public void setSearch_url(String search_url) {
        this.search_url = search_url;
    }

    @Override
    public String toString() {
        return "ProductAmazonDTO{" +
                "title='" + title + '\'' +
                ", url='" + url + '\'' +
                ", price='" + price + '\'' +
                ", rating='" + rating + '\'' +
                ", reviews='" + reviews + '\'' +
                ", search_url='" + search_url + '\'' +
                '}';
    }
}
