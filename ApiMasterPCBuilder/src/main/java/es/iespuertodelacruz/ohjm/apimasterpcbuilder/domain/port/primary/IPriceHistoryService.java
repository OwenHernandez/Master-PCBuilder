package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary;


import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.PriceHistory;

import java.math.BigInteger;
import java.util.List;

public interface IPriceHistoryService {
    List<PriceHistory> findAll();

    PriceHistory save(PriceHistory bc);
    void saveManual(double amazonPrice, Long componentId , long date, double ebayPrice, double price );
    PriceHistory findById(Long id);

    boolean delete(Long id);

}
