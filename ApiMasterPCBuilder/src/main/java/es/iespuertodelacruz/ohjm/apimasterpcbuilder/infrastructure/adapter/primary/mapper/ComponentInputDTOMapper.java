package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentInputDTO;

public class ComponentInputDTOMapper {
    public Component toDomain(ComponentInputDTO componentInputDTO) {
        Component component = new Component();
        component.setName(componentInputDTO.getName());
        component.setImage(componentInputDTO.getImage());
        component.setDescription(componentInputDTO.getDescription());
        component.setType(componentInputDTO.getType());
        component.setPrice(componentInputDTO.getPrice());

        return component;
    }

    public ComponentInputDTO toDTO(Component component) {
        ComponentInputDTO componentInputDTO = new ComponentInputDTO();
        componentInputDTO.setName(component.getName());
        componentInputDTO.setImage(component.getImage());
        componentInputDTO.setDescription(component.getDescription());
        componentInputDTO.setType(component.getType());
        componentInputDTO.setPrice(component.getPrice());
        componentInputDTO.setSellerName(component.getSeller().getName());

        return componentInputDTO;
    }
}
