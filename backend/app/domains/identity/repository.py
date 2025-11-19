from typing import Optional
from dataclasses import dataclass
import uuid

from sqlalchemy.exc import IntegrityError
from sqlalchemy import inspect
from app.infrastructure.database.sqlite.session import SessionLocal, engine
from app.core.logging import logger

from app.core.security import hash_password, verify_password
from app.infrastructure.database.sqlite.models.user import UserModel

@dataclass
class User:
    id: str
    first_name: str
    last_name: str
    email: str
    password_hash: str
    role: str  # "customer" | "sales_manager" | "product_manager" | "support_agent"
    address: Optional[str] = None  # Optional user address

class SQLAlchemyUserRepository:
    def __init__(self):
        self._ensure_seed_user()

    def _to_entity(self, model: UserModel) -> User:
        return User(
            id=model.id,
            first_name=model.first_name,
            last_name=model.last_name,
            email=model.email,
            password_hash=model.password_hash,
            role=model.role,
            address=model.address,
        )

    def _ensure_seed_user(self):
        """Ensure seed users exist - protects against accidental deletion"""
        # Skip if table doesn't exist yet (import happens before startup)
        if not inspect(engine).has_table("users"):
            return

        with SessionLocal() as db:
            # Ensure product manager exists
            existing = db.query(UserModel).filter(UserModel.email == "manager@example.com").first()
            if not existing:
                logger.info("Re-creating missing product manager user")
                seeded = UserModel(
                    id=str(uuid.uuid4()),
                    first_name="Prod",
                    last_name="Manager",
                    email="manager@example.com",
                    password_hash=hash_password("12345678"),
                    address="123 Manager Rd, Business City",
                    role="product_manager",
                )
                db.add(seeded)
                db.commit()

            # Ensure sales manager exists
            existing = db.query(UserModel).filter(UserModel.email == "sales@example.com").first()
            if not existing:
                logger.info("Re-creating missing sales manager user")
                seeded = UserModel(
                    id=str(uuid.uuid4()),
                    first_name="Sales",
                    last_name="Manager",
                    email="sales@example.com",
                    password_hash=hash_password("12345678"),
                    address="123 Sales St, Commerce City",
                    role="sales_manager",
                )
                db.add(seeded)
                db.commit()

    def create_user(self, first_name: str, last_name: str, email: str, password: str, role: str = "customer", address: Optional[str] = None) -> User:
        email_l = email.lower()
        with SessionLocal() as db:
            # Uniqueness check
            if db.query(UserModel).filter(UserModel.email == email_l).first():
                raise ValueError("User already exists")

            model = UserModel(
                id=str(uuid.uuid4()),
                first_name=first_name,
                last_name=last_name,
                email=email_l,
                password_hash=hash_password(password),
                role=role,
                address=address,
            )
            db.add(model)
            try:
                db.commit()
            except IntegrityError:
                db.rollback()
                raise ValueError("User already exists")
            db.refresh(model)
            return self._to_entity(model)

    def get_by_email(self, email: str) -> Optional[User]:
        with SessionLocal() as db:
            model = db.query(UserModel).filter(UserModel.email == email.lower()).first()
            return self._to_entity(model) if model else None

    def get_by_id(self, user_id: str) -> Optional[User]:
        with SessionLocal() as db:
            model = db.query(UserModel).filter(UserModel.id == user_id).first()
            return self._to_entity(model) if model else None

    def verify_user(self, email: str, password: str) -> Optional[User]:
        with SessionLocal() as db:
            model = db.query(UserModel).filter(UserModel.email == email.lower()).first()
            if not model or not verify_password(password, model.password_hash):
                return None
            return self._to_entity(model)

repo = SQLAlchemyUserRepository()