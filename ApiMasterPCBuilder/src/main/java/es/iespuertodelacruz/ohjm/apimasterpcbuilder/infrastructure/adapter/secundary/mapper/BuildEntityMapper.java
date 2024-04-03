package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.ComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.UserEntity;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;

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
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date(buildEntity.getDateOfCreation());
        String dateStr = sdf.format(date);
        res.setDateOfCreation(dateStr);
        res.setCategory(buildEntity.getCategory());
        res.setUser(userMapper.toDomain(buildEntity.getUser(), new HashSet<Long>(), new HashSet<Long>(), "builds"));
        if (res.getBuildsComponents() == null) {
            res.setBuildsComponents(new ArrayList<>());
        }
        for (BuildComponentEntity bce : buildEntity.getBuildsComponents()) {
            BuildComponent bc = bcMapper.toDomain(bce);
            Component comp = componentMapper.toDomain(bce.getComponent());
            if (bce.getComponent().getUser() != null) {
                comp.setUserWhoCreated(userMapper.toDomain(bce.getComponent().getUser(), new HashSet<Long>(), new HashSet<Long>(), "builds"));
            }
            if (bce.getComponent().getUsersWhoWants() != null) {
                if (comp.getUsersWhoWants() == null) {
                    comp.setUsersWhoWants(new ArrayList<>());
                }
                for (UserEntity ue : bce.getComponent().getUsersWhoWants()) {
                    comp.getUsersWhoWants().add(userMapper.toDomain(ue, new HashSet<Long>(), new HashSet<Long>(), "builds"));
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
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date date = sdf.parse(build.getDateOfCreation());
        long dateLong = date.getTime();
        res.setDateOfCreation(dateLong);
        res.setCategory(build.getCategory());
        res.setUser(userMapper.toPersistence(build.getUser(), new HashSet<>(), new HashSet<>(), "builds"));
        if (res.getBuildsComponents() == null) {
            res.setBuildsComponents(new ArrayList<>());
        }
        for (BuildComponent bc : build.getBuildsComponents()) {
            BuildComponentEntity bce = bcMapper.toPersistence(bc);
            ComponentEntity comp = componentMapper.toPersistence(bc.getComponent());
            comp.setUser(userMapper.toPersistence(bc.getComponent().getUserWhoCreated(), new HashSet<>(), new HashSet<>(), "builds"));
            bce.setComponent(comp);
            res.getBuildsComponents().add(bce);
        }

        return res;
    }
}
