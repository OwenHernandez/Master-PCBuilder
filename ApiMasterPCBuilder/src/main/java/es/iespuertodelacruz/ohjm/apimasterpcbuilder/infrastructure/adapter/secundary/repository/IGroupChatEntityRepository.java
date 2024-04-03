package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.GroupChatEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IGroupChatEntityRepository extends JpaRepository<GroupChatEntity, Long> {

    @Query(value = "SELECT * FROM GROUP_CHATS gc WHERE gc.NAME = :name", nativeQuery = true)
    List<GroupChatEntity> findByName(@Param("name") String name);

    @Query(value = "SELECT gc.* FROM GROUP_CHATS gc JOIN GROUP_CHATS_USERS gcu ON gc.ID = gcu.GROUP_CHAT_ID WHERE gcu.USER_ID = :userId", nativeQuery = true)
    List<GroupChatEntity> findByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT * FROM GROUP_CHATS gc WHERE gc.GROUP_ADMIN_ID = :adminId", nativeQuery = true)
    List<GroupChatEntity> findByAdminId(@Param("adminId") Long adminId);
}
