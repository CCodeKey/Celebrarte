package rekor.pb.celebrarte.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rekor.pb.celebrarte.dto.CelebracaoDto;
import rekor.pb.celebrarte.dto.HomenagemDto;
import rekor.pb.celebrarte.service.CelebracaoService;
import rekor.pb.celebrarte.service.HomenagemService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("celebracao")
public class CelebracaoController {
    private CelebracaoService celebracaoService;
    private HomenagemService homenagemService;

    public CelebracaoController(CelebracaoService celebracaoService, HomenagemService homenagemService) {
        this.celebracaoService = celebracaoService;
        this.homenagemService = homenagemService;
    }

    @GetMapping("u/{usuarioId}")
    public ResponseEntity<List<CelebracaoDto>> listarCelebracoes(@PathVariable("usuarioId") UUID usuarioId) {
        return ResponseEntity.ok(celebracaoService.listarPorUsuario(usuarioId));
    }

    @GetMapping("f/{id}")
    public ResponseEntity<CelebracaoDto> buscarCelebracao(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(celebracaoService.buscar(id));
    }

    @GetMapping("{id}/h")
    public ResponseEntity<List<HomenagemDto>> listarHomenagens(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(homenagemService.listarPorCelebracao(id));
    }

    @PostMapping("n")
    public ResponseEntity<CelebracaoDto> newCelebracao(@RequestBody CelebracaoDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(celebracaoService.salvar(dto));
    }

    @PutMapping("e/{id}")
    public ResponseEntity<CelebracaoDto> editarCelebracao(@PathVariable("id") UUID id, @RequestBody CelebracaoDto dto) {
        return ResponseEntity.ok(celebracaoService.atualizar(id, dto));
    }

    @DeleteMapping("r/{id}")
    public ResponseEntity<Void> deletarCelebracao(@PathVariable("id") UUID id) {
        celebracaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
