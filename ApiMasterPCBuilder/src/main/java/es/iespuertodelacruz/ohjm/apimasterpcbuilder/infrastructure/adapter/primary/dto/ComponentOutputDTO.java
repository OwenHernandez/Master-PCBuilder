package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto;

public class ComponentOutputDTO extends ComponentInputDTO {

    private long id;

    public ComponentOutputDTO() {super();}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}
