package rekor.pb.celebrarte.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "celebracao")
public class Celebracao {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Usuario usuario;

    @Column(name = "nome_aniversariante", nullable = false)
    private String nomeAniversariante;

    @Column(name = "data_celebracao", nullable = false)
    private LocalDateTime dataCelebracao;

    @Column(name = "token_contribuicao", nullable = false, unique = true, columnDefinition = "TEXT")
    private String tokenContribuicao;

    @Column(name = "token_mural", nullable = false, unique = true, columnDefinition = "TEXT")
    private String tokenMural;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Celebracao() {}

    public UUID getId() {
        return id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // RN-33: envios aceitos até dois dias após a data do aniversário
    public LocalDateTime getDataEncerramento() {
        return dataCelebracao.plusDays(2);
    }

    @Override
    public String toString() {
        return "Celebracao{" +
                "id=" + id +
                ", nomeAniversariante='" + nomeAniversariante + '\'' +
                ", dataCelebracao=" + dataCelebracao +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
