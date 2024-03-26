package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence;

import java.io.Serializable;
import java.util.List;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;


/**
 * The persistent class for the USERS database table.
 * 
 */
@Entity
@Table(name="USERS")
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

	@JsonIgnore
	@ManyToMany
	@JoinTable(
			name = "BLOCKED",
			joinColumns = @JoinColumn(name = "USER_WHO_BLOCKED_ID"),
			inverseJoinColumns = @JoinColumn(name = "USER_BLOCKED_ID")
	)
	private List<UserEntity> blockedUsers;

	//bi-directional many-to-one association to BuildEntity
	@JsonIgnore
	@OneToMany(mappedBy="user")
	private List<BuildEntity> builds;

	//bi-directional many-to-one association to Post
	@JsonIgnore
	@OneToMany(mappedBy="user")
	private List<PostEntity> postsMade;

	//bi-directional many-to-many association to Post
	@JsonIgnore
	@ManyToMany(mappedBy="usersWhoLiked")
	private List<PostEntity> likedPosts;

	@JsonIgnore
	@OneToMany(mappedBy = "user")
	private List<ComponentEntity> componentsCreated;

	@ManyToMany
	@JoinTable(
			name = "WISHLIST",
			joinColumns = @JoinColumn(name = "USER_ID"),
			inverseJoinColumns = @JoinColumn(name = "COMPONENT_ID")
	)
	private List<ComponentEntity> componentsWanted;

	@JsonIgnore
	@OneToMany(mappedBy = "groupAdmin")
	private List<GroupChatEntity> groupChatsAdmin;

	@JsonIgnore
	@ManyToMany(mappedBy = "users")
	private List<GroupChatEntity> groupChats;

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

	public List<UserEntity> getBlockedUsers() {
		return blockedUsers;
	}

	public void setBlockedUsers(List<UserEntity> blockedUsers) {
		this.blockedUsers = blockedUsers;
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

	public List<ComponentEntity> getComponentsCreated() {
		return componentsCreated;
	}

	public void setComponentsCreated(List<ComponentEntity> componentsCreated) {
		this.componentsCreated = componentsCreated;
	}

	public List<ComponentEntity> getComponentsWanted() {
		return componentsWanted;
	}

	public void setComponentsWanted(List<ComponentEntity> componentsWanted) {
		this.componentsWanted = componentsWanted;
	}
}