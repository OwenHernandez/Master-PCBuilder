package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.PriceHistory;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IPriceHistoryService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IPriceHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PriceHistoryService implements IPriceHistoryService {

    @Autowired
    IPriceHistoryRepository repo;
    @Override
    public List<PriceHistory> findAll() {
        return repo.findAll();
    }

    @Override
    public PriceHistory save(PriceHistory bc) {
        return repo.save(bc);
    }

    @Override
    public void saveManual(double amazonPrice, Long componentId, long date, double ebayPrice, double price) {
        if (amazonPrice < 0 || ebayPrice < 0 || price < 0 || componentId < 0 || date < 0) {
            throw new RuntimeException("The price cannot be negative");
        }
        repo.saveManual(amazonPrice, componentId, date, ebayPrice, price);
    }

    @Override
    public PriceHistory findById(Long id) {
        return repo.findById(id);
    }

    @Override
    public boolean delete(Long id) {
        return repo.delete(id);
    }
}
