package rekor.pb.celebrarte.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rekor.pb.celebrarte.config.UsuarioLogado;
import rekor.pb.celebrarte.dto.HomenagemDto;
import rekor.pb.celebrarte.dto.MuralDto;
import rekor.pb.celebrarte.service.HomenagemService;

import java.util.UUID;

@RestController
@RequestMapping("homenagem")
public class HomenagemController {
    private HomenagemService homenagemService;

    public HomenagemController(HomenagemService homenagemService) {
        this.homenagemService = homenagemService;
    }

    @GetMapping("c/{token}")
    public ResponseEntity<MuralDto> buscarFormulario(@PathVariable("token") String token) {
        return ResponseEntity.ok(homenagemService.buscarFormulario(token));
    }

    @PostMapping("c/{token}")
    public ResponseEntity<HomenagemDto> enviarHomenagem(@PathVariable("token") String token, @RequestBody HomenagemDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(homenagemService.enviar(token, dto));
    }

    @DeleteMapping("r/{id}")
    public ResponseEntity<Void> deletarHomenagem(@PathVariable("id") UUID id, @UsuarioLogado UUID usuarioId) {
        homenagemService.deletar(id, usuarioId);
        return ResponseEntity.noContent().build();
    }
}
