package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.ComponentEntity;

import java.text.ParseException;
import java.util.ArrayList;

public class ComponentEntityMapper {

    private final SellerEntityMapper sellerMapper = new SellerEntityMapper();


    private final BuildComponentEntityMapper bcMapper = new BuildComponentEntityMapper();

    public Component toDomain(ComponentEntity componentEntity) {

        Component res = new Component();
        res.setId(componentEntity.getId());
        res.setName(componentEntity.getName());
        res.setDescription(componentEntity.getDescription());
        res.setPrice(componentEntity.getPrice());
        res.setAmazon_price(componentEntity.getAmazon_price());
        res.setEbay_price(componentEntity.getEbay_price());
        res.setType(componentEntity.getType());
        res.setImage(componentEntity.getImage());
        res.setSeller(sellerMapper.toDomain(componentEntity.getSeller()));


        if (componentEntity.getBuildsComponents() != null) {
            if (res.getBuildsComponents() == null) {
                res.setBuildsComponents(new ArrayList<>());
            }
            for (BuildComponentEntity bce : componentEntity.getBuildsComponents()) {
                res.getBuildsComponents().add(bcMapper.toDomain(bce));
            }
        }
        return res;
    }

    public ComponentEntity toPersistence(Component component) throws ParseException {

        ComponentEntity res = new ComponentEntity();
        res.setId(component.getId());
        res.setName(component.getName());
        res.setDescription(component.getDescription());
        res.setType(component.getType());
        res.setPrice(component.getPrice());
        res.setAmazon_price(component.getAmazon_price());
        res.setEbay_price(component.getEbay_price());
        res.setImage(component.getImage());
        res.setSeller(sellerMapper.toPersistence(component.getSeller()));
        ///res.setUser(userMapper.toPersistance(component.getUserWhoCreated()));
        if (component.getBuildsComponents() != null) {

            if (res.getBuildsComponents() == null) {
                res.setBuildsComponents(new ArrayList<>());
            }
            for (BuildComponent bc : component.getBuildsComponents()) {
                res.getBuildsComponents().add(bcMapper.toPersistence(bc));
            }
        }
        return res;
    }
}
