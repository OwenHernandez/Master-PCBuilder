package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.PriceHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IPriceHistoryEntityRepository extends JpaRepository<PriceHistoryEntity, Long> {
    @Modifying
    @Query(value = "insert into PRICE_HISTORY (AMAZON_PRICE,COMPONENT_ID,DATE,EBAY_PRICE,PRICE) values ( :amazon , :componentId , :date , :ebay , :price )",nativeQuery = true)
    void saveManual(@Param("amazon") double amazon, @Param("componentId") long componentId, @Param("date") long date, @Param("ebay") double ebay, @Param("price") double price);
}
