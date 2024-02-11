package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;


/**
 * The persistent class for the users database table.
 * 
 */
@Entity
@Table(name="users")
@NamedQuery(name="UserEntity.findAll", query="SELECT u FROM UserEntity u")
public class UserEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;

	private byte active;

	private String email;

	private String hash;

	private String nick;

	private String password;

	private String picture;

	private String role;

	//bi-directional many-to-many association to UserEntity
	@JsonIgnore
	@ManyToMany
	@JoinTable(
			name = "FRIENDS",
			joinColumns = @JoinColumn(name = "USER_ID1"),
			inverseJoinColumns = @JoinColumn(name = "USER_ID2")
	)
	private List<UserEntity> friends;

	//bi-directional many-to-one association to BuildEntity
	@OneToMany(mappedBy="user")
	private List<BuildEntity> builds;

	//bi-directional many-to-one association to Post
	@OneToMany(mappedBy="user")
	private List<PostEntity> postsMade;

	//bi-directional many-to-many association to Post
	@ManyToMany(mappedBy="users")
	private List<PostEntity> likedPosts;

	public UserEntity() {
	}

	public long getId() {
		return this.id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public byte getActive() {
		return this.active;
	}

	public void setActive(byte active) {
		this.active = active;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getHash() {
		return this.hash;
	}

	public void setHash(String hash) {
		this.hash = hash;
	}

	public String getNick() {
		return this.nick;
	}

	public void setNick(String nick) {
		this.nick = nick;
	}

	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPicture() {
		return this.picture;
	}

	public void setPicture(String picture) {
		this.picture = picture;
	}

	public String getRole() {
		return this.role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public List<UserEntity> getFriends() {
		return friends;
	}

	public void setFriends(List<UserEntity> friends) {
		this.friends = friends;
	}

	public List<BuildEntity> getBuilds() {
		return this.builds;
	}

	public void setBuilds(List<BuildEntity> builds) {
		this.builds = builds;
	}

	public BuildEntity addBuild(BuildEntity build) {
		getBuilds().add(build);
		build.setUser(this);

		return build;
	}

	public BuildEntity removeBuild(BuildEntity build) {
		getBuilds().remove(build);
		build.setUser(null);

		return build;
	}

	public List<PostEntity> getPostsMade() {
		return this.postsMade;
	}

	public void setPostsMade(List<PostEntity> postsMade) {
		this.postsMade = postsMade;
	}

	public PostEntity addPosts1(PostEntity posts1) {
		getPostsMade().add(posts1);
		posts1.setUser(this);

		return posts1;
	}

	public PostEntity removePosts1(PostEntity posts1) {
		getPostsMade().remove(posts1);
		posts1.setUser(null);

		return posts1;
	}

	public List<PostEntity> getLikedPosts() {
		return this.likedPosts;
	}

	public void setLikedPosts(List<PostEntity> likedPosts) {
		this.likedPosts = likedPosts;
	}

}