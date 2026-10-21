package rekor.pb.celebrarte.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import rekor.pb.celebrarte.dto.CelebracaoDto;
import rekor.pb.celebrarte.entity.Celebracao;
import rekor.pb.celebrarte.entity.Usuario;
import rekor.pb.celebrarte.repository.CelebracaoRepository;
import rekor.pb.celebrarte.repository.UsuarioRepository;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class CelebracaoService {
    private static final SecureRandom RANDOM = new SecureRandom();

    private CelebracaoRepository celebracaoRepository;
    private UsuarioRepository usuarioRepository;

    public CelebracaoService(CelebracaoRepository celebracaoRepository, UsuarioRepository usuarioRepository) {
        this.celebracaoRepository = celebracaoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<CelebracaoDto> listarPorUsuario(UUID usuarioId){
        return celebracaoRepository.findByUsuarioIdOrderByDataCelebracaoDesc(usuarioId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public CelebracaoDto buscar(UUID id, UUID usuarioId){
        return toDto(buscarEntidade(id, usuarioId));
    }

    public CelebracaoDto salvar(CelebracaoDto dto, UUID usuarioId){
        validar(dto);

        // RN-01 / RN-06: o responsável é sempre o usuário logado; o usuarioId do corpo é ignorado
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        Celebracao celebracao = new Celebracao();
        celebracao.setUsuario(usuario);
        celebracao.setNomeAniversariante(dto.getNomeAniversariante().trim());
        celebracao.setDataCelebracao(dto.getDataCelebracao());

        // RN-07 / RN-08: identificadores públicos exclusivos
        celebracao.setTokenContribuicao(gerarTokenUnico());
        celebracao.setTokenMural(gerarTokenUnico());

        celebracao.setCreatedAt(LocalDateTime.now());
        return toDto(celebracaoRepository.save(celebracao));
    }

    // RN-31: o responsável pode alterar os dados da celebração
    public CelebracaoDto atualizar(UUID id, CelebracaoDto dto, UUID usuarioId){
        validar(dto);

        Celebracao celebracao = buscarEntidade(id, usuarioId);
        celebracao.setNomeAniversariante(dto.getNomeAniversariante().trim());
        celebracao.setDataCelebracao(dto.getDataCelebracao());
        celebracao.setUpdatedAt(LocalDateTime.now());
        return toDto(celebracaoRepository.save(celebracao));
    }

    // RN-32: o responsável pode excluir a celebração (homenagens são removidas em cascata)
    public void deletar(UUID id, UUID usuarioId){
        celebracaoRepository.delete(buscarEntidade(id, usuarioId));
    }

    // RN-03: só encontra a celebração se ela pertencer ao usuário. A de outra pessoa
    // responde 404, igual a uma inexistente, para não revelar que ela existe.
    Celebracao buscarEntidade(UUID id, UUID usuarioId){
        return celebracaoRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Celebração não encontrada"));
    }

    // RN-05: uma celebração deve possuir, no mínimo, um aniversariante e uma data
    private void validar(CelebracaoDto dto){
        if (dto.getNomeAniversariante() == null || dto.getNomeAniversariante().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome do aniversariante é obrigatório");
        }
        if (dto.getNomeAniversariante().trim().length() > 255) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome do aniversariante deve ter no máximo 255 caracteres");
        }
        if (dto.getDataCelebracao() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Data da celebração é obrigatória");
        }
    }

    // Token aleatório e seguro para URL; não pode coincidir com nenhum token já usado
    private String gerarTokenUnico(){
        String token;
        do {
            byte[] bytes = new byte[24];
            RANDOM.nextBytes(bytes);
            token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        } while (celebracaoRepository.existsByTokenContribuicaoOrTokenMural(token, token));
        return token;
    }

    private CelebracaoDto toDto(Celebracao celebracao){
        CelebracaoDto dto = new CelebracaoDto();
        dto.setId(celebracao.getId());
        dto.setUsuarioId(celebracao.getUsuario().getId());
        dto.setNomeAniversariante(celebracao.getNomeAniversariante());
        dto.setDataCelebracao(celebracao.getDataCelebracao());
        dto.setDataEncerramento(celebracao.getDataEncerramento());
        dto.setTokenContribuicao(celebracao.getTokenContribuicao());
        dto.setTokenMural(celebracao.getTokenMural());
        return dto;
    }
}
