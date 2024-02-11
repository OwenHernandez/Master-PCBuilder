package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;

import java.util.List;

public interface IBuildRepository {

    List<Build> findAll();

    Build save(Build build);

    Build findById(Integer id);

    List<Build> findByName(String name);

    List<Build> findByTotalPrice(double totalPrice);
}
