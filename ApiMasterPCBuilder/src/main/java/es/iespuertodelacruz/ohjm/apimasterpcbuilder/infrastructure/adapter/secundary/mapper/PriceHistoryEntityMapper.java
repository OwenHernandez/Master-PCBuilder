package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.PriceHistory;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.PriceHistoryEntity;

import java.text.ParseException;
import java.util.ArrayList;

public class PriceHistoryEntityMapper {
    public PriceHistory toDomain(PriceHistoryEntity componentEntity) {
        PriceHistory priceHistory = new PriceHistory();
        priceHistory.setId(componentEntity.getId());
        priceHistory.setPrice(componentEntity.getPrice());
        priceHistory.setAmazonPrice(componentEntity.getAmazonPrice());
        priceHistory.setEbayPrice(componentEntity.getEbayPrice());
        priceHistory.setDate(componentEntity.getDate());
        return priceHistory;
    }

    public PriceHistoryEntity toPersistance(PriceHistory priceHistory)  {
        PriceHistoryEntity priceHistoryEntity = new PriceHistoryEntity();
        priceHistoryEntity.setId(priceHistory.getId());
        priceHistoryEntity.setPrice(priceHistory.getPrice());
        priceHistoryEntity.setAmazonPrice(priceHistory.getAmazonPrice());
        priceHistoryEntity.setEbayPrice(priceHistory.getEbayPrice());
        priceHistoryEntity.setDate(priceHistory.getDate());
        return priceHistoryEntity;
    }
}
