package rekor.pb.celebrarte.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import rekor.pb.celebrarte.dto.HomenagemDto;
import rekor.pb.celebrarte.dto.MuralDto;
import rekor.pb.celebrarte.service.HomenagemService;

import java.util.UUID;

@RestController
@RequestMapping("h")
public class HomenagemController {
    private HomenagemService homenagemService;

    public HomenagemController(HomenagemService homenagemService) {
        this.homenagemService = homenagemService;
    }

    @GetMapping("c/{token}")
    public MuralDto buscarFormulario(@PathVariable("token") String token) {
        return homenagemService.buscarFormulario(token);
    }

    @PostMapping("c/{token}")
    @ResponseStatus(HttpStatus.CREATED)
    public HomenagemDto enviarHomenagem(@PathVariable("token") String token, @RequestBody HomenagemDto dto) {
        return homenagemService.enviar(token, dto);
    }
    @GetMapping("m/{token}")
    public MuralDto buscarMural(@PathVariable("token") String token) {
        return homenagemService.buscarMural(token);
    }

    @DeleteMapping("r/{id}")
    public void deletarHomenagem(@PathVariable("id") UUID id) {
        homenagemService.deletar(id);
    }
}
