# Front-end

React + JavaScript + Vite + React Router.

## Como rodar

Com o backend rodando em `http://localhost:8080`:

```bash
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`. Em dev, as chamadas a `/api/*` são repassadas pelo proxy do Vite ao backend (ver [vite.config.js](vite.config.js)), sem precisar configurar CORS no Spring.

Para apontar para outro endereço da API, copie `.env.example` para `.env` e altere `VITE_API_URL`.

## Rotas

| Rota | Acesso | Página |
| ---- | ------ | ------ |
| `/login` | Público | Login |
| `/cadastro` | Público | Cadastro de organizador |
| `/celebracoes` | Logado | Lista das celebrações |
| `/celebracoes/nova` | Logado | Criar celebração |
| `/celebracoes/:id` | Logado | Detalhes, links públicos e homenagens recebidas |
| `/celebracoes/:id/editar` | Logado | Editar celebração |
| `/perfil` | Logado | Alterar nome e senha, excluir conta |
| `/c/:tokenContribuicao` | Público | Formulário de homenagem |
| `/m/:tokenMural` | Público | Mural |

## Estrutura

```text
src/
├── components/   peças reutilizáveis (Campo, Alerta, HomenagemCard…)
├── pages/        uma por rota
├── layouts/      AdminLayout (com navegação) e PublicLayout
├── routes/       definição das rotas e proteção da área logada
├── services/     chamadas à API; api.js centraliza fetch, token e erros
├── hooks/        useAuth (sessão) e useCarregar (busca com loading/erro)
└── utils/        datas e montagem dos links públicos
```

## Autenticação

O token do `POST /auth/login` fica no `localStorage` junto com `expiraEm`. A sessão é encerrada quando o token expira ou quando uma rota administrativa responde `401`; nesse caso a pessoa volta ao login com um aviso.
