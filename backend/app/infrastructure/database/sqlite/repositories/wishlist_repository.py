from typing import List
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.domains.wishlist.repository import WishlistRepository, WishlistItem
from app.infrastructure.database.sqlite.models.wishlist import WishlistModel


class WishlistRepositorySQLite(WishlistRepository):
    """SQLite implementation of the wishlist repository."""

    def __init__(self, db: Session):
        self.db = db

    def get_user_ids_by_product(self, product_id: int) -> List[str]:
        stmt = select(WishlistModel.user_id).where(WishlistModel.product_id == product_id)
        rows = self.db.execute(stmt).scalars().all()
        # De-duplicate in case of unexpected duplicates
        return list(set(rows))

    def exists(self, user_id: str, product_id: int) -> bool:
        return (
            self.db.query(WishlistModel)
            .filter(
                WishlistModel.user_id == user_id,
                WishlistModel.product_id == product_id,
            )
            .first()
            is not None
        )

    # Optional helpers for future wishlist CRUD usage
    def add_item(self, user_id: str, product_id: int) -> WishlistItem:
        existing = (
            self.db.query(WishlistModel)
            .filter(
                WishlistModel.user_id == user_id,
                WishlistModel.product_id == product_id,
            )
            .first()
        )
        if existing:
            return WishlistItem(
                id=existing.id,
                user_id=existing.user_id,
                product_id=existing.product_id,
                created_at=existing.created_at,
            )
        item = WishlistModel(user_id=user_id, product_id=product_id)
        self.db.add(item)
        try:
            self.db.commit()
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Already in wishlist")
        self.db.refresh(item)
        return WishlistItem(
            id=item.id,
            user_id=item.user_id,
            product_id=item.product_id,
            created_at=item.created_at,
        )

    def remove_item(self, user_id: str, product_id: int) -> bool:
        deleted = (
            self.db.query(WishlistModel)
            .filter(
                WishlistModel.user_id == user_id,
                WishlistModel.product_id == product_id,
            )
            .delete()
        )
        if deleted:
            self.db.commit()
        return bool(deleted)

    def list_items(self, user_id: str) -> List[WishlistItem]:
        items = (
            self.db.query(WishlistModel)
            .filter(WishlistModel.user_id == user_id)
            .order_by(WishlistModel.created_at.desc())
            .all()
        )
        return [
            WishlistItem(
                id=item.id,
                user_id=item.user_id,
                product_id=item.product_id,
                created_at=item.created_at,
            )
            for item in items
        ]

    def clear(self, user_id: str) -> int:
        deleted = self.db.query(WishlistModel).filter(WishlistModel.user_id == user_id).delete()
        if deleted:
            self.db.commit()
        return int(deleted)
