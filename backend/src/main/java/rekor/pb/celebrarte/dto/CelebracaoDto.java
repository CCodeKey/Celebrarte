package rekor.pb.celebrarte.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class CelebracaoDto {
    private UUID id;
    private UUID usuarioId;
    private String nomeAniversariante;
    private LocalDateTime dataCelebracao;
    private LocalDateTime dataEncerramento;
    private String tokenContribuicao;
    private String tokenMural;

    public CelebracaoDto(){}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(UUID usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getNomeAniversariante() {
        return nomeAniversariante;
    }

    public void setNomeAniversariante(String nomeAniversariante) {
        this.nomeAniversariante = nomeAniversariante;
    }

    public LocalDateTime getDataCelebracao() {
        return dataCelebracao;
    }

    public void setDataCelebracao(LocalDateTime dataCelebracao) {
        this.dataCelebracao = dataCelebracao;
    }

    public LocalDateTime getDataEncerramento() {
        return dataEncerramento;
    }

    public void setDataEncerramento(LocalDateTime dataEncerramento) {
        this.dataEncerramento = dataEncerramento;
    }

    public String getTokenContribuicao() {
        return tokenContribuicao;
    }

    public void setTokenContribuicao(String tokenContribuicao) {
        this.tokenContribuicao = tokenContribuicao;
    }

    public String getTokenMural() {
        return tokenMural;
    }

    public void setTokenMural(String tokenMural) {
        this.tokenMural = tokenMural;
    }
}
