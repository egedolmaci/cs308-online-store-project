from typing import List, Optional
from sqlalchemy.orm import Session
from app.domains.catalog.repository import ProductRepository
from app.domains.catalog.entity import Product


def get_all_products(db: Session) -> List[Product]:
    """
    Retrieve all products from the catalog.

    Args:
        db: Database session

    Returns:
        List of Product entities
    """
    repository = ProductRepository(db)
    return repository.get_all()


def get_single_product(db: Session, product_id: int) -> Optional[Product]:
    """
    Retrieve a single product by ID.

    Args:
        db: Database session
        product_id: ID of the product to retrieve

    Returns:
        Product entity if found, None otherwise
    """
    repository = ProductRepository(db)
    return repository.get_by_id(product_id)


def delete_product(db: Session, product_id: int) -> bool:
    """
    Delete a product by ID.

    Args:
        db: Database session
        product_id: ID of the product to delete

    Returns:
        True if product was deleted, False if not found
    """
    repository = ProductRepository(db)
    return repository.delete(product_id)


def update_product(db: Session, product_id: int, updates: dict) -> Optional[Product]:
    """
    Update a product with the provided fields.

    Args:
        db: Database session
        product_id: ID of the product to update
        updates: Dictionary of fields to update

    Returns:
        Updated Product entity if found, None otherwise
    """
    repository = ProductRepository(db)
    return repository.update(product_id, updates)