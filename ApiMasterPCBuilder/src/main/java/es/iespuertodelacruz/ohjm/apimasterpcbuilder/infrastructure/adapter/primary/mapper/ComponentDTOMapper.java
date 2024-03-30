package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentOutputDTO;

public class ComponentDTOMapper {

    public Component toDomain(ComponentInputDTO componentInputDTO) {
        Component component = new Component();
        component.setName(componentInputDTO.getName());
        component.setImage(componentInputDTO.getImage());
        component.setDescription(componentInputDTO.getDescription());
        component.setType(componentInputDTO.getType());
        component.setPrice(componentInputDTO.getPrice());

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
