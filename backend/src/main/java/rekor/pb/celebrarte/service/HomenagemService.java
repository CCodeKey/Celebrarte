package rekor.pb.celebrarte.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import rekor.pb.celebrarte.dto.HomenagemDto;
import rekor.pb.celebrarte.dto.HomenagemEnviadaDto;
import rekor.pb.celebrarte.dto.ImagemDto;
import rekor.pb.celebrarte.dto.MuralDto;
import rekor.pb.celebrarte.entity.Celebracao;
import rekor.pb.celebrarte.entity.Homenagem;
import rekor.pb.celebrarte.entity.ImagemHomenagem;
import rekor.pb.celebrarte.repository.CelebracaoRepository;
import rekor.pb.celebrarte.repository.HomenagemRepository;
import rekor.pb.celebrarte.repository.ImagemHomenagemRepository;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class HomenagemService {
    private static final int LIMITE_MENSAGEM = 2000;
    private static final long LIMITE_IMAGEM_BYTES = 5 * 1024 * 1024;

    private HomenagemRepository homenagemRepository;
    private CelebracaoRepository celebracaoRepository;
    private ImagemHomenagemRepository imagemHomenagemRepository;

    public HomenagemService(HomenagemRepository homenagemRepository, CelebracaoRepository celebracaoRepository,
                            ImagemHomenagemRepository imagemHomenagemRepository) {
        this.homenagemRepository = homenagemRepository;
        this.celebracaoRepository = celebracaoRepository;
        this.imagemHomenagemRepository = imagemHomenagemRepository;
    }

    // RF-11: homenagens recebidas, visão administrativa
    public List<HomenagemDto> listarPorCelebracao(UUID celebracaoId, UUID usuarioId){
        // RN-03: só o responsável pela celebração vê a lista administrativa
        if (!celebracaoRepository.existsByIdAndUsuarioId(celebracaoId, usuarioId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Celebração não encontrada");
        }
        return listarDtos(celebracaoId);
    }

    // RF-12: dados mínimos para o formulário público de contribuição
    public MuralDto buscarFormulario(String tokenContribuicao){
        Celebracao celebracao = buscarPorTokenContribuicao(tokenContribuicao);

        MuralDto dto = new MuralDto();
        dto.setNomeAniversariante(celebracao.getNomeAniversariante());
        dto.setDataCelebracao(celebracao.getDataCelebracao());
        return dto;
    }

    // RF-13 a RF-16. A imagem vem como link (imagemUrl) ou como arquivo (upload), nunca os dois
    @Transactional
    public HomenagemEnviadaDto enviar(String tokenContribuicao, String mensagemEnviada, String imagemUrlEnviada,
                               MultipartFile arquivo){
        Celebracao celebracao = buscarPorTokenContribuicao(tokenContribuicao);

        // RN-33: envios encerrados dois dias após o aniversário
        if (LocalDateTime.now().isAfter(celebracao.getDataEncerramento())) {
            throw new ResponseStatusException(HttpStatus.GONE, "O envio de homenagens para esta celebração foi encerrado");
        }

        String mensagem = mensagemEnviada == null || mensagemEnviada.isBlank() ? null : mensagemEnviada.trim();
        String imagemUrl = imagemUrlEnviada == null || imagemUrlEnviada.isBlank() ? null : imagemUrlEnviada.trim();
        boolean temArquivo = arquivo != null && !arquivo.isEmpty();

        // RN-11: pelo menos uma mensagem ou uma imagem
        if (mensagem == null && imagemUrl == null && !temArquivo) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A homenagem deve possuir uma mensagem ou uma imagem");
        }
        // RN-36: uma única imagem por homenagem
        if (imagemUrl != null && temArquivo) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Envie a imagem por arquivo ou por link, não os dois");
        }
        // RN-37: limite de 2.000 caracteres
        if (mensagem != null && mensagem.length() > LIMITE_MENSAGEM) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A mensagem deve ter no máximo 2.000 caracteres");
        }

        byte[] dados = null;
        String tipo = null;
        if (temArquivo) {
            dados = lerArquivo(arquivo);
            tipo = detectarTipo(dados);
        }

        Homenagem homenagem = new Homenagem();
        homenagem.setCelebracao(celebracao);
        homenagem.setMensagem(mensagem);
        homenagem.setImagemUrl(imagemUrl);
        homenagem.setImagemTipo(tipo);
        homenagem.setCreatedAt(LocalDateTime.now());
        homenagem = homenagemRepository.save(homenagem);

        if (dados != null) {
            imagemHomenagemRepository.save(new ImagemHomenagem(homenagem, dados));
        }
        HomenagemEnviadaDto resposta = preencherDto(new HomenagemEnviadaDto(), homenagem);
        resposta.setTokenMural(celebracao.getTokenMural());
        return resposta;
    }

    // Arquivo da imagem enviada por upload. Público: o id só aparece no mural e na área administrativa
    public ImagemDto buscarImagem(UUID homenagemId){
        Homenagem homenagem = homenagemRepository.findById(homenagemId)
                .filter(h -> h.getImagemTipo() != null)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Imagem não encontrada"));
        ImagemHomenagem imagem = imagemHomenagemRepository.findById(homenagemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Imagem não encontrada"));
        return new ImagemDto(imagem.getDados(), homenagem.getImagemTipo());
    }

    // RF-17 a RF-21 / RN-34: homenagens publicadas imediatamente no mural
    public MuralDto buscarMural(String tokenMural){
        Celebracao celebracao = celebracaoRepository.findByTokenMural(tokenMural)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mural não encontrado"));

        MuralDto dto = new MuralDto();
        dto.setNomeAniversariante(celebracao.getNomeAniversariante());
        dto.setDataCelebracao(celebracao.getDataCelebracao());
        dto.setHomenagens(listarDtos(celebracao.getId()));
        return dto;
    }

    // RN-30: o responsável pode excluir uma homenagem
    public void deletar(UUID id, UUID usuarioId){
        // RN-03: só exclui homenagens de celebrações do próprio usuário
        if (!homenagemRepository.existsByIdAndCelebracaoUsuarioId(id, usuarioId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Homenagem não encontrada");
        }
        homenagemRepository.deleteById(id);
    }

    private Celebracao buscarPorTokenContribuicao(String tokenContribuicao){
        return celebracaoRepository.findByTokenContribuicao(tokenContribuicao)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Celebração não encontrada"));
    }

    private List<HomenagemDto> listarDtos(UUID celebracaoId){
        return homenagemRepository.findByCelebracaoIdOrderByCreatedAtAsc(celebracaoId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    private byte[] lerArquivo(MultipartFile arquivo){
        // RNF-06: o Spring já recusa acima de spring.servlet.multipart.max-file-size; aqui é a garantia
        if (arquivo.getSize() > LIMITE_IMAGEM_BYTES) {
            throw new ResponseStatusException(HttpStatus.CONTENT_TOO_LARGE, "A imagem deve ter no máximo 5 MB");
        }
        try {
            return arquivo.getBytes();
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não foi possível ler a imagem enviada");
        }
    }

    // RNF-05 e RNF-07: o tipo é identificado pelos primeiros bytes do arquivo, não pelo nome
    // ou pelo Content-Type informados pelo cliente
    private String detectarTipo(byte[] dados){
        if (comecaCom(dados, 0, 0xFF, 0xD8, 0xFF)) {
            return "image/jpeg";
        }
        if (comecaCom(dados, 0, 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A)) {
            return "image/png";
        }
        if (comecaCom(dados, 0, 'R', 'I', 'F', 'F') && comecaCom(dados, 8, 'W', 'E', 'B', 'P')) {
            return "image/webp";
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Formato de imagem não aceito. Use JPEG, PNG ou WEBP");
    }

    private boolean comecaCom(byte[] dados, int inicio, int... assinatura){
        if (dados.length < inicio + assinatura.length) {
            return false;
        }
        for (int i = 0; i < assinatura.length; i++) {
            if ((dados[inicio + i] & 0xFF) != assinatura[i]) {
                return false;
            }
        }
        return true;
    }

    private HomenagemDto toDto(Homenagem homenagem){
        return preencherDto(new HomenagemDto(), homenagem);
    }

    private <T extends HomenagemDto> T preencherDto(T dto, Homenagem homenagem){
        dto.setId(homenagem.getId());
        dto.setMensagem(homenagem.getMensagem());
        // Imagem por upload: devolve o caminho da rota que serve o arquivo, relativo à API
        dto.setImagemUrl(homenagem.getImagemTipo() != null
                ? "/homenagem/i/" + homenagem.getId()
                : homenagem.getImagemUrl());
        dto.setCreatedAt(homenagem.getCreatedAt());
        return dto;
    }
}
