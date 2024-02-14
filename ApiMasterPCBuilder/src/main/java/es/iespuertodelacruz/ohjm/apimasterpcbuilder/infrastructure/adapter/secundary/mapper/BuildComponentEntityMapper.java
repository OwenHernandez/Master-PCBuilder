package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildComponentEntity;

public class BuildComponentEntityMapper {

    BuildEntityMapper buildMapper = new BuildEntityMapper();

    ComponentEntityMapper componentMapper = new ComponentEntityMapper();

    public BuildComponent toDomain(BuildComponentEntity bce) {

        BuildComponent res = new BuildComponent();
        res.setId(bce.getId());
        res.setDateCreated(bce.getDateCreated());
        res.setPriceAtTheTime(bce.getPriceAtTheTime());
        res.setBuild(buildMapper.toDomain(bce.getBuild()));
        res.setComponent(componentMapper.toDomain(bce.getComponent()));

        return res;
    }

    public BuildComponentEntity toPersistance(BuildComponent bc) {

        BuildComponentEntity res = new BuildComponentEntity();
        res.setId(bc.getId());
        res.setDateCreated(bc.getDateCreated());
        res.setPriceAtTheTime(bc.getPriceAtTheTime());
        res.setBuild(buildMapper.toPersistance(bc.getBuild()));
        res.setComponent(componentMapper.toPersistance(bc.getComponent()));

        return res;
    }
}
