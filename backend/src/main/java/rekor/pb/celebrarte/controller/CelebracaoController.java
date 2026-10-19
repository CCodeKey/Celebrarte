package rekor.pb.celebrarte.controller;

import org.springframework.http.HttpStatus;
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

    @GetMapping("user/{usuarioId}")
    public List<CelebracaoDto> listarCelebracoes(@PathVariable("usuarioId") UUID usuarioId) {
        return celebracaoService.listarPorUsuario(usuarioId);
    }

    @GetMapping("find/{id}")
    public CelebracaoDto buscarCelebracao(@PathVariable("id") UUID id) {
        return celebracaoService.buscar(id);
    }

    @GetMapping("{id}/homenagens")
    public List<HomenagemDto> listarHomenagens(@PathVariable("id") UUID id) {
        return homenagemService.listarPorCelebracao(id);
    }

    @PostMapping("new")
    @ResponseStatus(HttpStatus.CREATED)
    public CelebracaoDto newCelebracao(@RequestBody CelebracaoDto dto) {
        return celebracaoService.salvar(dto);
    }

    @PutMapping("edit/{id}")
    public CelebracaoDto editarCelebracao(@PathVariable("id") UUID id, @RequestBody CelebracaoDto dto) {
        return celebracaoService.atualizar(id, dto);
    }

    @DeleteMapping("del/{id}")
    public void deletarCelebracao(@PathVariable("id") UUID id) {
        celebracaoService.deletar(id);
    }
}
