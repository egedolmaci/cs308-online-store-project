from typing import List, Optional
from sqlalchemy.orm import Session
from app.infrastructure.database.sqlite.models.product import ProductModel
from app.domains.catalog.entity import Product


class ProductRepository:
    """Repository for product data access operations."""

    def __init__(self, db: Session):
        self.db = db

    def create(self, product_data: dict) -> Product:
        """Create a new product in the database."""
        product = ProductModel(**product_data)
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        return self._to_entity(product)

    def get_all(self) -> List[Product]:
        """Retrieve all products from the database."""
        products = self.db.query(ProductModel).all()
        return [self._to_entity(p) for p in products]

    def get_by_id(self, product_id: int, lock_for_update: bool = False) -> Optional[Product]:
        """Retrieve a single product by ID.

        Args:
            product_id: ID of the product
            lock_for_update: If True, acquire row lock to prevent race conditions
        """
        query = self.db.query(ProductModel).filter(ProductModel.id == product_id)
        if lock_for_update:
            query = query.with_for_update()
        product = query.first()
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
    
    def apply_discount(self, product_ids: List[int], discount_rate: float) -> List[Product]:
        """Set discount metadata without overwriting base price."""
        if discount_rate <= 0 or discount_rate > 100:
            raise ValueError("discount_rate must be between 0 and 100")

        products = self.db.query(ProductModel).filter(ProductModel.id.in_(product_ids)).all()
        if not products:
            return []

        for product in products:
            product.discount_rate = discount_rate
            product.discount_active = True

        self.db.commit()
        for product in products:
            self.db.refresh(product)

        return [self._to_entity(p) for p in products]

    def clear_discount(self, product_ids: List[int]) -> List[Product]:
        products = self.db.query(ProductModel).filter(ProductModel.id.in_(product_ids)).all()
        if not products:
            return []

        for product in products:
            product.discount_rate = 0.0
            product.discount_active = False

        self.db.commit()
        for product in products:
            self.db.refresh(product)

        return [self._to_entity(p) for p in products]
   

    def _to_entity(self, model: ProductModel) -> Product:
        final_price = (
            round(model.price * (1 - model.discount_rate / 100), 2)
            if model.discount_active and model.discount_rate > 0
            else model.price
        )
        return Product(
            id=model.id,
            name=model.name,
            model=model.model,
            serial_number=model.serial_number,
            description=model.description,
            price=model.price,  # base
            stock=model.stock,
            category_id=model.category_id,
            category=model.category.name,
            image=model.image,
            rating=model.rating,
            warranty_status=model.warranty_status,
            distributor=model.distributor,
            discount_rate=model.discount_rate,
            discount_active=model.discount_active,
            final_price=final_price,
        )