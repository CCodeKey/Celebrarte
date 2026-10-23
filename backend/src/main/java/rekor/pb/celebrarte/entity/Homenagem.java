package rekor.pb.celebrarte.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "homenagem")
public class Homenagem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "celebracao_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Celebracao celebracao;

    @Column(length = 2000)
    private String mensagem;

    @Column(name = "imagem_url", columnDefinition = "TEXT")
    private String imagemUrl;

    // Tipo (ex.: image/png) da imagem enviada por upload; nulo quando não há arquivo
    @Column(name = "imagem_tipo", length = 20)
    private String imagemTipo;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public Homenagem() {}

    public UUID getId() {
        return id;
    }

    public Celebracao getCelebracao() {
        return celebracao;
    }

    public void setCelebracao(Celebracao celebracao) {
        this.celebracao = celebracao;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    public String getImagemTipo() {
        return imagemTipo;
    }

    public void setImagemTipo(String imagemTipo) {
        this.imagemTipo = imagemTipo;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Homenagem{" +
                "id=" + id +
                ", mensagem='" + mensagem + '\'' +
                ", imagemUrl='" + imagemUrl + '\'' +
                ", imagemTipo='" + imagemTipo + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
