package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.ComponentEntity;

public class ComponentEntityMapper {

    SellerEntityMapper sellerMapper = new SellerEntityMapper();

    public Component toDomain(ComponentEntity componentEntity) {

        Component res = new Component();
        res.setId(componentEntity.getId());
        res.setName(componentEntity.getName());
        res.setDescription(componentEntity.getDescription());
        res.setPrice(componentEntity.getPrice());
        res.setImage(componentEntity.getImage());
        res.setSeller(sellerMapper.toDomain(componentEntity.getSeller()));

        return res;
    }

    public ComponentEntity toPersistance(Component component) {

        ComponentEntity res = new ComponentEntity();
        res.setId(component.getId());
        res.setName(component.getName());
        res.setDescription(component.getDescription());
        res.setPrice(component.getPrice());
        res.setImage(component.getImage());
        res.setSeller(sellerMapper.toPersistance(component.getSeller()));

        return res;
    }
}
