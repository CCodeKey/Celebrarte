package rekor.pb.celebrarte.controller;

import org.springframework.web.bind.annotation.*;
import rekor.pb.celebrarte.dto.UsuarioDto;
import rekor.pb.celebrarte.entity.Usuario;
import rekor.pb.celebrarte.service.UsuarioService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("u")
public class UsuarioController {
    private UsuarioService userService;

    public UsuarioController(UsuarioService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<Usuario> listarUsuarios() {
        return userService.listar();
    }

    @GetMapping("f/{id}")
    public Usuario buscarUsuario(@PathVariable("id") UUID id) {
        return userService.buscar(id);
    }

    @PostMapping("n")
    public void newUsuario(@RequestBody UsuarioDto dto) {
        userService.salvar(dto);
    }

    @PutMapping("e/{id}")
    public Usuario editarUsuario(@PathVariable("id") UUID id, @RequestBody UsuarioDto dto) {
        return userService.atualizar(id, dto);
    }

    @DeleteMapping("r/{id}")
    public void deletarUsuario(@PathVariable("id") UUID id) {
        userService.deletar(id);
    }
}
