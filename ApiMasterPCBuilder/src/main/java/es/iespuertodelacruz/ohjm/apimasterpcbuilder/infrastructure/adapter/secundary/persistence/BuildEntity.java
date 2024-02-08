package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence;

import java.io.Serializable;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;


/**
 * The persistent class for the builds database table.
 * 
 */
@Entity
@Table(name="builds")
@NamedQuery(name="BuildEntity.findAll", query="SELECT b FROM BuildEntity b")
public class BuildEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;

	private String name;

	private String notes;

	@Column(name="TOTAL_PRICE")
	private double totalPrice;

	//bi-directional many-to-one association to BuildComponentEntity
	@OneToMany(mappedBy="build")
	private List<BuildComponentEntity> buildsComponents;

	//bi-directional many-to-one association to UserEntity
	@ManyToOne
	private UserEntity user;

	//bi-directional many-to-one association to Post
	@OneToMany(mappedBy="build")
	private List<Post> posts;

	public BuildEntity() {
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

	public List<Post> getPosts() {
		return this.posts;
	}

	public void setPosts(List<Post> posts) {
		this.posts = posts;
	}

	public Post addPost(Post post) {
		getPosts().add(post);
		post.setBuild(this);

		return post;
	}

	public Post removePost(Post post) {
		getPosts().remove(post);
		post.setBuild(null);

		return post;
	}

}