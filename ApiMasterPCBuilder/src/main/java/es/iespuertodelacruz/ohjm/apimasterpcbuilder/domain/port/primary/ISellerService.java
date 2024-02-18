package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;

import java.util.List;

public interface ISellerService {

    List<Seller> findAll();

    Seller save(Seller seller);

    Seller findById(Long id);

    boolean deleteById(long id);

    boolean update(Seller seller);

    Seller findByName(String name);
}
