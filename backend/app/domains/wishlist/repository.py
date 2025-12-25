from typing import Protocol, List, Optional
from datetime import datetime


class WishlistItem:
    def __init__(self, id: int, user_id: str, product_id: int, created_at: datetime):
        self.id = id
        self.user_id = user_id
        self.product_id = product_id
        self.created_at = created_at


class WishlistRepository(Protocol):
    def get_user_ids_by_product(self, product_id: int) -> List[str]:
        """Return distinct user IDs who have this product in their wishlist."""

    def exists(self, user_id: str, product_id: int) -> bool:
        ...

    def add_item(self, user_id: str, product_id: int) -> WishlistItem:
        ...

    def remove_item(self, user_id: str, product_id: int) -> bool:
        ...

    def list_items(self, user_id: str) -> List[WishlistItem]:
        ...

    def clear(self, user_id: str) -> int:
        """Clear all wishlist items for a user. Returns number deleted."""
        ...
