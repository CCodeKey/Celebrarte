# Back-end

Descrever

## Endpoints

### Usuário

| Método | Rota | Descrição |
| ------ | ---- | --------- |
| GET | `/user` | Lista os usuários |
| GET | `/user/find/{id}` | Busca um usuário pelo id |
| POST | `/user/new` | Cadastra um usuário |
| DELETE | `/user/del/{id}` | Exclui um usuário e suas celebrações |

### Celebração (administrativo)

| Método | Rota | Descrição |
| ------ | ---- | --------- |
| GET | `/celebracao/user/{usuarioId}` | Lista as celebrações de um usuário |
| GET | `/celebracao/find/{id}` | Detalhes de uma celebração |
| GET | `/celebracao/{id}/homenagens` | Homenagens recebidas pela celebração |
| POST | `/celebracao/new` | Cria uma celebração e gera os links públicos |
| PUT | `/celebracao/edit/{id}` | Altera o aniversariante e a data |
| DELETE | `/celebracao/del/{id}` | Exclui a celebração e suas homenagens |

Corpo de `POST /celebracao/new`:

```json
{
  "usuarioId": "3f2b8c1e-9a4d-4e7b-b6a1-2c5d8e9f0a12",
  "nomeAniversariante": "Maria Silva",
  "dataCelebracao": "2026-11-05T00:00:00"
}
```

`PUT /celebracao/edit/{id}` recebe `nomeAniversariante` e `dataCelebracao`.

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
| GET | `/homenagem/contribuir/{tokenContribuicao}` | Público | Nome do aniversariante e data, para o formulário |
| POST | `/homenagem/contribuir/{tokenContribuicao}` | Público | Envia uma homenagem |
| GET | `/homenagem/mural/{tokenMural}` | Público | Mural com a celebração e todas as homenagens |
| DELETE | `/homenagem/del/{id}` | Administrativo | Exclui uma homenagem |

Corpo de `POST /homenagem/contribuir/{tokenContribuicao}`:

```json
{
  "mensagem": "Feliz aniversário, Maria!",
  "imagemUrl": "https://exemplo.com/fotos/maria.jpg"
}
```

Os dois campos são opcionais, mas a homenagem precisa ter pelo menos um deles. A mensagem tem limite de 2.000 caracteres. Por enquanto, `imagemUrl` é apenas uma URL em texto; o upload de arquivos ainda não foi implementado.

Resposta de `GET /homenagem/mural/{tokenMural}`:

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
