package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.UserEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IUserEntityRepository extends JpaRepository<UserEntity, Long> {

    @Modifying
    @Query(value = "DELETE FROM BLOCKED b WHERE b.USER_BLOCKED_ID = :id OR b.USER_WHO_BLOCKED_ID = :id", nativeQuery = true)
    void deleteBlocked(@Param("id") Long id);

    @Modifying
    @Query(value = "DELETE FROM FRIENDS f WHERE f.USER_ID1 = :id OR f.USER_ID2 = :id", nativeQuery = true)
    void deleteFriends(@Param("id") Long id);

    @Modifying
    @Query(value = "DELETE FROM WISHLIST w WHERE w.USER_ID = :id", nativeQuery = true)
    void deleteWishlist(@Param("id") Long id);

    @Modifying
    @Query(value = "DELETE FROM LIKES l WHERE l.USER_ID = :id", nativeQuery = true)
    void deleteLikes(@Param("id") Long id);

    @Modifying
    @Query(value = "DELETE FROM GROUP_CHATS_USERS gcu WHERE gcu.USER_ID = :id", nativeQuery = true)
    void deleteGroupChatsUsers(@Param("id") Long id);

    @Query(value = "SELECT * FROM USERS u WHERE u.NICK = :nick", nativeQuery = true)
    UserEntity findByNick(@Param("nick") String nick);

    @Query(value = "SELECT * FROM USERS u WHERE u.EMAIL = :email", nativeQuery = true)
    UserEntity findByEmail(@Param("email") String email);

    @Query(value = "SELECT * FROM USERS u WHERE u.ROLE = :role", nativeQuery = true)
    List<UserEntity> findByRole(@Param("role") String role);
}