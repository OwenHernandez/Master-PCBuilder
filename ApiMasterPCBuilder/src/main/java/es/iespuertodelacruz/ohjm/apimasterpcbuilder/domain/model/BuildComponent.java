package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model;

public class BuildComponent {

    private long id;

    private String dateCreated;

    private double priceAtTheTime;

    private Build build;

    private Component component;

    public BuildComponent() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public Build getBuild() {
        return build;
    }

    public void setBuild(Build build) {
        this.build = build;
    }

    public Component getComponent() {
        return component;
    }

    @Override
    public String toString() {
        return "BuildComponent{" +
                "id=" + id +
                ", dateCreated='" + dateCreated + '\'' +
                ", priceAtTheTime=" + priceAtTheTime +
                //", build=" + build +
                ", component=" + component +
                '}';
    }

    public void setComponent(Component component) {
        this.component = component;
    }
}
