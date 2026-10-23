package rekor.pb.celebrarte.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rekor.pb.celebrarte.entity.ImagemHomenagem;

import java.util.UUID;

@Repository
public interface ImagemHomenagemRepository extends JpaRepository<ImagemHomenagem, UUID> {
}
