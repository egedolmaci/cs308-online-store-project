"""
Category Database Model
"""
from sqlalchemy import Column, Integer, String
from app.infrastructure.database.sqlite.session import Base


class CategoryModel(Base):
    """SQLAlchemy model for categories table"""

    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True, index=True)

    def __repr__(self):
        return f"<Category(id={self.id}, name='{self.name}')>"