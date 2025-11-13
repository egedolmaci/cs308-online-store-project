from typing import List, Optional
from sqlalchemy.orm import Session
from app.infrastructure.database.sqlite.models.product import ProductModel
from app.domains.catalog.entity import Product


class ProductRepository:
    """Repository for product data access operations."""

    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Product]:
        """Retrieve all products from the database."""
        products = self.db.query(ProductModel).all()
        return [self._to_entity(p) for p in products]

    def get_by_id(self, product_id: int) -> Optional[Product]:
        """Retrieve a single product by ID."""
        product = self.db.query(ProductModel).filter(ProductModel.id == product_id).first()
        return self._to_entity(product) if product else None

    def delete(self, product_id: int) -> bool:
        """Delete a product by ID. Returns True if deleted, False if not found."""
        product = self.db.query(ProductModel).filter(ProductModel.id == product_id).first()
        if product:
            self.db.delete(product)
            self.db.commit()
            return True
        return False

    def update(self, product_id: int, updates: dict) -> Optional[Product]:
        """Update a product with the provided fields. Returns updated product or None if not found."""
        product = self.db.query(ProductModel).filter(ProductModel.id == product_id).first()
        if not product:
            return None

        # Update only the provided fields
        for key, value in updates.items():
            if hasattr(product, key) and value is not None:
                setattr(product, key, value)

        self.db.commit()
        self.db.refresh(product)
        return self._to_entity(product)

    def _to_entity(self, model: ProductModel) -> Product:
        """Convert SQLAlchemy model to domain entity."""
        return Product(
            id=model.id,
            name=model.name,
            model=model.model,
            serial_number=model.serial_number,
            description=model.description,
            price=model.price,
            stock=model.stock,
            category_id=model.category_id,
            category=model.category.name,  # Extract category name from relationship
            image=model.image,
            rating=model.rating,
            warranty_status=model.warranty_status,
            distributor=model.distributor,
        )
