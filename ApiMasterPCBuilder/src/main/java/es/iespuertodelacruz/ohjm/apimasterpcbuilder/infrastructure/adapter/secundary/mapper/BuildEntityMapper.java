package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.ComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.UserEntity;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.logging.Logger;

public class BuildEntityMapper {
    private final UserEntityMapper userMapper = new UserEntityMapper();

    private final BuildComponentEntityMapper bcMapper = new BuildComponentEntityMapper();

    private final ComponentEntityMapper componentMapper = new ComponentEntityMapper();

    public Build toDomain(BuildEntity buildEntity) {

        Build res = new Build();
        res.setId(buildEntity.getId());
        res.setName(buildEntity.getName());
        res.setNotes(buildEntity.getNotes());
        res.setTotalPrice(buildEntity.getTotalPrice());
        res.setCategory(buildEntity.getCategory());
        res.setUser(userMapper.toDomain(buildEntity.getUser()));
        if (res.getBuildsComponents() == null) {
            res.setBuildsComponents(new ArrayList<>());
        }
        for (BuildComponentEntity bce : buildEntity.getBuildsComponents()) {
            BuildComponent bc = bcMapper.toDomain(bce);
            Component comp = componentMapper.toDomain(bce.getComponent());
            if (bce.getComponent().getUser() != null) {
                comp.setUserWhoCreated(userMapper.toDomain(bce.getComponent().getUser()));
            }
            if (bce.getComponent().getUsersWhoWants() != null) {
                if (comp.getUsersWhoWants() == null) {
                    comp.setUsersWhoWants(new ArrayList<>());
                }
                for (UserEntity ue : bce.getComponent().getUsersWhoWants()) {
                    comp.getUsersWhoWants().add(userMapper.toDomain(ue));
                }
            }
            bc.setComponent(comp);
            res.getBuildsComponents().add(bc);
        }


        return res;
    }

    public BuildEntity toPersistence(Build build) throws ParseException {

        BuildEntity res = new BuildEntity();
        res.setId(build.getId());
        res.setName(build.getName());
        res.setNotes(build.getNotes());
        res.setTotalPrice(build.getTotalPrice());
        res.setCategory(build.getCategory());
        res.setUser(userMapper.toPersistance(build.getUser()));
        if (res.getBuildsComponents() == null) {
            res.setBuildsComponents(new ArrayList<>());
        }
        for (BuildComponent bc : build.getBuildsComponents()) {
            BuildComponentEntity bce = bcMapper.toPersistance(bc);
            ComponentEntity comp = componentMapper.toPersistance(bc.getComponent());
            comp.setUser(userMapper.toPersistance(bc.getComponent().getUserWhoCreated()));
            bce.setComponent(comp);
            res.getBuildsComponents().add(bce);
        }

        return res;
    }
}
