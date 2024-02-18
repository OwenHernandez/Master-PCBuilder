package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.SellerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ISellerEntityRepository extends JpaRepository<SellerEntity, Long> {

    @Query(value = "SELECT * FROM SELLERS s WHERE s.NAME = :name", nativeQuery = true)
    SellerEntity findByName(@Param("name") String name);
}
