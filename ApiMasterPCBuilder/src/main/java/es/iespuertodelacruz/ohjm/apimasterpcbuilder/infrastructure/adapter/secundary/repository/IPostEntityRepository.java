package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.PostEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IPostEntityRepository extends JpaRepository<PostEntity, Long> {

    @Query(value = "SELECT * FROM POSTS p WHERE p.TITLE = :title", nativeQuery = true)
    List<PostEntity> findByTitle(@Param("title") String title);

    @Query(value = "SELECT * FROM POSTS p WHERE p.BUILD_ID = :buildId", nativeQuery = true)
    List<PostEntity> findByBuildId(@Param("buildId") Long buildId);

    @Query(value = "SELECT * FROM POSTS p WHERE p.USER_ID = :userId", nativeQuery = true)
    List<PostEntity> findByUserId(@Param("userId") Long userId);
}
