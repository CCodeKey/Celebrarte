package rekor.pb.celebrarte.dto;

// Resposta do envio de homenagem: inclui o token do mural para o convidado ver o resultado.
// Só é entregue depois de um envio válido; o formulário de contribuição não expõe o mural
public class HomenagemEnviadaDto extends HomenagemDto {
    private String tokenMural;

    public HomenagemEnviadaDto(){}

    public String getTokenMural() {
        return tokenMural;
    }

    public void setTokenMural(String tokenMural) {
        this.tokenMural = tokenMural;
    }
}
