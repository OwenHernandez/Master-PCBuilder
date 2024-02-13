package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;


/**
 * The persistent class for the sellers database table.
 * 
 */
@Entity
@Table(name="sellers")
@NamedQuery(name="SellerEntity.findAll", query="SELECT s FROM SellerEntity s")
public class SellerEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;

	private String image;

	private String name;

	//bi-directional many-to-one association to ComponentEntity
	@JsonIgnore
	@OneToMany(mappedBy="seller")
	private List<ComponentEntity> components;

	public SellerEntity() {
	}

	public long getId() {
		return this.id;
	}

	public void setId(long id) {
		this.id = id;
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

	public List<ComponentEntity> getComponents() {
		return this.components;
	}

	public void setComponents(List<ComponentEntity> components) {
		this.components = components;
	}

	public ComponentEntity addComponent(ComponentEntity component) {
		getComponents().add(component);
		component.setSeller(this);

		return component;
	}

	public ComponentEntity removeComponent(ComponentEntity component) {
		getComponents().remove(component);
		component.setSeller(null);

		return component;
	}

}