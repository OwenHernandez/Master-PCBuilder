package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentOutputDTO;

public class ComponentOutputDTOMapper {

    public Component toDomain(ComponentOutputDTO componentOutputDTO) {
        Component component = new Component();
        component.setId(componentOutputDTO.getId());
        component.setName(componentOutputDTO.getName());
        component.setImage(componentOutputDTO.getImage());
        component.setType(componentOutputDTO.getType());
        component.setDescription(componentOutputDTO.getDescription());
        component.setPrice(componentOutputDTO.getPrice());

        return component;
    }

    public ComponentOutputDTO toDTO(Component component) {
        ComponentOutputDTO componentOutputDTO = new ComponentOutputDTO();
        componentOutputDTO.setId(component.getId());
        componentOutputDTO.setName(component.getName());
        componentOutputDTO.setType(component.getType());
        componentOutputDTO.setImage(component.getImage());
        componentOutputDTO.setDescription(component.getDescription());
        componentOutputDTO.setPrice(component.getPrice());
        componentOutputDTO.setSellerName(component.getSeller().getName());
        componentOutputDTO.setUserNick(component.getUserWhoCreated().getNick());

        return componentOutputDTO;
    }
}
