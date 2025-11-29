from typing import List
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "Online Store API"
    VERSION: str = "1.0.0"
    DEBUG: bool = False

    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173"]
    SQLITE_DATABASE_URL: str = "sqlite:///./database.db"


    SECRET_KEY: str = "change-this-in-.env"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    COOKIE_DOMAIN: str | None = None
    COOKIE_SECURE: bool = False
    COOKIE_SAMESITE: str = "lax"
    COOKIE_PATH: str = "/"

    SMTP_HOST: str | None = None
    SMTP_PORT: int = 587
    SMTP_USERNAME: str | None = None
    SMTP_PASSWORD: str | None = None
    SMTP_STARTTLS: bool = True
    EMAIL_FROM: str = "no-reply@example.com"

    SUPPORT_ATTACHMENT_DIR: str = "./storage/support_attachments"
    SUPPORT_ATTACHMENT_MAX_MB: int = 15
    SUPPORT_ALLOWED_MIME_PREFIXES: List[str] = ["image/", "video/", "application/pdf"]
    SUPPORT_HISTORY_LIMIT: int = 50
    SUPPORT_QUEUE_LIMIT: int = 50

    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache
def get_settings() -> Settings:
    return Settings()
