# Back-end

Descrever

## Endpoints

Cada segmento das rotas usa só a primeira letra do que representa:

| Letra | Significado |
| ----- | ----------- |
| `u` | usuário |
| `c` | celebração (no início da rota) ou contribuir (em `/h/c`) |
| `h` | homenagem |
| `f` | find (buscar) |
| `n` | new (criar) |
| `e` | edit (alterar) |
| `r` | remove (excluir) |
| `m` | mural |

### Usuário

| Método | Rota | Descrição |
| ------ | ---- | --------- |
| GET | `/u` | Lista os usuários |
| GET | `/u/f/{id}` | Busca um usuário pelo id |
| POST | `/u/n` | Cadastra um usuário |
| DELETE | `/u/r/{id}` | Exclui um usuário e suas celebrações |

### Celebração (administrativo)

| Método | Rota | Descrição |
| ------ | ---- | --------- |
| GET | `/c/u/{usuarioId}` | Lista as celebrações de um usuário |
| GET | `/c/f/{id}` | Detalhes de uma celebração |
| GET | `/c/{id}/h` | Homenagens recebidas pela celebração |
| POST | `/c/n` | Cria uma celebração e gera os links públicos |
| PUT | `/c/e/{id}` | Altera o aniversariante e a data |
| DELETE | `/c/r/{id}` | Exclui a celebração e suas homenagens |

Corpo de `POST /c/n`:

```json
{
  "usuarioId": "3f2b8c1e-9a4d-4e7b-b6a1-2c5d8e9f0a12",
  "nomeAniversariante": "Maria Silva",
  "dataCelebracao": "2026-11-05T00:00:00"
}
```

`PUT /c/e/{id}` recebe `nomeAniversariante` e `dataCelebracao`.

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
| GET | `/h/c/{tokenContribuicao}` | Público | Nome do aniversariante e data, para o formulário |
| POST | `/h/c/{tokenContribuicao}` | Público | Envia uma homenagem |
| GET | `/h/m/{tokenMural}` | Público | Mural com a celebração e todas as homenagens |
| DELETE | `/h/r/{id}` | Administrativo | Exclui uma homenagem |

Corpo de `POST /h/c/{tokenContribuicao}`:

```json
{
  "mensagem": "Feliz aniversário, Maria!",
  "imagemUrl": "https://exemplo.com/fotos/maria.jpg"
}
```

Os dois campos são opcionais, mas a homenagem precisa ter pelo menos um deles. A mensagem tem limite de 2.000 caracteres. Por enquanto, `imagemUrl` é apenas uma URL em texto; o upload de arquivos ainda não foi implementado.

Resposta de `GET /h/m/{tokenMural}`:

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
| 404 | Usuário, celebração, homenagem ou token não encontrado |
| 410 | Envio de homenagem após a data de encerramento |
