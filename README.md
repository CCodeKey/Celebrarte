# Celebrarte

Estrutura do Monorepo

```text
celebrarte/
│
├── README.md
│
├── docs/
│   ├── 01-escopo.md
│   ├── 02-requisitos.md
│   ├── 03-regras-de-negocio.md
│   ├── 04-modelo-de-dados.drawio
│   └── 05-arquitetura.md
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── docker-compose.yml
│
└── .gitignore
```

## Rodando com Docker

Pré-requisito: Docker com o plugin Compose.

```bash
cp .env.example .env   # senha do banco e JWT_SECRET
docker compose up -d --build
```

O site fica em `http://localhost` (porta definida por `FRONTEND_PORT`). São três containers:

| Serviço | Imagem | Papel |
| ------- | ------ | ----- |
| `db` | `postgres:17-alpine` | Banco PostgreSQL, com os dados no volume `pgdata` |
| `backend` | `backend/Dockerfile` | API Spring Boot na porta 8080, acessível só pela rede interna |
| `frontend` | `frontend/Dockerfile` | nginx servindo o build do React e repassando `/api` ao backend |

Como o navegador fala só com o nginx, frontend e API ficam na mesma origem e não é preciso configurar CORS.

O backend só sobe depois que o banco responde (healthcheck com `pg_isready`) e se conecta a ele pelo nome `db`. As tabelas são criadas ou atualizadas pelo Hibernate ao iniciar a API.

O banco também fica acessível na sua máquina em `localhost:5433` (porta definida por `POSTGRES_PORT`, aberta só para `127.0.0.1`), com o usuário e a senha do `.env`. Assim dá para abrir o banco no DBeaver/psql ou rodar a API fora do Docker com `SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5433/celebrarte`.

`POSTGRES_USER` e `POSTGRES_PASSWORD` só são aplicados quando o volume é criado. Para trocá-los depois, altere no banco (`ALTER USER ...`) ou apague os dados com `docker compose down -v`.

Comandos úteis:

```bash
docker compose logs -f backend   # logs da API
docker compose up -d --build     # recria as imagens depois de mudar o código
docker compose down              # para e remove os containers (os dados do banco continuam)
docker compose down -v           # remove também o volume: apaga todos os dados do banco
docker compose exec db psql -U celebrarte celebrarte   # console SQL
```

Para desenvolver sem Docker, veja [backend/README.md](backend/README.md) e [frontend/README.md](frontend/README.md).
