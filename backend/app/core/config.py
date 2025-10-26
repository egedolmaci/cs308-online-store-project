from typing import List
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "Online Store API"
    VERSION: str = "1.0.0"
    DEBUG: bool = False

    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173"]

@lru_cache
def get_settings() -> Settings:
    return Settings()