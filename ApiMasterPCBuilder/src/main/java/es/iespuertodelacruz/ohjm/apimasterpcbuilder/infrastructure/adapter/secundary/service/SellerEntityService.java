package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.ISellerRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.SellerEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.SellerEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.ISellerEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SellerEntityService implements ISellerRepository {

    @Autowired
    ISellerEntityRepository repo;

    SellerEntityMapper mapper;

    public SellerEntityService() { mapper = new SellerEntityMapper();}

    @Override
    public List<Seller> findAll() {
        List<SellerEntity> all = repo.findAll();
        List<Seller> res = new ArrayList<>();

        for (SellerEntity se : all) {
            Seller seller = mapper.toDomain(se);
            res.add(seller);
        }

        return res;
    }

    @Override
    public Seller save(Seller seller) {
        try {
            if (seller != null) {
                SellerEntity sellerEntity = mapper.toPersistance(seller);
                SellerEntity save = repo.save(sellerEntity);
                return mapper.toDomain(save);
            }
            return null;
        } catch (RuntimeException e) {
            return null;
        }
    }

    @Override
    public Seller findById(Long id) {
        Seller res = null;
        if (id != null) {
            Optional<SellerEntity> opt = repo.findById(id);
            if (opt.isPresent()) {
                SellerEntity buildEntity = opt.get();
                res = mapper.toDomain(buildEntity);
            }
        }
        return res;
    }

    @Override
    public boolean deleteById(long id) {
        try {//I will need to change this once the Component class is done
            repo.deleteById(id);
            return true;
        } catch (RuntimeException e) {
            return false;
        }
    }

    @Override
    public boolean update(Seller seller) {
        try {
            SellerEntity sellerEntity = mapper.toPersistance(seller);
            SellerEntity save = repo.save(sellerEntity);

            if (save != null)
                return true;
            else
                return false;
        } catch (RuntimeException e) {
            return false;
        }
    }

    @Override
    public Seller findByName(String name) {
        Seller res = null;
        if (name != null) {
            SellerEntity sellerEntity = repo.findByName(name);
            if (sellerEntity != null) {
                res = mapper.toDomain(sellerEntity);
            }
        }
        return res;
    }
}
