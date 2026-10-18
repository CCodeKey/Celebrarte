package rekor.pb.celebrarte.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rekor.pb.celebrarte.entity.Usuario;

import java.util.UUID;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
}
