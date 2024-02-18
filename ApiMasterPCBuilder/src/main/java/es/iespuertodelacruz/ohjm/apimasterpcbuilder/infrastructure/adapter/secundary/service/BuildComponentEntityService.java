package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IBuildComponentRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.BuildComponentEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IBuildComponentEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BuildComponentEntityService implements IBuildComponentRepository {

    @Autowired
    IBuildComponentEntityRepository repo;

    BuildComponentEntityMapper mapper = new BuildComponentEntityMapper();

    public List<BuildComponent> findAll() {
        List<BuildComponent> res = new ArrayList<>();
        List<BuildComponentEntity> all = repo.findAll();

        for (BuildComponentEntity bce : all) {
            BuildComponent bc = mapper.toDomain(bce);
            res.add(bc);
        }

        return res;
    }

    public BuildComponent save(BuildComponent bc) {
        try {
            BuildComponentEntity bce = mapper.toPersistance(bc);
            BuildComponentEntity save = repo.save(bce);
            return mapper.toDomain(save);
        } catch (RuntimeException | ParseException e) {
            return null;
        }
    }

    public BuildComponent findById(Long id) {
        Optional<BuildComponentEntity> byId = repo.findById(id);
        return byId.map(buildComponentEntity -> mapper.toDomain(buildComponentEntity)).orElse(null);
    }

    public boolean update(BuildComponent bc) {
        try {
            BuildComponentEntity bce = mapper.toPersistance(bc);
            repo.save(bce);
            return true;
        } catch (RuntimeException | ParseException e) {
            return false;
        }
    }

    public boolean delete(Long id) {
        try {
            repo.deleteById(id);
            return true;
        } catch (RuntimeException e) {
            return false;
        }
    }

    public List<BuildComponent> findByBuildId(Long buildId) {
        List<BuildComponent> res = new ArrayList<>();
        List<BuildComponentEntity> byBuildId = repo.findByBuildId(buildId);

        for (BuildComponentEntity bce : byBuildId) {
            BuildComponent bc = mapper.toDomain(bce);
            res.add(bc);
        }

        return res;
    }

    public List<BuildComponent> findByComponentId(Long componentId) {
        List<BuildComponent> res = new ArrayList<>();
        List<BuildComponentEntity> byComponentId = repo.findByComponentId(componentId);

        for (BuildComponentEntity bce : byComponentId) {
            BuildComponent bc = mapper.toDomain(bce);
            res.add(bc);
        }

        return res;
    }
}
