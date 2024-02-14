package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IBuildComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IBuildComponentRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class BuildComponentService implements IBuildComponentService {

    @Autowired
    IBuildComponentRepository repo;

    @Override
    public List<BuildComponent> findAll() {
        return repo.findAll();
    }

    @Override
    public BuildComponent save(BuildComponent bc) {
        return repo.save(bc);
    }

    @Override
    public BuildComponent findById(Long id) {
        return repo.findById(id);
    }

    @Override
    public List<BuildComponent> findByBuildId(Long buildId) {
        return repo.findByBuildId(buildId);
    }

    @Override
    public List<BuildComponent> findByComponentId(Long componentId) {
        return repo.findByComponentId(componentId);
    }

    @Override
    public boolean update(BuildComponent bc) {
        return repo.update(bc);
    }

    @Override
    public boolean delete(Long id) {
        return repo.delete(id);
    }
}
