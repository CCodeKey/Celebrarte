package rekor.pb.celebrarte.controller;

import org.springframework.web.bind.annotation.*;
import rekor.pb.celebrarte.dto.UsuarioDto;
import rekor.pb.celebrarte.entity.Usuario;
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
    public List<Usuario> listarUsuarios() {
        return userService.listar();
    }

    @GetMapping("find/{id}")
    public Usuario buscarUsuario(@PathVariable("id") UUID id) {
        return userService.buscar(id);
    }

    @PostMapping("new")
    public void newUsuario(@RequestBody UsuarioDto dto) {
        userService.salvar(dto);
    }

    @DeleteMapping("del/{id}")
    public void deletarUsuario(@PathVariable("id") UUID id) {
        userService.deletar(id);
    }
}
