package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IBuildService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IBuildRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BuildService implements IBuildService {

    @Autowired
    IBuildRepository repo;

    @Override
    public List<Build> findAll() {
        return repo.findAll();
    }

    @Override
    public Build save(Build build) {

        if (build == null) {
            System.out.println("Es nulo en el buildService");
            return null;
        }
        return repo.save(build);
    }

    @Override
    public Build findById(Long id) {
        Build b = null;
        if (id != null) {
            b = repo.findById(id);
        }
        return b;
    }

    @Override
    public boolean deleteById(long id) {
        return repo.deleteById(id);
    }

    @Override
    public boolean update(Build build) {
        return repo.update(build);
    }

    @Override
    public List<Build> findByName(String name) {

        if (name == null || name.isBlank()) {
            return null;
        }
        return repo.findByName(name);
    }

    @Override
    public List<Build> findByTotalPrice(double totalPrice) {

        if (totalPrice == 0) {
            return null;
        }
        return repo.findByTotalPrice(totalPrice);
    }

    @Override
    public List<Build> findByUserId(Long userId) {
        return repo.findByUserId(userId);
    }
}
