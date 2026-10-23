package rekor.pb.celebrarte.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

public class UsuarioDto {
    private UUID id;
    private String nome;
    private String email;

    // Senha em texto puro: recebida no corpo da requisição, mas nunca devolvida nas respostas
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String senha;

    public UsuarioDto(){}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
