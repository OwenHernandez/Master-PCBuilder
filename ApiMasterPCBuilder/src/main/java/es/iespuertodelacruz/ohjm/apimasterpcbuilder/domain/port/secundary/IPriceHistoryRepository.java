package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.PriceHistory;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface IPriceHistoryRepository {
    List<PriceHistory> findAll();

    PriceHistory save(PriceHistory bc);

    PriceHistory findById(Long id);
    boolean delete(Long id);

}
