package rekor.pb.celebrarte.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rekor.pb.celebrarte.config.UsuarioLogado;
import rekor.pb.celebrarte.dto.CelebracaoDto;
import rekor.pb.celebrarte.dto.HomenagemDto;
import rekor.pb.celebrarte.service.CelebracaoService;
import rekor.pb.celebrarte.service.HomenagemService;

import java.util.List;
import java.util.UUID;

// Todas as rotas atuam só sobre as celebrações do usuário logado (RN-03)
@RestController
@RequestMapping("celebracao")
public class CelebracaoController {
    private CelebracaoService celebracaoService;
    private HomenagemService homenagemService;

    public CelebracaoController(CelebracaoService celebracaoService, HomenagemService homenagemService) {
        this.celebracaoService = celebracaoService;
        this.homenagemService = homenagemService;
    }

    @GetMapping
    public ResponseEntity<List<CelebracaoDto>> listarCelebracoes(@UsuarioLogado UUID usuarioId) {
        return ResponseEntity.ok(celebracaoService.listarPorUsuario(usuarioId));
    }

    @GetMapping("f/{id}")
    public ResponseEntity<CelebracaoDto> buscarCelebracao(@PathVariable("id") UUID id, @UsuarioLogado UUID usuarioId) {
        return ResponseEntity.ok(celebracaoService.buscar(id, usuarioId));
    }

    @GetMapping("{id}/h")
    public ResponseEntity<List<HomenagemDto>> listarHomenagens(@PathVariable("id") UUID id, @UsuarioLogado UUID usuarioId) {
        return ResponseEntity.ok(homenagemService.listarPorCelebracao(id, usuarioId));
    }

    @PostMapping("n")
    public ResponseEntity<CelebracaoDto> newCelebracao(@RequestBody CelebracaoDto dto, @UsuarioLogado UUID usuarioId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(celebracaoService.salvar(dto, usuarioId));
    }

    @PutMapping("e/{id}")
    public ResponseEntity<CelebracaoDto> editarCelebracao(@PathVariable("id") UUID id, @RequestBody CelebracaoDto dto,
                                                          @UsuarioLogado UUID usuarioId) {
        return ResponseEntity.ok(celebracaoService.atualizar(id, dto, usuarioId));
    }

    @DeleteMapping("r/{id}")
    public ResponseEntity<Void> deletarCelebracao(@PathVariable("id") UUID id, @UsuarioLogado UUID usuarioId) {
        celebracaoService.deletar(id, usuarioId);
        return ResponseEntity.noContent().build();
    }
}
