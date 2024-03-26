package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.PriceHistory;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IPriceHistoryService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IPriceHistoryRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.PriceHistoryEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.PriceHistoryEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IPriceHistoryEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PriceHistoryEntityService implements IPriceHistoryRepository {
    @Autowired
    IPriceHistoryEntityRepository repo;
    PriceHistoryEntityMapper mapper = new PriceHistoryEntityMapper();
    @Override
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
    public PriceHistory save(PriceHistory bc) {
        if (bc != null) {
            PriceHistoryEntity bce = mapper.toPersistance(bc);
            if (bce == null) {
                return null;
            }
            PriceHistoryEntity save = repo.save(bce);
            if (save == null) {
                return null;
            }
            return mapper.toDomain(save);
        }
        return null;
    }

    @Override
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
    public boolean delete(Long id) {
        if (id == null) {
            return false;
        }
        try {
            if (!repo.existsById(id)) {
                return false;
            }
            repo.deleteById(id);
            return true;
        } catch (RuntimeException e) {
            return false;
        }
    }
}
