package rekor.pb.celebrarte.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rekor.pb.celebrarte.entity.Celebracao;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CelebracaoRepository extends JpaRepository<Celebracao, UUID> {
    List<Celebracao> findByUsuarioIdOrderByDataCelebracaoDesc(UUID usuarioId);
    Optional<Celebracao> findByIdAndUsuarioId(UUID id, UUID usuarioId);
    boolean existsByIdAndUsuarioId(UUID id, UUID usuarioId);

    Optional<Celebracao> findByTokenContribuicao(String tokenContribuicao);

    Optional<Celebracao> findByTokenMural(String tokenMural);

    boolean existsByTokenContribuicaoOrTokenMural(String tokenContribuicao, String tokenMural);
}
