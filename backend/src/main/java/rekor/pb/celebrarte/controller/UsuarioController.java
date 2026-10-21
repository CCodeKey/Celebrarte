package rekor.pb.celebrarte.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rekor.pb.celebrarte.config.UsuarioLogado;
import rekor.pb.celebrarte.dto.UsuarioDto;
import rekor.pb.celebrarte.service.UsuarioService;

import java.util.UUID;

// Fora o cadastro, todas as rotas atuam só sobre o usuário logado (RN-03)
@RestController
@RequestMapping("user")
public class UsuarioController {
    private UsuarioService userService;

    public UsuarioController(UsuarioService userService) {
        this.userService = userService;
    }

    @GetMapping("me")
    public ResponseEntity<UsuarioDto> buscarUsuario(@UsuarioLogado UUID usuarioId) {
        return ResponseEntity.ok(userService.buscar(usuarioId));
    }

    @PostMapping("n")
    public ResponseEntity<UsuarioDto> newUsuario(@RequestBody UsuarioDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.salvar(dto));
    }

    @PutMapping("e")
    public ResponseEntity<UsuarioDto> editarUsuario(@UsuarioLogado UUID usuarioId, @RequestBody UsuarioDto dto) {
        return ResponseEntity.ok(userService.atualizar(usuarioId, dto));
    }

    @DeleteMapping("r")
    public ResponseEntity<Void> deletarUsuario(@UsuarioLogado UUID usuarioId) {
        userService.deletar(usuarioId);
        return ResponseEntity.noContent().build();
    }
}
