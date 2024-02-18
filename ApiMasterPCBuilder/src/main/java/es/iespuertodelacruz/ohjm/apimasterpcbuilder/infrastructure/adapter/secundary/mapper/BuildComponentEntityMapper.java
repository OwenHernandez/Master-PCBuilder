package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildComponentEntity;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class BuildComponentEntityMapper {

    public BuildComponent toDomain(BuildComponentEntity bce) {

        BuildComponent res = new BuildComponent();
        res.setId(bce.getId());

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date(bce.getDateCreated());
        String dateStr = sdf.format(date);
        res.setDateCreated(dateStr);

        res.setPriceAtTheTime(bce.getPriceAtTheTime());

        return res;
    }

    public BuildComponentEntity toPersistance(BuildComponent bc) throws ParseException {

        BuildComponentEntity res = new BuildComponentEntity();
        res.setId(bc.getId());

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date date = sdf.parse(bc.getDateCreated());
        long dateLong = date.getTime();
        res.setDateCreated(dateLong);

        res.setPriceAtTheTime(bc.getPriceAtTheTime());

        return res;
    }
}
