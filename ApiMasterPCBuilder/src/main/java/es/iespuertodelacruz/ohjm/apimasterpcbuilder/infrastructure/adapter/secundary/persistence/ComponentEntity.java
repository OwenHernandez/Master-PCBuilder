package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

	//bi-directional many-to-one association to UserEntity
	@ManyToOne
	private UserEntity user;

	//bi-directional many-to-one association to BuildComponentEntity
	@JsonIgnore
	@OneToMany(mappedBy="component")
	private List<BuildComponentEntity> buildsComponents;

	//bi-directional many-to-one association to SellerEntity
	@ManyToOne
	private SellerEntity seller;

	public ComponentEntity() {
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
}