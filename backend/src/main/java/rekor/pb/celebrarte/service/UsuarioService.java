package rekor.pb.celebrarte.service;

import org.springframework.stereotype.Service;
import rekor.pb.celebrarte.entity.Usuario;
import rekor.pb.celebrarte.repository.UsuarioRepository;

import java.util.List;

@Service
public class UsuarioService {
    private UsuarioRepository userRepository;

    public UsuarioService(UsuarioRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<Usuario> listar(){
        return userRepository.findAll();
    }
}
