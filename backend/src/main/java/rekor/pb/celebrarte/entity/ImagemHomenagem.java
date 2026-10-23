package rekor.pb.celebrarte.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.UUID;

// Arquivo da imagem enviada por upload. Fica em tabela separada para que listar
// homenagens (mural, área administrativa) não carregue os bytes (RNF-08)
@Entity
@Table(name = "imagem_homenagem")
public class ImagemHomenagem {
    // Mesmo id da homenagem
    @Id
    private UUID id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "homenagem_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Homenagem homenagem;

    @Column(nullable = false)
    private byte[] dados;

    public ImagemHomenagem() {}

    public ImagemHomenagem(Homenagem homenagem, byte[] dados) {
        this.homenagem = homenagem;
        this.dados = dados;
    }

    public UUID getId() {
        return id;
    }

    public Homenagem getHomenagem() {
        return homenagem;
    }

    public byte[] getDados() {
        return dados;
    }
}
