package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto;

import java.util.List;

public class BuildInputDTO {

    private String name;

    private String notes;

    private List<Long> componentsIds;

    public BuildInputDTO() {}

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

    public List<Long> getComponentsIds() {
        return componentsIds;
    }

    public void setComponentsIds(List<Long> componentsIds) {
        this.componentsIds = componentsIds;
    }
}
