# Mobile - FinaceFlow

Aplicativo React Native (Expo) com suporte offline-first via SQLite.

## Configuração

1. Instale dependências:

```
npm install
```

2. Configure a URL da API no `.env` do Expo (ou variável `EXPO_PUBLIC_API_URL`).

3. Rode o app:

```
npm start
```

## Funcionalidades incluídas

- Autenticação JWT (login)
- Listagem de carteiras com base no usuário autenticado
- Criação de lançamentos em modo offline (SQLite) com sincronização para o backend
- Tela de listagem de lançamentos por carteira
