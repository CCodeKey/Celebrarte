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
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.servlet.HandlerExceptionResolver;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private static final PathPatternRequestMatcher.Builder ROTA = PathPatternRequestMatcher.withDefaults();

    // Rotas abertas, sem login. Para incluir uma nova, basta adicioná-la aqui.
    private static final RequestMatcher ROTAS_PUBLICAS = new OrRequestMatcher(
            // Login e cadastro
            ROTA.matcher(HttpMethod.POST, "/auth/login"),
            ROTA.matcher(HttpMethod.POST, "/user/n"),
            // Formulário de contribuição e mural (acessados pelo token do link)
            ROTA.matcher("/homenagem/c/**"),
            ROTA.matcher("/mural/**"),
            // Arquivos das imagens enviadas por upload, exibidos no mural
            ROTA.matcher(HttpMethod.GET, "/homenagem/i/**"),
            // Deixa o corpo das respostas de erro (400, 404...) visível
            ROTA.matcher("/error"));

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

    // Nas rotas públicas o header Authorization é ignorado: um token vencido ou inválido
    // guardado pelo cliente não pode impedir alguém de abrir o mural ou fazer login
    @Bean
    public BearerTokenResolver bearerTokenResolver() {
        DefaultBearerTokenResolver padrao = new DefaultBearerTokenResolver();
        return request -> ROTAS_PUBLICAS.matches(request) ? null : padrao.resolve(request);
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
                        .requestMatchers(ROTAS_PUBLICAS).permitAll()
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
