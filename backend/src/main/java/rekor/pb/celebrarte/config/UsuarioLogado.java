package rekor.pb.celebrarte.config;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// Injeta no parâmetro do controller o id (UUID) do usuário logado, lido do "sub" do JWT.
// RN-03: o dono de um recurso sempre vem do token, nunca do corpo ou da URL da requisição.
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@AuthenticationPrincipal(expression = "T(java.util.UUID).fromString(subject)")
public @interface UsuarioLogado {
}
