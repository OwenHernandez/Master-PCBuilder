package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary;


import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.PriceHistory;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface IPriceHistoryService {
    List<PriceHistory> findAll();

    PriceHistory save(PriceHistory bc);
    void saveManual(double amazonPrice, Long componentId , long date, double ebayPrice, double price );
    PriceHistory findById(Long id);

    boolean delete(Long id);

}
