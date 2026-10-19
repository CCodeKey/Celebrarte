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
                ", createdAt=" + createdAt +
                '}';
    }
}
