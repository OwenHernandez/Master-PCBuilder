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
        priceHistory.setDate(componentEntity.getDate().toString());
        return priceHistory;
    }

    public PriceHistoryEntity toPersistance(PriceHistory priceHistory) throws ParseException {
        PriceHistoryEntity priceHistoryEntity = new PriceHistoryEntity();
        priceHistoryEntity.setId(priceHistory.getId());
        priceHistoryEntity.setPrice(priceHistory.getPrice());
        priceHistoryEntity.setAmazonPrice(priceHistory.getAmazonPrice());
        priceHistoryEntity.setEbayPrice(priceHistory.getEbayPrice());
        priceHistoryEntity.setDate(Long.valueOf(priceHistory.getDate()));
        return priceHistoryEntity;
    }
}
