package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigInteger;
import java.util.List;


/**
 * The persistent class for the builds database table.
 * 
 */
@Entity
@Table(name="BUILDS")
@NamedQuery(name="BuildEntity.findAll", query="SELECT b FROM BuildEntity b")
public class BuildEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;

	private String name;

	private String notes;

	private String category;
	private byte deleted;
	@Column(name="TOTAL_PRICE")
	private double totalPrice;
	@Column(name="DATE_OF_CREATION")
	private Long dateOfCreation;
	//bi-directional many-to-one association to BuildComponentEntity
	@OneToMany(mappedBy="build")
	private List<BuildComponentEntity> buildsComponents;

	//bi-directional many-to-one association to UserEntity
	@ManyToOne
	private UserEntity user;

	//bi-directional many-to-one association to Post
	@JsonIgnore
	@OneToMany(mappedBy="build")
	private List<PostEntity> posts;

	public BuildEntity() {
	}

	public byte getDeleted() {
		return deleted;
	}

	public void setDeleted(byte deleted) {
		this.deleted = deleted;
	}

	public Long getDateOfCreation() {
		return dateOfCreation;
	}

	public void setDateOfCreation(Long dateOfCreation) {
		this.dateOfCreation = dateOfCreation;
	}

	public long getId() {
		return this.id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getNotes() {
		return this.notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public double getTotalPrice() {
		return this.totalPrice;
	}

	public void setTotalPrice(double totalPrice) {
		this.totalPrice = totalPrice;
	}

	public List<BuildComponentEntity> getBuildsComponents() {
		return this.buildsComponents;
	}

	public void setBuildsComponents(List<BuildComponentEntity> buildsComponents) {
		this.buildsComponents = buildsComponents;
	}

	public BuildComponentEntity addBuildsComponent(BuildComponentEntity buildsComponent) {
		getBuildsComponents().add(buildsComponent);
		buildsComponent.setBuild(this);

		return buildsComponent;
	}

	public BuildComponentEntity removeBuildsComponent(BuildComponentEntity buildsComponent) {
		getBuildsComponents().remove(buildsComponent);
		buildsComponent.setBuild(null);

		return buildsComponent;
	}

	public UserEntity getUser() {
		return this.user;
	}

	public void setUser(UserEntity user) {
		this.user = user;
	}

	public List<PostEntity> getPosts() {
		return this.posts;
	}

	public void setPosts(List<PostEntity> postEntities) {
		this.posts = postEntities;
	}

	public PostEntity addPost(PostEntity postEntity) {
		getPosts().add(postEntity);
		postEntity.setBuild(this);

		return postEntity;
	}

	public PostEntity removePost(PostEntity postEntity) {
		getPosts().remove(postEntity);
		postEntity.setBuild(null);

		return postEntity;
	}

}