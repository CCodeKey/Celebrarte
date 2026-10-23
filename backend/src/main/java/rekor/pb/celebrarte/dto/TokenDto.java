package rekor.pb.celebrarte.dto;

import java.time.Instant;

public class TokenDto {
    private String token;
    private String tipo = "Bearer";
    private Instant expiraEm;

    public TokenDto(){}

    public TokenDto(String token, Instant expiraEm) {
        this.token = token;
        this.expiraEm = expiraEm;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Instant getExpiraEm() {
        return expiraEm;
    }

    public void setExpiraEm(Instant expiraEm) {
        this.expiraEm = expiraEm;
    }
}
