# Backend - FinaceFlow

API RESTful para autenticação, carteiras, permissões e lançamentos com sincronização offline-first.

## Tecnologias

- Node.js + Express
- PostgreSQL + Prisma
- Autenticação JWT com controle de roles (admin, editor, viewer)

## Configuração

1. Copie o arquivo `.env.example` para `.env` e ajuste as variáveis:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/finaceflow
PORT=4000
JWT_SECRET=changeme
```

2. Instale dependências e gere o client Prisma:

```
npm install
npm run prisma:generate
```

3. Execute as migrações e inicie o servidor em modo desenvolvimento:

```
npm run prisma:migrate
npm run dev
```

## Endpoints

- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- `GET/POST /wallets`, `GET/PATCH/DELETE /wallets/:id`
- `POST /wallets/:id/users`, `DELETE /wallets/:id/users/:userId`
- `GET/POST/PATCH/DELETE /transactions`
- `POST /sync` para reconciliar lançamentos offline

O middleware de autenticação deve ser usado em todas as rotas exceto autenticação.
