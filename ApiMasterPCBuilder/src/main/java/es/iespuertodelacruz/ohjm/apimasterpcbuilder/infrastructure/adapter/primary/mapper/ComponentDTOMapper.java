package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentDTO;

public class ComponentDTOMapper {
    public Component toDomain(ComponentDTO componentDTO) {
        Component component = new Component();
        component.setName(componentDTO.getName());
        component.setImage(componentDTO.getImage());
        component.setDescription(componentDTO.getDescription());
        component.setPrice(componentDTO.getPrice());

        return component;
    }

    public ComponentDTO toDTO(Component component) {
        ComponentDTO componentDTO = new ComponentDTO();
        componentDTO.setName(component.getName());
        componentDTO.setImage(component.getImage());
        componentDTO.setDescription(component.getDescription());
        componentDTO.setPrice(component.getPrice());
        componentDTO.setSellerName(component.getSeller().getName());

        return componentDTO;
    }
}
