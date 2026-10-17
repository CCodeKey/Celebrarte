# Arquitetura

## 1. Visão Geral

- Frontend: React + JavaScript
- Backend: Spring Boot + Java
- Banco de dados: PostgreSQL
- Armazenamento de imagens: Object Storage
- Comunicação: API REST utilizando JSON
- Autenticação: Spring Security + JWT
- Containerização: Docker

```text
┌─────────────────────────────────────────────┐
│                  CLIENTE                    │
└──────────────────────┬──────────────────────┘
                       │
                       │ HTTPS / REST / JSON
                       |
                       ▼
┌─────────────────────────────────────────────┐
│                  BACKEND                    │
│                                             │
│  Controller → Service → Repository          │
└───────────────┬─────────────────┬───────────┘
                │                 │
                │                 │
                ▼                 ▼
       ┌────────────────┐  ┌────────────────┐
       │   PostgreSQL   │  │ Object Storage │
       │     Dados      │  │    Imagens     │
       └────────────────┘  └────────────────┘
```

---

## 2. Frontend

O frontend será desenvolvido utilizando:

- React
- JavaScript
- Vite
- React Router

Sua responsabilidade será:

- apresentar as interfaces;
- controlar navegação;
- coletar dados dos usuários;
- realizar chamadas à API;
- apresentar mensagens de erro/sucesso;
- controlar o estado da interface;
- apresentar o mural;
- enviar imagens para o backend;
- manter separada a lógica de apresentação da lógica de negócio do servidor.

**Estrutura**:

```text
frontend/
└── src/
    ├── components/
    ├── pages/
    ├── layouts/
    ├── routes/
    ├── services/
    ├── hooks/
    ├── types/
    ├── utils/
    └── assets/
```

---

## 3. Backend

O backend será desenvolvido com:

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- Flyway
- PostgreSQL Driver

Sua responsabilidade será:

- autenticação;
- autorização;
- validação dos dados;
- aplicação das regras de negócio;
- gerenciamento das celebrações;
- gerenciamento das homenagens;
- geração/validação dos links públicos;
- validação de imagens;
- persistência;
- comunicação com o armazenamento de imagens.

**Estrutura**:

```text
backend/
└── src/main/java/...
    │
    ├── controller/
    │
    ├── service/
    │
    ├── repository/
    │
    ├── entity/
    │
    ├── dto/
    │
    ├── security/
    │
    ├── exception/
    │
    └── config/
```
