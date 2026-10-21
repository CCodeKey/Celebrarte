package rekor.pb.celebrarte.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rekor.pb.celebrarte.dto.UsuarioDto;
import rekor.pb.celebrarte.service.UsuarioService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("user")
public class UsuarioController {
    private UsuarioService userService;

    public UsuarioController(UsuarioService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDto>> listarUsuarios() {
        return ResponseEntity.ok(userService.listar());
    }

    @GetMapping("f/{id}")
    public ResponseEntity<UsuarioDto> buscarUsuario(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(userService.buscar(id));
    }

    @GetMapping("f")
    public ResponseEntity<UsuarioDto> buscarUsuarioPorEmail(@RequestParam("email") String email) {
        return ResponseEntity.ok(userService.buscarPorEmail(email));
    }

    @PostMapping("n")
    public ResponseEntity<UsuarioDto> newUsuario(@RequestBody UsuarioDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.salvar(dto));
    }

    @PutMapping("e/{id}")
    public ResponseEntity<UsuarioDto> editarUsuario(@PathVariable("id") UUID id, @RequestBody UsuarioDto dto) {
        return ResponseEntity.ok(userService.atualizar(id, dto));
    }

    @DeleteMapping("r/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable("id") UUID id) {
        userService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
