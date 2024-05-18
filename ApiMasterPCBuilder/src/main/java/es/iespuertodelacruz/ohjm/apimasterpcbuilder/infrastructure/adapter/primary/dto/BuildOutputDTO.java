package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto;

import java.util.List;

public class BuildOutputDTO {
    private long id;
    private String name;
    private String notes;
    private double totalPrice;
    private String category;
    private String userNick;

    private boolean deleted;
    private List<BuildComponentDTO> buildsComponents;

    public BuildOutputDTO() {}

    public boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
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

    public String getUserNick() {
        return userNick;
    }

    public void setUserNick(String userNick) {
        this.userNick = userNick;
    }

    public List<BuildComponentDTO> getBuildsComponents() {
        return buildsComponents;
    }

    public void setBuildsComponents(List<BuildComponentDTO> buildsComponentsDTO) {
        this.buildsComponents = buildsComponentsDTO;
    }
}
