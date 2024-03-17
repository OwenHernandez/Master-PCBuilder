package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto;

public class BuildComponentDTO {
    private String dateCreated;

    private double priceAtTheTime;

    private ComponentOutputDTO component;

    public BuildComponentDTO() {
    }

    public String getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(String dateCreated) {
        this.dateCreated = dateCreated;
    }

    public double getPriceAtTheTime() {
        return priceAtTheTime;
    }

    public void setPriceAtTheTime(double priceAtTheTime) {
        this.priceAtTheTime = priceAtTheTime;
    }

    public ComponentOutputDTO getComponent() {
        return component;
    }

    public void setComponent(ComponentOutputDTO component) {
        this.component = component;
    }
}
