package rekor.pb.celebrarte.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import rekor.pb.celebrarte.dto.ErroDto;

// Trata os erros de todos os controllers e devolve sempre um ErroDto, sem stack trace
@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Erros de regra de negócio lançados pelos services (400, 404, 410...)
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErroDto> tratarResponseStatus(ResponseStatusException e, HttpServletRequest request) {
        return responder(e.getStatusCode(), e.getReason(), request);
    }

    // JSON malformado, corpo ausente ou campo com tipo errado (ex.: data inválida)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErroDto> tratarCorpoInvalido(HttpMessageNotReadableException e, HttpServletRequest request) {
        return responder(HttpStatus.BAD_REQUEST, "Corpo da requisição ausente ou inválido", request);
    }

    // Parâmetro da rota com formato errado (ex.: id que não é UUID)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErroDto> tratarParametroInvalido(MethodArgumentTypeMismatchException e, HttpServletRequest request) {
        return responder(HttpStatus.BAD_REQUEST, "Parâmetro '" + e.getName() + "' inválido", request);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErroDto> tratarParametroAusente(MissingServletRequestParameterException e, HttpServletRequest request) {
        return responder(HttpStatus.BAD_REQUEST, "Parâmetro '" + e.getParameterName() + "' é obrigatório", request);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErroDto> tratarMetodoNaoSuportado(HttpRequestMethodNotSupportedException e, HttpServletRequest request) {
        return responder(HttpStatus.METHOD_NOT_ALLOWED, "Método " + e.getMethod() + " não é suportado nesta rota", request);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ErroDto> tratarMediaType(HttpMediaTypeNotSupportedException e, HttpServletRequest request) {
        return responder(HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                "Envie o corpo como JSON (application/json) ou, no envio de homenagem com imagem, como multipart/form-data", request);
    }

    // RNF-06: arquivo acima de spring.servlet.multipart.max-file-size
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErroDto> tratarUploadGrande(MaxUploadSizeExceededException e, HttpServletRequest request) {
        return responder(HttpStatus.CONTENT_TOO_LARGE, "A imagem deve ter no máximo 5 MB", request);
    }

    // Corpo multipart malformado
    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<ErroDto> tratarMultipart(MultipartException e, HttpServletRequest request) {
        return responder(HttpStatus.BAD_REQUEST, "Não foi possível ler o arquivo enviado", request);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErroDto> tratarRotaInexistente(NoResourceFoundException e, HttpServletRequest request) {
        return responder(HttpStatus.NOT_FOUND, "Rota não encontrada", request);
    }

    // Violação de restrição do banco que escapou das validações (ex.: e-mail duplicado)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErroDto> tratarIntegridade(DataIntegrityViolationException e, HttpServletRequest request) {
        return responder(HttpStatus.CONFLICT, "Os dados enviados conflitam com um registro existente", request);
    }

    // Vindos do Spring Security (ver SecurityConfig): sem token, token inválido ou expirado
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErroDto> tratarAutenticacao(AuthenticationException e, HttpServletRequest request) {
        String mensagem = e instanceof InvalidBearerTokenException
                ? "Token inválido ou expirado"
                : "Autenticação necessária: envie o header Authorization: Bearer <token>";
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .header("WWW-Authenticate", "Bearer")
                .body(new ErroDto(401, "Unauthorized", mensagem, request.getRequestURI()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErroDto> tratarAcessoNegado(AccessDeniedException e, HttpServletRequest request) {
        return responder(HttpStatus.FORBIDDEN, "Acesso negado", request);
    }

    // Qualquer outro erro: registra no log e não expõe detalhes ao cliente
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroDto> tratarErroInesperado(Exception e, HttpServletRequest request) {
        log.error("Erro inesperado em {} {}", request.getMethod(), request.getRequestURI(), e);
        return responder(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno do servidor", request);
    }

    private ResponseEntity<ErroDto> responder(HttpStatusCode status, String mensagem, HttpServletRequest request) {
        HttpStatus http = HttpStatus.resolve(status.value());
        String erro = http != null ? http.getReasonPhrase() : String.valueOf(status.value());
        return ResponseEntity.status(status)
                .body(new ErroDto(status.value(), erro, mensagem, request.getRequestURI()));
    }
}
