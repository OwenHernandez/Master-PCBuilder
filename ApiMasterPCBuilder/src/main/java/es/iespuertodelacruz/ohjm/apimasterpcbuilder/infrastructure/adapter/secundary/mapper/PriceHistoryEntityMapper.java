package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.PriceHistory;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.PriceHistoryEntity;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

public class PriceHistoryEntityMapper {
    public PriceHistory toDomain(PriceHistoryEntity componentEntity) {
        PriceHistory priceHistory = new PriceHistory();
        priceHistory.setId(componentEntity.getId());
        priceHistory.setPrice(componentEntity.getPrice());
        priceHistory.setAmazonPrice(componentEntity.getAmazonPrice());
        priceHistory.setEbayPrice(componentEntity.getEbayPrice());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date(priceHistory.getDate());
        priceHistory.setDate(sdf.format(date));
        return priceHistory;
    }

    public PriceHistoryEntity toPersistance(PriceHistory priceHistory) throws ParseException {
        PriceHistoryEntity priceHistoryEntity = new PriceHistoryEntity();
        priceHistoryEntity.setId(priceHistory.getId());
        priceHistoryEntity.setPrice(priceHistory.getPrice());
        priceHistoryEntity.setAmazonPrice(priceHistory.getAmazonPrice());
        priceHistoryEntity.setEbayPrice(priceHistory.getEbayPrice());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date date = sdf.parse(priceHistory.getDate());
        priceHistoryEntity.setDate(date.getTime());
        return priceHistoryEntity;
    }
}
