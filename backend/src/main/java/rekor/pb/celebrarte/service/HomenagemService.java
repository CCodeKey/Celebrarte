package rekor.pb.celebrarte.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import rekor.pb.celebrarte.dto.HomenagemDto;
import rekor.pb.celebrarte.dto.MuralDto;
import rekor.pb.celebrarte.entity.Celebracao;
import rekor.pb.celebrarte.entity.Homenagem;
import rekor.pb.celebrarte.repository.CelebracaoRepository;
import rekor.pb.celebrarte.repository.HomenagemRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class HomenagemService {
    private static final int LIMITE_MENSAGEM = 2000;

    private HomenagemRepository homenagemRepository;
    private CelebracaoRepository celebracaoRepository;

    public HomenagemService(HomenagemRepository homenagemRepository, CelebracaoRepository celebracaoRepository) {
        this.homenagemRepository = homenagemRepository;
        this.celebracaoRepository = celebracaoRepository;
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

    // RF-13 a RF-16
    public HomenagemDto enviar(String tokenContribuicao, HomenagemDto dto){
        Celebracao celebracao = buscarPorTokenContribuicao(tokenContribuicao);

        // RN-33: envios encerrados dois dias após o aniversário
        if (LocalDateTime.now().isAfter(celebracao.getDataEncerramento())) {
            throw new ResponseStatusException(HttpStatus.GONE, "O envio de homenagens para esta celebração foi encerrado");
        }

        String mensagem = dto.getMensagem() == null || dto.getMensagem().isBlank() ? null : dto.getMensagem().trim();
        String imagemUrl = dto.getImagemUrl() == null || dto.getImagemUrl().isBlank() ? null : dto.getImagemUrl().trim();

        // RN-11: pelo menos uma mensagem ou uma imagem
        if (mensagem == null && imagemUrl == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A homenagem deve possuir uma mensagem ou uma imagem");
        }
        // RN-37: limite de 2.000 caracteres
        if (mensagem != null && mensagem.length() > LIMITE_MENSAGEM) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A mensagem deve ter no máximo 2.000 caracteres");
        }

        Homenagem homenagem = new Homenagem();
        homenagem.setCelebracao(celebracao);
        homenagem.setMensagem(mensagem);
        homenagem.setImagemUrl(imagemUrl);
        homenagem.setCreatedAt(LocalDateTime.now());
        return toDto(homenagemRepository.save(homenagem));
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

    private HomenagemDto toDto(Homenagem homenagem){
        HomenagemDto dto = new HomenagemDto();
        dto.setId(homenagem.getId());
        dto.setMensagem(homenagem.getMensagem());
        dto.setImagemUrl(homenagem.getImagemUrl());
        dto.setCreatedAt(homenagem.getCreatedAt());
        return dto;
    }
}
