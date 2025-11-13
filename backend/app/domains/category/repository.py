"""
Category Domain Repository
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.infrastructure.database.sqlite.models.category import CategoryModel
from app.domains.category.entity import Category


class CategoryRepository:
    """Repository for category data access"""

    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Category]:
        """Get all categories"""
        models = self.db.query(CategoryModel).order_by(CategoryModel.name).all()
        return [self._to_entity(model) for model in models]

    def get_by_id(self, category_id: int) -> Optional[Category]:
        """Get a category by ID"""
        model = self.db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
        return self._to_entity(model) if model else None

    def get_by_name(self, name: str) -> Optional[Category]:
        """Get a category by name (case-insensitive)"""
        model = self.db.query(CategoryModel).filter(
            CategoryModel.name.ilike(name)
        ).first()
        return self._to_entity(model) if model else None

    def create(self, category: Category) -> Optional[Category]:
        """Create a new category"""
        try:
            model = CategoryModel(name=category.name)
            self.db.add(model)
            self.db.commit()
            self.db.refresh(model)
            return self._to_entity(model)
        except IntegrityError:
            self.db.rollback()
            return None  # Category with this name already exists

    def update(self, category_id: int, name: str) -> Optional[Category]:
        """Update a category"""
        model = self.db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
        if not model:
            return None

        try:
            model.name = name
            self.db.commit()
            self.db.refresh(model)
            return self._to_entity(model)
        except IntegrityError:
            self.db.rollback()
            return None  # Category with this name already exists

    def delete(self, category_id: int) -> bool:
        """Delete a category"""
        model = self.db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
        if not model:
            return False

        self.db.delete(model)
        self.db.commit()
        return True

    def _to_entity(self, model: CategoryModel) -> Category:
        """Convert database model to domain entity"""
        return Category(
            id=model.id,
            name=model.name
        )