package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildEntity;

import java.text.ParseException;
import java.util.ArrayList;

public class BuildEntityMapper {

    UserEntityMapper userMapper = new UserEntityMapper();

    BuildComponentEntityMapper bcMapper = new BuildComponentEntityMapper();

    ComponentEntityMapper componentMapper = new ComponentEntityMapper();

    public Build toDomain(BuildEntity buildEntity) {

        Build res = new Build();
        res.setId(buildEntity.getId());
        res.setName(buildEntity.getName());
        res.setNotes(buildEntity.getNotes());
        res.setTotalPrice(buildEntity.getTotalPrice());
        res.setUser(userMapper.toDomain(buildEntity.getUser()));
        if (res.getBuildsComponents() == null) {
            res.setBuildsComponents(new ArrayList<>());
        }
        for (BuildComponentEntity bce : buildEntity.getBuildsComponents()) {
            BuildComponent bc = bcMapper.toDomain(bce);
            Component comp = componentMapper.toDomain(bce.getComponent());
            comp.setUserWhoCreated(userMapper.toDomain(bce.getComponent().getUser()));
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
        res.setUser(userMapper.toPersistance(build.getUser()));
        if (res.getBuildsComponents() == null) {
            res.setBuildsComponents(new ArrayList<>());
        }
        for (BuildComponent bc : build.getBuildsComponents()) {
            res.getBuildsComponents().add(bcMapper.toPersistance(bc));
        }

        return res;
    }
}
