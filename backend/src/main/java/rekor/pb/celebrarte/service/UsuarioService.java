package rekor.pb.celebrarte.service;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import rekor.pb.celebrarte.dto.UsuarioDto;
import rekor.pb.celebrarte.entity.Usuario;
import rekor.pb.celebrarte.repository.UsuarioRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UsuarioService {
    private UsuarioRepository userRepository;

    public UsuarioService(UsuarioRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<Usuario> listar(){
        return userRepository.findAll();
    }

    public Usuario buscar(UUID id){
        return userRepository.findById(id).orElse(null);
    }

    public void salvar(UsuarioDto dto){
        Usuario usuario = new Usuario();
        BeanUtils.copyProperties(dto, usuario);
        usuario.setCreatedAt(LocalDateTime.now());
        userRepository.save(usuario);
    }

    public void deletar(UUID id){
        userRepository.deleteById(id);
    }
}
