package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto;

public class UserV3DTO extends UserDTO {

    private boolean active;
    private boolean deleted;

    public UserV3DTO() {
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
}
