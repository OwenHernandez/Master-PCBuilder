package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface IUserEntityRepository extends JpaRepository<UserEntity, Integer> {
    @Query(value = "SELECT * FROM usuarios u WHERE u.nick = :nick", nativeQuery = true)
    UserEntity findByNick(@Param("nick") String nick);
}
