package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;

import java.util.List;

public interface IBuildComponentRepository {

    List<BuildComponent> findAll();

    BuildComponent save(BuildComponent bc);

    BuildComponent findById(Long id);

    List<BuildComponent> findByBuildId(Long buildId);

    List<BuildComponent> findByComponentId(Long componentId);

    boolean update(BuildComponent bc);

    boolean delete(Long id);
}
