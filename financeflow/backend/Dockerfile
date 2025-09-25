FROM python:3.11.9-slim

WORKDIR /app

# Instala dependências do sistema
RUN apt-get update && apt-get install -y build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Cria DB apenas na primeira execução
CMD ["sh", "-c", "alembic upgrade head || true && uvicorn main:app --host 0.0.0.0 --port 8000"]
