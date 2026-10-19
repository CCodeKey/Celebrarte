package rekor.pb.celebrarte.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rekor.pb.celebrarte.entity.Homenagem;

import java.util.List;
import java.util.UUID;

@Repository
public interface HomenagemRepository extends JpaRepository<Homenagem, UUID> {
    List<Homenagem> findByCelebracaoIdOrderByCreatedAtAsc(UUID celebracaoId);
}
