package rekor.pb.celebrarte.dto;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UsuarioDto {
    private UUID id;
    private String nome;
    private String email;
    private String senha_hash;
}
