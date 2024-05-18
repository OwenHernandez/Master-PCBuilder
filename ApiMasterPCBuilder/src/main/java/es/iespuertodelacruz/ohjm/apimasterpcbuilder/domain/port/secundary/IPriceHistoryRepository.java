package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.PriceHistory;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface IPriceHistoryRepository {
    List<PriceHistory> findAll();

    PriceHistory save(PriceHistory bc);
    void saveManual(double amazonPrice, Long componentId , long date, double ebayPrice, double price );

    PriceHistory findById(Long id);
    boolean delete(Long id);

}
