package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.ISellerRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.SellerEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.ComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.SellerEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.ISellerEntityRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SellerEntityService implements ISellerRepository {

    @Autowired
    private ISellerEntityRepository repo;

    private final SellerEntityMapper mapper = new SellerEntityMapper();

    @Override
    @Transactional
    public List<Seller> findAll() {
        List<SellerEntity> all = repo.findAll();
        List<Seller> res = new ArrayList<>();

        for (SellerEntity se : all) {
            Seller seller = mapper.toDomain(se);
            if (se.getComponents() != null && !se.getComponents().isEmpty()) {
                seller.setComponents(new ArrayList<>());
                for (ComponentEntity ce : se.getComponents()) {
                    if (ce.getDeleted() == 1) {
                        continue;
                    }
                    Component c = new Component();
                    c.setId(ce.getId());
                    seller.getComponents().add(c);
                }
            }
            res.add(seller);
        }

        return res;
    }

    @Override
    @Transactional
    public Seller save(Seller seller) {
        if (seller != null) {
            SellerEntity sellerEntity = mapper.toPersistence(seller);
            SellerEntity save = repo.save(sellerEntity);
            if (sellerEntity.getComponents() != null && !sellerEntity.getComponents().isEmpty()) {
                seller.setComponents(new ArrayList<>());
                for (ComponentEntity ce : sellerEntity.getComponents()) {
                    if (ce.getDeleted() == 1) {
                        continue;
                    }
                    Component c = new Component();
                    c.setId(ce.getId());
                    seller.getComponents().add(c);
                }
            }
            return mapper.toDomain(save);
        }
        return null;
    }

    @Override
    @Transactional
    public Seller findById(Long id) {
        Seller res = null;
        if (id != null) {
            Optional<SellerEntity> opt = repo.findById(id);
            if (opt.isPresent()) {
                SellerEntity sellerEntity = opt.get();
                res = mapper.toDomain(sellerEntity);
                if (sellerEntity.getComponents() != null && !sellerEntity.getComponents().isEmpty()) {
                    res.setComponents(new ArrayList<>());
                    for (ComponentEntity ce : sellerEntity.getComponents()) {
                        if (ce.getDeleted() == 1) {
                            continue;
                        }
                        Component c = new Component();
                        c.setId(ce.getId());
                        res.getComponents().add(c);
                    }
                }
            }
        }
        return res;
    }

    @Override
    @Transactional
    public boolean deleteById(long id) {
        repo.deleteById(id);
        return true;
    }

    @Override
    @Transactional
    public boolean update(Seller seller) {
        repo.findById(seller.getId()).orElseThrow(() -> new RuntimeException("Seller not found"));
        SellerEntity sellerEntity = mapper.toPersistence(seller);
        repo.save(sellerEntity);

        return true;
    }

    @Override
    public Seller findByName(String name) {
        Seller res = null;
        if (name != null) {
            SellerEntity sellerEntity = repo.findByName(name);
            if (sellerEntity != null) {
                res = mapper.toDomain(sellerEntity);
                if (sellerEntity.getComponents() != null && !sellerEntity.getComponents().isEmpty()) {
                    res.setComponents(new ArrayList<>());
                    for (ComponentEntity ce : sellerEntity.getComponents()) {
                        if (ce.getDeleted() == 1) {
                            continue;
                        }
                        Component c = new Component();
                        c.setId(ce.getId());
                        res.getComponents().add(c);
                    }
                }
            }
        }
        return res;
    }
}
