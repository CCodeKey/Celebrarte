package rekor.pb.celebrarte.controller;

import org.springframework.web.bind.annotation.*;
import rekor.pb.celebrarte.dto.LoginDto;
import rekor.pb.celebrarte.dto.TokenDto;
import rekor.pb.celebrarte.service.AuthService;

@RestController
@RequestMapping("auth")
public class AuthController {
    private AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("login")
    public TokenDto login(@RequestBody LoginDto dto) {
        return authService.login(dto);
    }
}
