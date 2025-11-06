from typing import Optional, Dict
from dataclasses import dataclass
import uuid

from app.core.security import hash_password, verify_password

@dataclass
class User:
    id: str
    email: str
    password_hash: str
    role: str

class InMemoryUserRepository:
    def __init__(self):
        self._by_id: Dict[str, User] = {}
        self._by_email: Dict[str, User] = {}
        # Seed a manager for testing
        self.create_user("manager@example.com", "Password123!", role="product_manager")

    def create_user(self, email: str, password: str, role: str = "customer") -> User:
        email_l = email.lower()
        if email_l in self._by_email:
            raise ValueError("User already exists")
        user = User(
            id=str(uuid.uuid4()),
            email=email_l,
            password_hash=hash_password(password),
            role=role,
        )
        self._by_id[user.id] = user
        self._by_email[user.email] = user
        return user

    def get_by_email(self, email: str) -> Optional[User]:
        return self._by_email.get(email.lower())

    def get_by_id(self, user_id: str) -> Optional[User]:
        return self._by_id.get(user_id)

    def verify_user(self, email: str, password: str) -> Optional[User]:
        user = self.get_by_email(email)
        if not user or not verify_password(password, user.password_hash):
            return None
        return user

repo = InMemoryUserRepository()