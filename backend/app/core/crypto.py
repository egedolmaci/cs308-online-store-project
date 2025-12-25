import base64
import hashlib
from typing import Optional

from cryptography.fernet import Fernet, InvalidToken

from app.core.config import get_settings


def _fernet() -> Fernet:
    """Derive a stable Fernet key from SECRET_KEY for field-level encryption."""
    secret = get_settings().SECRET_KEY.encode()
    key = base64.urlsafe_b64encode(hashlib.sha256(secret).digest())
    return Fernet(key)


def encrypt_str(value: Optional[str]) -> Optional[str]:
    """Encrypt a string value for storage. Returns None if input is falsy."""
    if not value:
        return value
    return _fernet().encrypt(value.encode()).decode()


def decrypt_str(value: Optional[str]) -> Optional[str]:
    """Decrypt a string value from storage. Returns None if input is falsy."""
    if not value:
        return value
    try:
        return _fernet().decrypt(value.encode()).decode()
    except InvalidToken:
        # If value is already plain (legacy rows), return as-is
        return value
