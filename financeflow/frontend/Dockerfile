# Etapa 1 - Build com Node
FROM node:20 AS build

WORKDIR /app

# Instala dependências
COPY package.json package-lock.json* ./
RUN npm install

# Copiar o código e buildar
COPY . .
RUN npm run build

# Etapa 2 - Servir com Nginx
FROM nginx:1.25-alpine

# Remover configuração padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copiar config do projeto
COPY nginx.conf /etc/nginx/conf.d

# Copiar build do Vite
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
