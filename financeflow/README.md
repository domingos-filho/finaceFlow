# FinanceFlow — Gerenciamento Financeiro Pessoal (PWA + FastAPI + PostgreSQL)

Aplicação full‑stack pronta para deploy (Docker Compose) que replica o layout compartilhado
nas imagens e atende aos requisitos:
- Entradas, saídas, categorias, metas, orçamentos e relatórios
- PWA com uso **offline** (IndexedDB + fila de sincronização)
- API REST com **FastAPI**, **JWT**, **CORS**, **alembic opcional**
- **PostgreSQL** como banco
- Deploy simplificado via **EasyPanel**/Hostinger

## Estrutura
```
financeflow/
├─ docker-compose.yml
├─ .env.example
├─ backend/           # FastAPI + SQLAlchemy
└─ frontend/          # Vite + React + Tailwind (PWA)
```

## Passo a passo — Desenvolvimento local
1) Pré‑requisitos: Docker + Docker Compose.
2) Copie `.env.example` para `.env` e ajuste as variáveis.
3) Suba tudo:
```bash
docker compose up -d --build
```
4) Acesse:
- Frontend: http://localhost:5173
- API: http://localhost:8000/docs

Usuário admin inicial: definido nas variáveis `ADMIN_EMAIL` e `ADMIN_PASSWORD`.

## Deploy na Hostinger (VPS) com EasyPanel
1) Crie um repositório no GitHub/GitLab e faça push deste projeto.
2) No EasyPanel, crie um projeto *compose* e cole o conteúdo do `docker-compose.yml`.
3) Configure as **variáveis de ambiente** na UI do EasyPanel ou via arquivo `.env` (se suportado).
4) Aponte seu domínio/subdomínio para o IP da VPS (registro A). No EasyPanel associe o domínio
   ao serviço `web` (porta 80) e habilite HTTPS (Let's Encrypt).
5) Deploy: clique em **Deploy** (pull do Git) e espere os containers subirem.
6) Abra seu domínio. No celular, use “Adicionar à tela inicial” para instalar o PWA.

## Segurança
- JWT com expiração, hashing de senha (argon2), CORS restrito por `FRONTEND_ORIGIN`.
- Rate‑limit simples no Nginx do frontend para estáticos (opcional).
- Recomenda‑se colocar a API atrás de um proxy com HTTPS e cabeçalhos de segurança.

## Migrações
O exemplo cria as tabelas automaticamente. Para produção, adicione Alembic (esqueleto já preparado).

Bom proveito! :)
