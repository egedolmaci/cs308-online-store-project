from datetime import timedelta
from typing import Optional
from app.core.config import get_settings
from app.core.security import create_token, decode_token
from app.domains.identity.repository import repo, User

settings = get_settings()

def register_user(first_name: str, last_name: str, email: str, password: str, role: str = "customer", address: Optional[str] = None) -> User:
    return repo.create_user(first_name=first_name, last_name=last_name, email=email, password=password, role=role, address=address)

def authenticate_user(email: str, password: str) -> Optional[User]:
    return repo.verify_user(email, password)

def create_access_token(user_id: str, role: str) -> str:
    return create_token(
        subject=user_id,
        secret_key=settings.SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        token_type="access",
        extra={"role": role},
    )

def create_refresh_token(user_id: str, role: str) -> str:
    return create_token(
        subject=user_id,
        secret_key=settings.SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        token_type="refresh",
        extra={"role": role},
    )

def verify_token(token: str) -> Optional[dict]:
    return decode_token(token, settings.SECRET_KEY, settings.JWT_ALGORITHM)

def get_user(user_id: str) -> Optional[User]:
    return repo.get_by_id(user_id)