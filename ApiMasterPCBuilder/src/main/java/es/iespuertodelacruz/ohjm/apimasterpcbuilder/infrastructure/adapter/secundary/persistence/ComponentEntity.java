package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.PriceHistory;
import jakarta.persistence.*;

import java.util.List;


/**
 * The persistent class for the components database table.
 * 
 */
@Entity
@Table(name="COMPONENTS")
@NamedQuery(name="ComponentEntity.findAll", query="SELECT c FROM ComponentEntity c")
public class ComponentEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;

	private String description;

	private String image;

	private String name;

	private String type;

	private double price;

	private double amazon_price;

	private double ebay_price;
	//bi-directional many-to-one association to UserEntity
	@JsonIgnore
	@ManyToOne
	private UserEntity user;

	//bi-directional many-to-one association to BuildComponentEntity
	@JsonIgnore
	@OneToMany(mappedBy="component")
	private List<BuildComponentEntity> buildsComponents;

	//bi-directional many-to-one association to SellerEntity
	@ManyToOne
	private SellerEntity seller;

	@JsonIgnore
	@ManyToMany(mappedBy="componentsWanted")
	private List<UserEntity> usersWhoWants;

	@OneToMany(mappedBy = "component")
	private List<PriceHistoryEntity> priceHistories;


	public ComponentEntity() {
	}

	public List<PriceHistoryEntity> getPriceHistories() {
		return priceHistories;
	}

	public void setPriceHistories(List<PriceHistoryEntity> priceHistories) {
		this.priceHistories = priceHistories;
	}

	public double getAmazon_price() {
		return amazon_price;
	}

	public void setAmazon_price(double amazon_price) {
		this.amazon_price = amazon_price;
	}

	public double getEbay_price() {
		return ebay_price;
	}

	public void setEbay_price(double ebay_price) {
		this.ebay_price = ebay_price;
	}

	public long getId() {
		return this.id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getImage() {
		return this.image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public double getPrice() {
		return this.price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public List<BuildComponentEntity> getBuildsComponents() {
		return this.buildsComponents;
	}

	public void setBuildsComponents(List<BuildComponentEntity> buildsComponents) {
		this.buildsComponents = buildsComponents;
	}

	public BuildComponentEntity addBuildsComponent(BuildComponentEntity buildsComponent) {
		getBuildsComponents().add(buildsComponent);
		buildsComponent.setComponent(this);

		return buildsComponent;
	}

	public BuildComponentEntity removeBuildsComponent(BuildComponentEntity buildsComponent) {
		getBuildsComponents().remove(buildsComponent);
		buildsComponent.setComponent(null);

		return buildsComponent;
	}

	public SellerEntity getSeller() {
		return this.seller;
	}

	public void setSeller(SellerEntity seller) {
		this.seller = seller;
	}

	public UserEntity getUser() {
		return user;
	}

	public void setUser(UserEntity user) {
		this.user = user;
	}

	public List<UserEntity> getUsersWhoWants() {
		return this.usersWhoWants;
	}

	public void setUsersWhoWants(List<UserEntity> usersWhoWants) {
		this.usersWhoWants = usersWhoWants;
	}
}