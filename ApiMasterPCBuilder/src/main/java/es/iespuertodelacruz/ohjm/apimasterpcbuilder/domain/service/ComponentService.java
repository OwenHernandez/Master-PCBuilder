package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IBuildService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IBuildRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IComponentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComponentService implements IComponentService {

    @Autowired
    IComponentRepository repo;

    @Override
    public List<Component> findAll() {
        return repo.findAll();
    }

    @Override
    public Component save(Component component) {

        if (component == null) {
            return null;
        }
        return repo.save(component);
    }

    @Override
    public Component findById(Long id) {
        Component component = null;
        if (id != null) {
            component = repo.findById(id);
        }
        return component;
    }

    @Override
    public boolean deleteById(long id) {
        return repo.deleteById(id);
    }

    @Override
    public boolean update(Component component) {
        return repo.update(component);
    }

    @Override
    public List<Component> findByName(String name) {

        if (name == null || name.isBlank()) {
            return null;
        }
        return repo.findByName(name);
    }

    @Override
    public List<Component> findByPrice(double price) {

        if (price == 0) {
            return null;
        }
        return repo.findByPrice(price);
    }

    @Override
    public List<Component> findBySellerId(Long sellerId) {
        return repo.findBySellerId(sellerId);
    }

    @Override
    public List<Component> findByUserId(Long userId) {

        if (userId == 0) {
            return null;
        }
        return repo.findByUserId(userId);
    }

    @Override
    public List<Component> searchAmazon(String name) {
        if (name == null || name.isBlank()) {
            return null;
        }
        return repo.searchAmazon(name);
    }

    @Override
    public List<Component> searchEbay(String name) {
        if (name == null || name.isBlank()) {
            return null;
        }
        return repo.searchEbay(name);
    }

    @Override
    public void updatePrices(Long id, double amazonPrice, double ebayPrice) {
        if (id == 0 && amazonPrice <= 0 && ebayPrice <= 0) {
            return;
        }
        repo.updatePrices(id, amazonPrice, ebayPrice);
    }

}
