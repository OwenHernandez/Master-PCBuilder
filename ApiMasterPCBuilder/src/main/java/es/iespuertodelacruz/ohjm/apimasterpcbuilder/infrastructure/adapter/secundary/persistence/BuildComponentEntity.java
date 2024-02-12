package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;


/**
 * The persistent class for the builds_components database table.
 * 
 */
@Entity
@Table(name="builds_components")
@NamedQuery(name="BuildComponentEntity.findAll", query="SELECT b FROM BuildComponentEntity b")
public class BuildComponentEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;

	@Column(name="DATE_CREATED")
	private long dateCreated;

	@Column(name="PRICE_AT_THE_TIME")
	private double priceAtTheTime;

	//bi-directional many-to-one association to BuildEntity
	@JsonIgnore
	@ManyToOne
	private BuildEntity build;

	//bi-directional many-to-one association to ComponentEntity
	@JsonIgnore
	@ManyToOne
	private ComponentEntity component;

	public BuildComponentEntity() {
	}

	public long getId() {
		return this.id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getDateCreated() {
		return this.dateCreated;
	}

	public void setDateCreated(long dateCreated) {
		this.dateCreated = dateCreated;
	}

	public double getPriceAtTheTime() {
		return this.priceAtTheTime;
	}

	public void setPriceAtTheTime(double priceAtTheTime) {
		this.priceAtTheTime = priceAtTheTime;
	}

	public BuildEntity getBuild() {
		return this.build;
	}

	public void setBuild(BuildEntity build) {
		this.build = build;
	}

	public ComponentEntity getComponent() {
		return this.component;
	}

	public void setComponent(ComponentEntity component) {
		this.component = component;
	}

}