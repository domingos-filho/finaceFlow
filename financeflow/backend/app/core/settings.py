
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    database_url: str = Field(default="postgresql+psycopg2://financeflow:financeflow123@db:5432/financeflow", alias="DATABASE_URL")
    frontend_origin: str = Field(default="http://localhost:5173", alias="FRONTEND_ORIGIN")
    jwt_secret: str = Field(default="dev-secret", alias="JWT_SECRET")
    admin_email: str = Field(default="admin@local", alias="ADMIN_EMAIL")
    admin_password: str = Field(default="Admin#123", alias="ADMIN_PASSWORD")

    class Config:
        extra = "ignore"

settings = Settings()
