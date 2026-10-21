# Back-end

Descrever

## Endpoints

O primeiro segmento da rota é o nome completo do recurso: `/auth`, `/user`, `/celebracao`, `/homenagem` e `/mural`. Os segmentos seguintes usam só a primeira letra do que representam:

| Letra | Significado |
| ----- | ----------- |
| `c` | contribuir (em `/homenagem/c`) |
| `h` | homenagens (em `/celebracao/{id}/h`) |
| `f` | find (buscar) |
| `n` | new (criar) |
| `e` | edit (alterar) |
| `r` | remove (excluir) |

A exceção é o login, que fica em `/auth/login`.

### Autenticação

A API usa JWT. As rotas administrativas exigem o header `Authorization: Bearer <token>`; sem ele, ou com um token inválido ou expirado, a resposta é `401`. As únicas rotas abertas são o login, o cadastro (`POST /user/n`) o formulário público de homenagem (`/homenagem/c/**`) e o mural (`/mural/**`).

| Método | Rota | Descrição |
| ------ | ---- | --------- |
| POST | `/auth/login` | Faz login e devolve o token |

Corpo:

```json
{
  "email": "maria@exemplo.com",
  "senha": "minhaSenha"
}
```

Resposta:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9…",
  "tipo": "Bearer",
  "expiraEm": "2026-10-21T18:10:09Z"
}
```

O token é assinado com HS256 usando `JWT_SECRET` (mínimo de 32 caracteres) e vale por `JWT_EXPIRACAO_MINUTOS` (padrão: 60). O `sub` do token é o id do usuário. E-mail inexistente e senha errada devolvem a mesma resposta: `401` com a mensagem "E-mail ou senha inválidos".

### Permissões

Cada usuário só acessa os próprios dados (RN-03). O servidor identifica o usuário pelo `sub` do token, nunca por um id enviado no corpo ou na URL:

- As rotas de `/user` (exceto o cadastro) atuam sempre sobre o usuário logado.
- Uma celebração é criada sempre em nome do usuário logado.
- Buscar, alterar ou excluir a celebração de outra pessoa, ver as homenagens dela ou excluir uma homenagem dela devolve `404`, a mesma resposta de um registro inexistente, para não revelar que ele existe.

### Usuário

| Método | Rota | Acesso | Descrição |
| ------ | ---- | ------ | --------- |
| POST | `/user/n` | Público | Cadastra um usuário |
| GET | `/user/me` | Logado | Dados do usuário logado |
| PUT | `/user/e` | Logado | Altera nome e senha do usuário logado |
| DELETE | `/user/r` | Logado | Exclui a conta do usuário logado e suas celebrações |

`POST /user/n` recebe `nome`, `email` e `senha`. `PUT /user/e` recebe `nome` e `senha`; se `senha` vier vazia ou não for enviada, a senha atual é mantida.

A senha é enviada em texto puro e o servidor guarda só o hash BCrypt. Ela nunca aparece nas respostas.

### Celebração (administrativo)

Todas as rotas exigem token e atuam só sobre as celebrações do usuário logado.

| Método | Rota | Descrição |
| ------ | ---- | --------- |
| GET | `/celebracao` | Lista as celebrações do usuário logado |
| GET | `/celebracao/f/{id}` | Detalhes de uma celebração |
| GET | `/celebracao/{id}/h` | Homenagens recebidas pela celebração |
| POST | `/celebracao/n` | Cria uma celebração e gera os links públicos |
| PUT | `/celebracao/e/{id}` | Altera o aniversariante e a data |
| DELETE | `/celebracao/r/{id}` | Exclui a celebração e suas homenagens |

Corpo de `POST /celebracao/n` (o responsável é o usuário do token; não é preciso enviar `usuarioId`):

```json
{
  "nomeAniversariante": "Maria Silva",
  "dataCelebracao": "2026-11-05T00:00:00"
}
```

`PUT /celebracao/e/{id}` recebe `nomeAniversariante` e `dataCelebracao`.

Resposta (`201 Created`):

```json
{
  "id": "…",
  "usuarioId": "3f2b8c1e-9a4d-4e7b-b6a1-2c5d8e9f0a12",
  "nomeAniversariante": "Maria Silva",
  "dataCelebracao": "2026-11-05T00:00:00",
  "dataEncerramento": "2026-11-07T00:00:00",
  "tokenContribuicao": "…",
  "tokenMural": "…"
}
```

O servidor gera `tokenContribuicao` e `tokenMural`, que são usados nas rotas públicas abaixo. `dataEncerramento` é sempre dois dias após `dataCelebracao`; depois dela, novos envios são recusados.

### Homenagem

| Método | Rota | Acesso | Descrição |
| ------ | ---- | ------ | --------- |
| GET | `/homenagem/c/{tokenContribuicao}` | Público | Nome do aniversariante e data, para o formulário |
| POST | `/homenagem/c/{tokenContribuicao}` | Público | Envia uma homenagem |
| DELETE | `/homenagem/r/{id}` | Administrativo | Exclui uma homenagem de uma celebração do usuário logado |

Corpo de `POST /homenagem/c/{tokenContribuicao}`:

```json
{
  "mensagem": "Feliz aniversário, Maria!",
  "imagemUrl": "https://exemplo.com/fotos/maria.jpg"
}
```

Os dois campos são opcionais, mas a homenagem precisa ter pelo menos um deles. A mensagem tem limite de 2.000 caracteres. Por enquanto, `imagemUrl` é apenas uma URL em texto; o upload de arquivos ainda não foi implementado.

`GET /homenagem/c/{tokenContribuicao}` devolve só `nomeAniversariante` e `dataCelebracao`, sem as homenagens: quem tem o link de contribuição não lê as mensagens dos outros.

### Mural

| Método | Rota | Acesso | Descrição |
| ------ | ---- | ------ | --------- |
| GET | `/mural/{tokenMural}` | Público | Mural com a celebração e todas as homenagens |

Resposta:

```json
{
  "nomeAniversariante": "Maria Silva",
  "dataCelebracao": "2026-11-05T00:00:00",
  "homenagens": [
    {
      "id": "…",
      "mensagem": "Feliz aniversário, Maria!",
      "imagemUrl": "https://exemplo.com/fotos/maria.jpg",
      "createdAt": "2026-10-19T14:32:10.123"
    }
  ]
}
```

## Respostas de sucesso

| Status | Quando |
| ------ | ------ |
| 200 | Buscas, listagens, alterações e login |
| 201 | Criação (`POST /user/n`, `POST /celebracao/n` e `POST /homenagem/c/{tokenContribuicao}`), com o registro criado no corpo |
| 204 | Exclusão, sem corpo |

## Erros

Todo erro devolve o mesmo formato, sem stack trace:

```json
{
  "timestamp": "2026-10-21T18:23:25.714Z",
  "status": 404,
  "erro": "Not Found",
  "mensagem": "Celebração não encontrada",
  "path": "/celebracao/f/00000000-0000-0000-0000-000000000000"
}
```

| Status | Quando |
| ------ | ------ |
| 400 | Campos obrigatórios ausentes, JSON malformado, id que não é UUID, parâmetro obrigatório ausente, homenagem sem mensagem e sem imagem, ou mensagem acima de 2.000 caracteres |
| 401 | Rota administrativa sem token, token inválido ou expirado, ou login com e-mail ou senha inválidos |
| 403 | Acesso negado |
| 404 | Usuário, celebração, homenagem, token ou rota não encontrado |
| 405 | Método HTTP não suportado na rota (ex.: `GET /auth/login`) |
| 409 | E-mail já cadastrado |
| 410 | Envio de homenagem após a data de encerramento |
| 415 | Corpo enviado sem `Content-Type: application/json` |
| 500 | Erro inesperado; o detalhe fica só no log do servidor |
