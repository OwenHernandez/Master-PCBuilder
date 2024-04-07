package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.PriceHistory;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentOutputDTO;

import java.util.ArrayList;

public class ComponentDTOMapper {
    public Component toDomain(ComponentInputDTO componentInputDTO) {
        Component component = new Component();
        component.setName(componentInputDTO.getName());
        component.setImage(componentInputDTO.getImage());
        component.setDescription(componentInputDTO.getDescription());
        component.setType(componentInputDTO.getType());
        component.setPrice(componentInputDTO.getPrice());
        component.setAmazon_price(componentInputDTO.getAmazon_price());
        component.setEbay_price(componentInputDTO.getEbay_price());

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
        componentOutputDTO.setAmazon_price(component.getAmazon_price());
        componentOutputDTO.setEbay_price(component.getEbay_price());
        if (component.getPriceHistories() != null) {
            if (componentOutputDTO.getPriceHistory() == null) {
                componentOutputDTO.setPriceHistory(new ArrayList<>());
            }
            for (PriceHistory bce : component.getPriceHistories()) {
                componentOutputDTO.getPriceHistory().add(bce);
            }
        }


        return componentOutputDTO;
    }
}
