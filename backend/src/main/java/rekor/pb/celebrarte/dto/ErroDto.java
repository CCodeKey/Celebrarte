package rekor.pb.celebrarte.dto;

import java.time.Instant;

// Corpo padrão de todas as respostas de erro da API
public class ErroDto {
    private Instant timestamp;
    private int status;
    private String erro;
    private String mensagem;
    private String path;

    public ErroDto(){}

    public ErroDto(int status, String erro, String mensagem, String path) {
        this.timestamp = Instant.now();
        this.status = status;
        this.erro = erro;
        this.mensagem = mensagem;
        this.path = path;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getErro() {
        return erro;
    }

    public void setErro(String erro) {
        this.erro = erro;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
