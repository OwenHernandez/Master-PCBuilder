package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IBuildEntityRepository extends JpaRepository<BuildEntity, Long> {

    @Query(value = "SELECT * FROM BUILDS b WHERE b.NAME = :name", nativeQuery = true)
    List<BuildEntity> findByName(@Param("name") String name);

    @Query(value = "SELECT * FROM BUILDS b WHERE b.USER_ID = :userId", nativeQuery = true)
    List<BuildEntity> findByUserId(@Param("userId") Long userId);

}
