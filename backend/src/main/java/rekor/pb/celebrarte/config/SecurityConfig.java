package rekor.pb.celebrarte.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.servlet.HandlerExceptionResolver;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private SecretKey chaveJwt;

    public SecurityConfig(@Value("${jwt.secret}") String segredo) {
        byte[] bytes = segredo.getBytes(StandardCharsets.UTF_8);
        // HS256 exige uma chave de pelo menos 256 bits
        if (bytes.length < 32) {
            throw new IllegalStateException("JWT_SECRET deve ter pelo menos 32 caracteres");
        }
        this.chaveJwt = new SecretKeySpec(bytes, "HmacSHA256");
    }

    // BCrypt gera hashes de 60 caracteres, o tamanho da coluna senha_hash
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Usa o UsuarioDetailsService e o PasswordEncoder acima para conferir e-mail e senha no login
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public JwtEncoder jwtEncoder() {
        return new NimbusJwtEncoder(new ImmutableSecret<>(chaveJwt));
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withSecretKey(chaveJwt).macAlgorithm(MacAlgorithm.HS256).build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
            @Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver) throws Exception {
        // Os erros de autenticação acontecem antes do controller; repassá-los ao resolver
        // faz o GlobalExceptionHandler responder com o mesmo ErroDto dos outros erros
        AuthenticationEntryPoint entryPoint = (request, response, e) ->
                resolver.resolveException(request, response, null, e);
        AccessDeniedHandler accessDeniedHandler = (request, response, e) ->
                resolver.resolveException(request, response, null, e);

        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Login e cadastro
                        .requestMatchers(HttpMethod.POST, "/auth/login", "/user/n").permitAll()
                        // Rotas públicas de contribuição e mural (acessadas pelo token do link)
                        .requestMatchers("/homenagem/c/**", "/homenagem/m/**").permitAll()
                        // Deixa o corpo das respostas de erro (400, 404...) visível
                        .requestMatchers("/error").permitAll()
                        // RN-02: o resto exige o header "Authorization: Bearer <token>"
                        .anyRequest().authenticated())
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(entryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> {})
                        .authenticationEntryPoint(entryPoint)
                        .accessDeniedHandler(accessDeniedHandler));
        return http.build();
    }
}
