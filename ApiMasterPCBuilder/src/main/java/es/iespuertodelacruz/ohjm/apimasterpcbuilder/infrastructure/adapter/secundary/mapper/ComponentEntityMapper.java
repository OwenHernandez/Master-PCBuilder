package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.ComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.UserEntity;

import java.text.ParseException;
import java.util.ArrayList;

public class ComponentEntityMapper {

    SellerEntityMapper sellerMapper = new SellerEntityMapper();

    //UserEntityMapper userMapper = new UserEntityMapper();

    BuildComponentEntityMapper bcMapper = new BuildComponentEntityMapper();

    public Component toDomain(ComponentEntity componentEntity) {

        Component res = new Component();
        res.setId(componentEntity.getId());
        res.setName(componentEntity.getName());
        res.setDescription(componentEntity.getDescription());
        res.setPrice(componentEntity.getPrice());
        res.setType(componentEntity.getType());
        res.setImage(componentEntity.getImage());
        res.setSeller(sellerMapper.toDomain(componentEntity.getSeller()));
        //res.setUserWhoCreated(userMapper.toDomain(componentEntity.getUser()));
        /*
        if (componentEntity.getUsersWhoWants() != null) {
            if (res.getUsersWhoWants() == null) {
                res.setUsersWhoWants(new ArrayList<>());
            }
            for (UserEntity ue : componentEntity.getUsersWhoWants()) {
                res.getUsersWhoWants().add(userMapper.toDomain(ue));
            }
        }
        */

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

    public ComponentEntity toPersistance(Component component) throws ParseException {

        ComponentEntity res = new ComponentEntity();
        res.setId(component.getId());
        res.setName(component.getName());
        res.setDescription(component.getDescription());
        res.setType(component.getType());
        res.setPrice(component.getPrice());
        res.setImage(component.getImage());
        res.setSeller(sellerMapper.toPersistance(component.getSeller()));
        ///res.setUser(userMapper.toPersistance(component.getUserWhoCreated()));
        if (component.getBuildsComponents() != null) {

            if (res.getBuildsComponents() == null) {
                res.setBuildsComponents(new ArrayList<>());
            }
            for (BuildComponent bc : component.getBuildsComponents()) {
                res.getBuildsComponents().add(bcMapper.toPersistance(bc));
            }
        }
        return res;
    }
}
