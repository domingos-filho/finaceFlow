import os
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    database_url: str = Field(
        default=f"postgresql+psycopg2://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:5432/{os.getenv('DB_NAME')}",
        alias="DATABASE_URL"
    )
    frontend_origin: str = Field(default=os.getenv("FRONTEND_ORIGIN"), alias="FRONTEND_ORIGIN")
    jwt_secret: str = Field(default=os.getenv("JWT_SECRET"), alias="JWT_SECRET")
    admin_email: str = Field(default=os.getenv("ADMIN_EMAIL"), alias="ADMIN_EMAIL")
    admin_password: str = Field(default=os.getenv("ADMIN_PASSWORD"), alias="ADMIN_PASSWORD")

    class Config:
        extra = "ignore"

settings = Settings()

