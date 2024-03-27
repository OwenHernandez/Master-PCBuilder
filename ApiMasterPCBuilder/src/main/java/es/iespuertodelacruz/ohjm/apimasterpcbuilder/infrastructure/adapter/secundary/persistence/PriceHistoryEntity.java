package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.io.Serializable;
import java.math.BigInteger;
import java.util.List;

@Entity
@Table(name="PRICE_HISTORY")
@NamedQuery(name="PriceHistoryEntity.findAll", query="SELECT b FROM PriceHistoryEntity b")
public class PriceHistoryEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private long id;

    @Column(name="EBAY_PRICE")
    private double ebayPrice;
    @Column(name="AMAZON_PRICE")
    private double amazonPrice;
    @Column(name="PRICE")
    private double price;
    @Column(name="DATE")
    private BigInteger date;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "COMPONENT_ID", nullable = false)
    private ComponentEntity component;

    public PriceHistoryEntity() {
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
        return component;
    }

    public void setComponentEntity(ComponentEntity componentEntity) {
        this.component = componentEntity;
    }
}