package rekor.pb.celebrarte.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rekor.pb.celebrarte.dto.MuralDto;
import rekor.pb.celebrarte.service.HomenagemService;

// Rota pública: o mural é acessado pelo link com o tokenMural, sem login
@RestController
@RequestMapping("mural")
public class MuralController {
    private HomenagemService homenagemService;

    public MuralController(HomenagemService homenagemService) {
        this.homenagemService = homenagemService;
    }

    @GetMapping("{token}")
    public ResponseEntity<MuralDto> buscarMural(@PathVariable("token") String token) {
        return ResponseEntity.ok(homenagemService.buscarMural(token));
    }
}
