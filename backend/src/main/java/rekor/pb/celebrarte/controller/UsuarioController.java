package rekor.pb.celebrarte.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import rekor.pb.celebrarte.entity.Usuario;
import rekor.pb.celebrarte.service.UsuarioService;

import java.util.List;

@RestController
@RequestMapping("user")
public class UsuarioController {
    private UsuarioService userService;

    public UsuarioController(UsuarioService userService) {
        this.userService = userService;
    }

    @GetMapping
    public String index() {
        return "Bem vindo ao Celebrarte!";
    }

    @GetMapping("/users")
    public List<Usuario> listarUsuarios() {
        return userService.listar();
    }
}
