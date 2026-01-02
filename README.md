# FinaceFlow

FinaceFlow é uma aplicação de controle financeiro pessoal com foco em sincronização offline/online, múltiplas carteiras e controle de permissões.

## Estrutura do projeto

- `backend/` – API REST em Node.js/Express com PostgreSQL e Prisma.
- `mobile-app/` – Aplicativo React Native (Expo) com armazenamento local em SQLite e lógica de sincronização.
- `scripts/` – Utilitários de automação/deploy.

## Requisitos principais

- Autenticação JWT
- Controle de carteiras e permissões (admin, editor, viewer)
- Lançamentos de receitas/despesas com sincronização offline-first
- Deploy do backend em VPS (EasyPanel + Docker)

Consulte os READMEs específicos em cada pasta para instruções de instalação, configuração e execução.
