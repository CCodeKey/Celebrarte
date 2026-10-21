# Back-end

Descrever

## Endpoints

O primeiro segmento da rota é o nome completo do recurso: `/auth`, `/user`, `/celebracao` e `/homenagem`. Os segmentos seguintes usam só a primeira letra do que representam:

| Letra | Significado |
| ----- | ----------- |
| `u` | usuário (em `/celebracao/u`) |
| `c` | contribuir (em `/homenagem/c`) |
| `h` | homenagens (em `/celebracao/{id}/h`) |
| `f` | find (buscar) |
| `n` | new (criar) |
| `e` | edit (alterar) |
| `r` | remove (excluir) |
| `m` | mural |

A exceção é o login, que fica em `/auth/login`.

### Autenticação

A API usa JWT. As rotas administrativas exigem o header `Authorization: Bearer <token>`; sem ele, ou com um token inválido ou expirado, a resposta é `401`. As únicas rotas abertas são o login, o cadastro (`POST /user/n`) e as rotas públicas de homenagem (`/homenagem/c/**` e `/homenagem/m/**`).

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

### Usuário

| Método | Rota | Descrição |
| ------ | ---- | --------- |
| GET | `/user` | Lista os usuários |
| GET | `/user/f/{id}` | Busca um usuário pelo id |
| POST | `/user/n` | Cadastra um usuário |
| PUT | `/user/e/{id}` | Altera nome e senha |
| DELETE | `/user/r/{id}` | Exclui um usuário e suas celebrações |

`POST /user/n` recebe `nome`, `email` e `senha`. `PUT /user/e/{id}` recebe `nome` e `senha`; se `senha` vier vazia ou não for enviada, a senha atual é mantida.

A senha é enviada em texto puro e o servidor guarda só o hash BCrypt. Ela nunca aparece nas respostas.

### Celebração (administrativo)

| Método | Rota | Descrição |
| ------ | ---- | --------- |
| GET | `/celebracao/u/{usuarioId}` | Lista as celebrações de um usuário |
| GET | `/celebracao/f/{id}` | Detalhes de uma celebração |
| GET | `/celebracao/{id}/h` | Homenagens recebidas pela celebração |
| POST | `/celebracao/n` | Cria uma celebração e gera os links públicos |
| PUT | `/celebracao/e/{id}` | Altera o aniversariante e a data |
| DELETE | `/celebracao/r/{id}` | Exclui a celebração e suas homenagens |

Corpo de `POST /celebracao/n`:

```json
{
  "usuarioId": "3f2b8c1e-9a4d-4e7b-b6a1-2c5d8e9f0a12",
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
| GET | `/homenagem/m/{tokenMural}` | Público | Mural com a celebração e todas as homenagens |
| DELETE | `/homenagem/r/{id}` | Administrativo | Exclui uma homenagem |

Corpo de `POST /homenagem/c/{tokenContribuicao}`:

```json
{
  "mensagem": "Feliz aniversário, Maria!",
  "imagemUrl": "https://exemplo.com/fotos/maria.jpg"
}
```

Os dois campos são opcionais, mas a homenagem precisa ter pelo menos um deles. A mensagem tem limite de 2.000 caracteres. Por enquanto, `imagemUrl` é apenas uma URL em texto; o upload de arquivos ainda não foi implementado.

Resposta de `GET /homenagem/m/{tokenMural}`:

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

## Erros

| Status | Quando |
| ------ | ------ |
| 400 | Campos obrigatórios ausentes, homenagem sem mensagem e sem imagem, ou mensagem acima de 2.000 caracteres |
| 401 | Rota administrativa sem token, token inválido ou expirado, ou login com e-mail ou senha inválidos |
| 404 | Usuário, celebração, homenagem ou token não encontrado |
| 410 | Envio de homenagem após a data de encerramento |
