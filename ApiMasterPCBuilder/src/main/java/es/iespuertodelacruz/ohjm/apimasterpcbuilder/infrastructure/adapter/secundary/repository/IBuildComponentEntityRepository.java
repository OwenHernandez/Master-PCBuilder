package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildComponentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IBuildComponentEntityRepository extends JpaRepository<BuildComponentEntity, Long> {

    @Query(value = "SELECT * FROM BUILDS_COMPONENTS WHERE build_id = :build_id", nativeQuery = true)
    List<BuildComponentEntity> findByBuildId(@Param("build_id") long buildId);

    @Query(value = "SELECT * FROM BUILDS_COMPONENTS WHERE component_id = :component_id", nativeQuery = true)
    List<BuildComponentEntity> findByComponentId(@Param("component_id") long componentId);
}
