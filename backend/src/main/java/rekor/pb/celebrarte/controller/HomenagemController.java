package rekor.pb.celebrarte.controller;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import rekor.pb.celebrarte.config.UsuarioLogado;
import rekor.pb.celebrarte.dto.HomenagemDto;
import rekor.pb.celebrarte.dto.HomenagemEnviadaDto;
import rekor.pb.celebrarte.dto.ImagemDto;
import rekor.pb.celebrarte.dto.MuralDto;
import rekor.pb.celebrarte.service.HomenagemService;

import java.time.Duration;
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

    // Imagem só por link (ou sem imagem)
    @PostMapping(value = "c/{token}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<HomenagemEnviadaDto> enviarHomenagem(@PathVariable("token") String token, @RequestBody HomenagemDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(homenagemService.enviar(token, dto.getMensagem(), dto.getImagemUrl(), null));
    }

    // Imagem por upload (campo "imagem") ou por link (campo "imagemUrl")
    @PostMapping(value = "c/{token}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<HomenagemEnviadaDto> enviarHomenagemComArquivo(@PathVariable("token") String token,
            @RequestParam(value = "mensagem", required = false) String mensagem,
            @RequestParam(value = "imagemUrl", required = false) String imagemUrl,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(homenagemService.enviar(token, mensagem, imagemUrl, imagem));
    }

    // Rota pública: devolve o arquivo da imagem enviada por upload
    @GetMapping("i/{id}")
    public ResponseEntity<byte[]> buscarImagem(@PathVariable("id") UUID id) {
        ImagemDto imagem = homenagemService.buscarImagem(id);
        // A imagem de uma homenagem não muda, então o navegador pode guardá-la em cache
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(imagem.getTipo()))
                .cacheControl(CacheControl.maxAge(Duration.ofDays(7)).cachePublic())
                .body(imagem.getDados());
    }

    @DeleteMapping("r/{id}")
    public ResponseEntity<Void> deletarHomenagem(@PathVariable("id") UUID id, @UsuarioLogado UUID usuarioId) {
        homenagemService.deletar(id, usuarioId);
        return ResponseEntity.noContent().build();
    }
}
