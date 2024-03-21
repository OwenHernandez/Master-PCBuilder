package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;

import java.util.List;

public interface IComponentRepository {

    List<Component> findAll();

    Component save(Component build);

    Component findById(Long id);

    boolean deleteById(long id);

    boolean update(Component build);

    List<Component> findByName(String name);

    List<Component> findByPrice(double price);

    List<Component> findBySellerId(Long sellerId);

    List<Component> findByUserId(Long userId);
    List<Component> searchAmazon(String name);
    List<Component> searchEbay(String name);
}
