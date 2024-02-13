package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.ComponentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IComponentEntityRepository extends JpaRepository<ComponentEntity, Long> {

    @Query(value = "SELECT * FROM COMPONENTS c WHERE c.name = :name", nativeQuery = true)
    List<ComponentEntity> findByName(@Param("name") String name);

    @Query(value = "SELECT * FROM COMPONENTS c WHERE c.price = :price", nativeQuery = true)
    List<ComponentEntity> findByPrice(@Param("price") double price);

    @Query(value = "SELECT * FROM COMPONENTS c WHERE c.seller_id = :seller_id", nativeQuery = true)
    List<ComponentEntity> findBySellerId(@Param("seller_id") Long sellerId);
}
