from fastapi import FastAPI

app = FastAPI(
    title="FinanceFlow API",
    version="1.0.0",
    root_path="/api"
)

@app.get("/")
def root():
    return {"message": "API funcionando 🚀"}

@app.get("/ping")
def ping():
    return {"pong": True}

