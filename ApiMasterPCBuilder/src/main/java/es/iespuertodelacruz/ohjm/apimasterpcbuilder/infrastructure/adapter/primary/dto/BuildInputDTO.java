package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto;

import java.util.List;

public class BuildInputDTO {

    private String name;

    private String notes;

    private String category;

    private List<Long> componentsIds;
    private byte deleted;
    public BuildInputDTO() {}

    public byte getDeleted() {
        return deleted;
    }

    public void setDeleted(byte deleted) {
        this.deleted = deleted;
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

    public List<Long> getComponentsIds() {
        return componentsIds;
    }

    public void setComponentsIds(List<Long> componentsIds) {
        this.componentsIds = componentsIds;
    }
}
