package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.PriceHistory;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IPriceHistoryService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IPriceHistoryRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.PriceHistoryEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.PriceHistoryEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IPriceHistoryEntityRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PriceHistoryEntityService implements IPriceHistoryRepository {

    @Autowired
    IPriceHistoryEntityRepository repo;

    PriceHistoryEntityMapper mapper = new PriceHistoryEntityMapper();

    @Override
    @Transactional
    public List<PriceHistory> findAll() {
        List<PriceHistory> res = new ArrayList<>();
        List<PriceHistoryEntity> all = repo.findAll();

        for (PriceHistoryEntity bce : all) {
            PriceHistory bc = mapper.toDomain(bce);
            res.add(bc);
        }

        return res;
    }

    @Override
    @Transactional
    public PriceHistory save(PriceHistory bc) {
        if (bc != null) {
            PriceHistoryEntity bce;
            try {
                bce = mapper.toPersistance(bc);
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
            if (bce == null) {
                return null;
            }
            PriceHistoryEntity save = repo.save(bce);
            return mapper.toDomain(save);
        }
        return null;
    }

    @Override
    @Transactional
    public void saveManual(double amazonPrice, Long componentId, long date, double ebayPrice, double price) {
        if (amazonPrice != 0 && componentId != null && date != 0 && ebayPrice != 0 && price != 0) {
            repo.saveManual(amazonPrice, componentId, date, ebayPrice, price);
        }
    }

    @Override
    @Transactional
    public PriceHistory findById(Long id) {
        if (id == null) {
            return null;
        }
        Optional<PriceHistoryEntity> byId = repo.findById(id);
        if (byId.isPresent()) {
            return mapper.toDomain(byId.get());
        } else {
            return null;
        }
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        if (id == null) {
            return false;
        }
        if (!repo.existsById(id)) {
            return false;
        }
        repo.deleteById(id);
        return true;
    }
}
