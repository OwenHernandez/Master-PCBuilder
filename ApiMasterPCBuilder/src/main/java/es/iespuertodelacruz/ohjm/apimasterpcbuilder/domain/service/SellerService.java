package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.ISellerService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.ISellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SellerService implements ISellerService {

    @Autowired
    ISellerRepository repo;

    @Override
    public List<Seller> findAll() {
        return repo.findAll();
    }

    @Override
    public Seller save(Seller seller) {
        return repo.save(seller);
    }

    @Override
    public Seller findById(Long id) {
        return repo.findById(id);
    }

    @Override
    public boolean deleteById(long id) {
        return repo.deleteById(id);
    }

    @Override
    public boolean update(Seller seller) {
        return repo.update(seller);
    }

    @Override
    public List<Seller> findByName(String name) {
        return repo.findByName(name);
    }
}
