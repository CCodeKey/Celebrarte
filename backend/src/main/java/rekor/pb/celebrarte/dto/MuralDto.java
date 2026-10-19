package rekor.pb.celebrarte.dto;

import java.time.LocalDateTime;
import java.util.List;

public class MuralDto {
    private String nomeAniversariante;
    private LocalDateTime dataCelebracao;
    private List<HomenagemDto> homenagens;

    public MuralDto(){}

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

    public List<HomenagemDto> getHomenagens() {
        return homenagens;
    }

    public void setHomenagens(List<HomenagemDto> homenagens) {
        this.homenagens = homenagens;
    }
}
