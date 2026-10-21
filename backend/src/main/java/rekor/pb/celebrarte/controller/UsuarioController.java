package rekor.pb.celebrarte.controller;

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
    public List<UsuarioDto> listarUsuarios() {
        return userService.listar();
    }

    @GetMapping("f/{id}")
    public UsuarioDto buscarUsuario(@PathVariable("id") UUID id) {
        return userService.buscar(id);
    }

    @PostMapping("n")
    public void newUsuario(@RequestBody UsuarioDto dto) {
        userService.salvar(dto);
    }

    @PutMapping("e/{id}")
    public UsuarioDto editarUsuario(@PathVariable("id") UUID id, @RequestBody UsuarioDto dto) {
        return userService.atualizar(id, dto);
    }

    @DeleteMapping("r/{id}")
    public void deletarUsuario(@PathVariable("id") UUID id) {
        userService.deletar(id);
    }
}
