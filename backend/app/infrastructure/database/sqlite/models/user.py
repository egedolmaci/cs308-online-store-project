from sqlalchemy import Column, String
from app.infrastructure.database.sqlite.session import Base

class UserModel(Base):
    __tablename__ = "users"

    # UUID string (36 chars) as primary key
    id = Column(String(36), primary_key=True, index=True)

    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="customer")

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"