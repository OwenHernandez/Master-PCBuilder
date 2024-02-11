package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence;

import java.io.Serializable;
import jakarta.persistence.*;
import java.util.List;


/**
 * The persistent class for the posts database table.
 * 
 */
@Entity
@Table(name="posts")
@NamedQuery(name="Post.findAll", query="SELECT p FROM Post p")
public class PostEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;

	private String description;

	private String image;

	private String title;

	//bi-directional many-to-one association to BuildEntity
	@ManyToOne
	private BuildEntity build;

	//bi-directional many-to-one association to UserEntity
	@ManyToOne
	private UserEntity user;

	//bi-directional many-to-many association to UserEntity
	@ManyToMany
	@JoinTable(
			name = "LIKES",
			joinColumns = @JoinColumn(name = "POST_ID"),
			inverseJoinColumns = @JoinColumn(name = "USER_ID")
	)
	private List<UserEntity> usersWhoLiked;

	public PostEntity() {
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

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public BuildEntity getBuild() {
		return this.build;
	}

	public void setBuild(BuildEntity build) {
		this.build = build;
	}

	public UserEntity getUser() {
		return this.user;
	}

	public void setUser(UserEntity user) {
		this.user = user;
	}

	public List<UserEntity> getUsersWhoLiked() {
		return this.usersWhoLiked;
	}

	public void setUsersWhoLiked(List<UserEntity> usersWhoLiked) {
		this.usersWhoLiked = usersWhoLiked;
	}

}