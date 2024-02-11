package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildEntity;

import java.util.ArrayList;
import java.util.List;

public class BuildEntityMapper {

    UserEntityMapper userMapper;

    public BuildEntityMapper() { userMapper = new UserEntityMapper();}

    public Build toDomain(BuildEntity buildEntity) {

        Build res = new Build();
        res.setId(buildEntity.getId());
        res.setName(buildEntity.getName());
        res.setNotes(buildEntity.getNotes());
        res.setTotalPrice(buildEntity.getTotalPrice());
        res.setUser(userMapper.toDomain(buildEntity.getUser()));

        return res;
    }

    public BuildEntity toPersistance(Build build) {

        BuildEntity res = new BuildEntity();
        res.setId(build.getId());
        res.setName(build.getName());
        res.setNotes(build.getNotes());
        res.setTotalPrice(build.getTotalPrice());
        res.setUser(userMapper.toPersistance(build.getUser()));

        return res;
    }
}
