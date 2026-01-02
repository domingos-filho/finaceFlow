#!/usr/bin/env bash
set -euo pipefail

# Exemplo de deploy via Docker para EasyPanel
APP_NAME="finaceflow-api"
IMAGE_TAG="finaceflow-api:latest"

# Build da imagem
cat > Dockerfile <<'DOCKER'
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --omit=dev
COPY backend .
RUN npm run build
CMD ["npm", "run", "start"]
DOCKER

docker build -t "$IMAGE_TAG" -f Dockerfile ..

# Substitua pelos comandos específicos do EasyPanel/servidor
# docker run -d --name $APP_NAME -p 4000:4000 --env-file backend/.env $IMAGE_TAG

echo "Imagem construída: $IMAGE_TAG"
