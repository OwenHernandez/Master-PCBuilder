package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.PriceHistory;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentOutputDTO;

import java.util.ArrayList;
import java.util.logging.Logger;

public class ComponentOutputDTOMapper {
    Logger log;
    public Component toDomain(ComponentOutputDTO componentOutputDTO) {
        Component component = new Component();
        component.setId(componentOutputDTO.getId());
        component.setName(componentOutputDTO.getName());
        component.setImage(componentOutputDTO.getImage());
        component.setType(componentOutputDTO.getType());
        component.setDescription(componentOutputDTO.getDescription());
        component.setPrice(componentOutputDTO.getPrice());
        component.setAmazon_price(componentOutputDTO.getAmazon_price());
        component.setEbay_price(componentOutputDTO.getEbay_price());
        if (componentOutputDTO.getPriceHistory() != null) {
            if (component.getPriceHistories() == null) {
                component.setPriceHistories(new ArrayList<>());
            }
            for (PriceHistory bce : componentOutputDTO.getPriceHistory()) {
                component.getPriceHistories().add(bce);
            }
        }

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