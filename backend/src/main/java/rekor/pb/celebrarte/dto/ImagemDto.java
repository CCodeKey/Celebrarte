package rekor.pb.celebrarte.dto;

// Conteúdo de uma imagem enviada por upload, devolvido como arquivo pela API
public class ImagemDto {
    private byte[] dados;
    private String tipo;

    public ImagemDto(byte[] dados, String tipo) {
        this.dados = dados;
        this.tipo = tipo;
    }

    public byte[] getDados() {
        return dados;
    }

    public String getTipo() {
        return tipo;
    }
}
