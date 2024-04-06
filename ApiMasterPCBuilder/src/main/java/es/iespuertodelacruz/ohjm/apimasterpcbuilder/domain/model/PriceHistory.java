package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.ComponentEntity;
import jakarta.persistence.*;

import java.math.BigInteger;

public class PriceHistory {
    private long id;

    private double ebayPrice;
    private double amazonPrice;
    private double price;
    private String date;
    private Component component;

    public PriceHistory() {
    }

    public PriceHistory(long id, double ebayPrice, double amazonPrice, double price, String date, Component componentEntity) {
        this.id = id;
        this.ebayPrice = ebayPrice;
        this.amazonPrice = amazonPrice;
        this.price = price;
        this.date = date;
        this.component = componentEntity;
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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Component getComponent() {
        return component;
    }

    public void setComponent(Component component) {
        this.component = component;
    }
}
