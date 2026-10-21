package rekor.pb.celebrarte.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import rekor.pb.celebrarte.dto.LoginDto;
import rekor.pb.celebrarte.dto.TokenDto;
import rekor.pb.celebrarte.entity.Usuario;
import rekor.pb.celebrarte.repository.UsuarioRepository;

import java.time.Duration;
import java.time.Instant;

@Service
public class AuthService {
    private AuthenticationManager authenticationManager;
    private JwtEncoder jwtEncoder;
    private UsuarioRepository userRepository;
    private Duration expiracao;

    public AuthService(AuthenticationManager authenticationManager, JwtEncoder jwtEncoder, UsuarioRepository userRepository, @Value("${jwt.expiracao-minutos}") long expiracaoMinutos) {
        this.authenticationManager = authenticationManager;
        this.jwtEncoder = jwtEncoder;
        this.userRepository = userRepository;
        this.expiracao = Duration.ofMinutes(expiracaoMinutos);
    }

    public TokenDto login(LoginDto dto){
        if (dto.getEmail() == null || dto.getSenha() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "E-mail e senha são obrigatórios");
        }

        try {
            // Confere o e-mail e o hash BCrypt da senha
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getSenha()));
        } catch (AuthenticationException e) {
            // Mesma mensagem para e-mail inexistente e senha errada
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos");
        }

        Usuario usuario = userRepository.findByEmail(dto.getEmail()).orElseThrow();
        Instant agora = Instant.now();
        Instant expiraEm = agora.plus(expiracao);

        // O subject é o id do usuário; nas rotas protegidas ele sai de authentication.getName()
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("celebrarte")
                .subject(usuario.getId().toString())
                .claim("email", usuario.getEmail())
                .claim("nome", usuario.getNome())
                .issuedAt(agora)
                .expiresAt(expiraEm)
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();

        String token = jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
        return new TokenDto(token, expiraEm);
    }
}
