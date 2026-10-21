package rekor.pb.celebrarte.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import rekor.pb.celebrarte.entity.Usuario;
import rekor.pb.celebrarte.repository.UsuarioRepository;

// Usado pelo Spring Security no login: o e-mail é o "username"
@Service
public class UsuarioDetailsService implements UserDetailsService {
    private UsuarioRepository userRepository;

    public UsuarioDetailsService(UsuarioRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = userRepository.findByEmail(email)
                .filter(u -> u.getDeletedAt() == null)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        return User.withUsername(usuario.getEmail())
                .password(usuario.getSenhaHash())
                .build();
    }
}
