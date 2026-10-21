package rekor.pb.celebrarte.service;

import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import rekor.pb.celebrarte.dto.UsuarioDto;
import rekor.pb.celebrarte.entity.Usuario;
import rekor.pb.celebrarte.repository.UsuarioRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UsuarioService {
    private UsuarioRepository userRepository;
    private PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UsuarioDto> listar(){
        return userRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    public UsuarioDto buscar(UUID id){
        return toDto(buscarEntidade(id));
    }

    public void salvar(UsuarioDto dto){
        Usuario usuario = new Usuario();
        BeanUtils.copyProperties(dto, usuario);
        // Só o hash da senha é salvo no banco
        usuario.setSenhaHash(passwordEncoder.encode(dto.getSenha()));
        usuario.setCreatedAt(LocalDateTime.now());
        userRepository.save(usuario);
    }

    public UsuarioDto atualizar(UUID id, UsuarioDto dto){
        Usuario usuario = buscarEntidade(id);
        usuario.setNome(dto.getNome());
        // A senha só é trocada quando enviada
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            usuario.setSenhaHash(passwordEncoder.encode(dto.getSenha()));
        }
        usuario.setUpdatedAt(LocalDateTime.now());
        return toDto(userRepository.save(usuario));
    }

    public void deletar(UUID id){
        userRepository.deleteById(id);
    }

    private Usuario buscarEntidade(UUID id){
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    // A senha fica de fora: a resposta nunca expõe o hash
    private UsuarioDto toDto(Usuario usuario){
        UsuarioDto dto = new UsuarioDto();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        return dto;
    }
}
