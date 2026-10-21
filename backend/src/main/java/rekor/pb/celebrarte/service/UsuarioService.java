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
import java.util.UUID;

@Service
public class UsuarioService {
    private UsuarioRepository userRepository;
    private PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // RN-03: buscar, atualizar e deletar recebem sempre o id do usuário logado (vindo do token)
    public UsuarioDto buscar(UUID id){
        return toDto(buscarEntidade(id));
    }

    public UsuarioDto salvar(UsuarioDto dto){
        validarNome(dto.getNome());
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "E-mail é obrigatório");
        }
        if (dto.getSenha() == null || dto.getSenha().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha é obrigatória");
        }
        String email = dto.getEmail().trim();
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado");
        }

        Usuario usuario = new Usuario();
        BeanUtils.copyProperties(dto, usuario);
        usuario.setNome(dto.getNome().trim());
        usuario.setEmail(email);
        // Só o hash da senha é salvo no banco
        usuario.setSenhaHash(passwordEncoder.encode(dto.getSenha()));
        usuario.setCreatedAt(LocalDateTime.now());
        return toDto(userRepository.save(usuario));
    }

    public UsuarioDto atualizar(UUID id, UsuarioDto dto){
        validarNome(dto.getNome());
        Usuario usuario = buscarEntidade(id);
        usuario.setNome(dto.getNome().trim());
        // A senha só é trocada quando enviada
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            usuario.setSenhaHash(passwordEncoder.encode(dto.getSenha()));
        }
        usuario.setUpdatedAt(LocalDateTime.now());
        return toDto(userRepository.save(usuario));
    }

    public void deletar(UUID id){
        userRepository.delete(buscarEntidade(id));
    }

    private void validarNome(String nome){
        if (nome == null || nome.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome é obrigatório");
        }
        if (nome.trim().length() > 255) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome deve ter no máximo 255 caracteres");
        }
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
