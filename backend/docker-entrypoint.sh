#!/bin/sh
set -e

if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations)" ]; then
  npx prisma migrate deploy
else
  echo "Nenhuma migração encontrada; aplicando schema com prisma db push"
  npx prisma db push
fi

exec node dist/index.js
