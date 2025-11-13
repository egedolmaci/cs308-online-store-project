"""
Category Domain Use Cases (Business Logic)
"""
from typing import List, Optional
from sqlalchemy.orm import Session

from app.domains.category.entity import Category
from app.domains.category.repository import CategoryRepository


def get_all_categories(db: Session) -> List[Category]:
    """
    Get all categories

    Args:
        db: Database session

    Returns:
        List of all categories
    """
    repo = CategoryRepository(db)
    return repo.get_all()


def get_category_by_id(db: Session, category_id: int) -> Optional[Category]:
    """
    Get a single category by ID

    Args:
        db: Database session
        category_id: Category ID

    Returns:
        Category if found, None otherwise
    """
    repo = CategoryRepository(db)
    return repo.get_by_id(category_id)


def create_category(db: Session, name: str) -> Optional[Category]:
    """
    Create a new category

    Args:
        db: Database session
        name: Category name

    Returns:
        Created category if successful, None if category already exists
    """
    repo = CategoryRepository(db)

    # Check if category already exists
    existing = repo.get_by_name(name)
    if existing:
        return None

    category = Category(id=None, name=name)
    return repo.create(category)


def update_category(db: Session, category_id: int, name: str) -> Optional[Category]:
    """
    Update a category

    Args:
        db: Database session
        category_id: Category ID
        name: New category name

    Returns:
        Updated category if successful, None if category not found or name already exists
    """
    repo = CategoryRepository(db)
    return repo.update(category_id, name)


def delete_category(db: Session, category_id: int) -> bool:
    """
    Delete a category

    Args:
        db: Database session
        category_id: Category ID

    Returns:
        True if category was deleted, False if not found
    """
    repo = CategoryRepository(db)
    return repo.delete(category_id)