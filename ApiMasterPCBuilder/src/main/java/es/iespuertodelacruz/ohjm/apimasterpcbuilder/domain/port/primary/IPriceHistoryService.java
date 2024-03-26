package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary;


import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.PriceHistory;

import java.util.List;

public interface IPriceHistoryService {
    List<PriceHistory> findAll();

    PriceHistory save(PriceHistory bc);

    PriceHistory findById(Long id);

    boolean delete(Long id);

}
