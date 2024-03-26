package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.ComponentEntity;
import jakarta.persistence.*;

import java.math.BigInteger;

public class PriceHistory {
    private long id;

    private double ebayPrice;
    private double amazonPrice;
    private double price;
    private BigInteger date;
    private ComponentEntity componentEntity;

    public PriceHistory() {
    }

    public PriceHistory(long id, double ebayPrice, double amazonPrice, double price, BigInteger date, ComponentEntity componentEntity) {
        this.id = id;
        this.ebayPrice = ebayPrice;
        this.amazonPrice = amazonPrice;
        this.price = price;
        this.date = date;
        this.componentEntity = componentEntity;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public double getEbayPrice() {
        return ebayPrice;
    }

    public void setEbayPrice(double ebayPrice) {
        this.ebayPrice = ebayPrice;
    }

    public double getAmazonPrice() {
        return amazonPrice;
    }

    public void setAmazonPrice(double amazonPrice) {
        this.amazonPrice = amazonPrice;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public BigInteger getDate() {
        return date;
    }

    public void setDate(BigInteger date) {
        this.date = date;
    }

    public ComponentEntity getComponentEntity() {
        return componentEntity;
    }

    public void setComponentEntity(ComponentEntity componentEntity) {
        this.componentEntity = componentEntity;
    }
}
