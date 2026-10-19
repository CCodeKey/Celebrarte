package rekor.pb.celebrarte.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
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

    @GetMapping("contribuir/{token}")
    public MuralDto buscarFormulario(@PathVariable("token") String token) {
        return homenagemService.buscarFormulario(token);
    }

    @PostMapping("contribuir/{token}")
    @ResponseStatus(HttpStatus.CREATED)
    public HomenagemDto enviarHomenagem(@PathVariable("token") String token, @RequestBody HomenagemDto dto) {
        return homenagemService.enviar(token, dto);
    }
    @GetMapping("mural/{token}")
    public MuralDto buscarMural(@PathVariable("token") String token) {
        return homenagemService.buscarMural(token);
    }

    @DeleteMapping("del/{id}")
    public void deletarHomenagem(@PathVariable("id") UUID id) {
        homenagemService.deletar(id);
    }
}
