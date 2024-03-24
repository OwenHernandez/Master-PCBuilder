package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.ComponentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface IComponentEntityRepository extends JpaRepository<ComponentEntity, Long> {

    @Query(value = "SELECT * FROM COMPONENTS c WHERE c.NAME = :name", nativeQuery = true)
    List<ComponentEntity> findByName(@Param("name") String name);

    @Query(value = "SELECT * FROM COMPONENTS c WHERE c.PRICE = :price", nativeQuery = true)
    List<ComponentEntity> findByPrice(@Param("price") double price);

    @Query(value = "SELECT * FROM COMPONENTS c WHERE c.SELLER_ID = :seller_id", nativeQuery = true)
    List<ComponentEntity> findBySellerId(@Param("seller_id") Long sellerId);

    @Query(value = "SELECT * FROM COMPONENTS c WHERE c.USER_ID = :user_id", nativeQuery = true)
    List<ComponentEntity> findByUserId(@Param("user_id") Long userId);
    @Modifying
    @Transactional
    @Query(value = "UPDATE COMPONENTS SET AMAZON_PRICE = :amazonPrice , EBAY_PRICE = :ebayPrice WHERE ID = :id ", nativeQuery = true)
    void updatePrices(@Param("id") Long id,@Param("amazonPrice") double amazonPrice,@Param("ebayPrice") double ebayPrice);
}
