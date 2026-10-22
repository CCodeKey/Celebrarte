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
cp .env.example .env   # dados do banco externo e JWT_SECRET
docker compose up -d --build
```

O site fica em `http://localhost` (porta definida por `FRONTEND_PORT`). São dois containers:

| Serviço | Imagem | Papel |
| ------- | ------ | ----- |
| `backend` | `backend/Dockerfile` | API Spring Boot na porta 8080, acessível só pela rede interna |
| `frontend` | `frontend/Dockerfile` | nginx servindo o build do React e repassando `/api` ao backend |

Como o navegador fala só com o nginx, frontend e API ficam na mesma origem e não é preciso configurar CORS.

O banco PostgreSQL é externo e não faz parte do compose. Em `SPRING_DATASOURCE_URL`, use o IP ou o nome da máquina do banco: dentro do container, `localhost` aponta para o próprio container. Se o banco roda na mesma máquina que o Docker, use `host.docker.internal` (Docker Desktop). As tabelas são criadas ou atualizadas pelo Hibernate ao iniciar a API.

Comandos úteis:

```bash
docker compose logs -f backend   # logs da API
docker compose up -d --build     # recria as imagens depois de mudar o código
docker compose down              # para e remove os containers
```

Para desenvolver sem Docker, veja [backend/README.md](backend/README.md) e [frontend/README.md](frontend/README.md).
