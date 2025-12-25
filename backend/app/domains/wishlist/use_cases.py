from typing import List
from sqlalchemy.orm import Session

from app.domains.catalog.repository import ProductRepository
from app.domains.catalog.entity import Product
from app.domains.wishlist.repository import WishlistRepository


def list_wishlist(db: Session, user_id: str, wishlist_repo: WishlistRepository) -> List[Product]:
    repo = wishlist_repo
    product_repo = ProductRepository(db)
    items = repo.list_items(user_id)
    products: List[Product] = []
    for item in items:
        product = product_repo.get_by_id(item.product_id)
        if product:
            products.append(product)
    return products


def add_to_wishlist(db: Session, user_id: str, product_id: int, wishlist_repo: WishlistRepository) -> Product:
    product_repo = ProductRepository(db)
    product = product_repo.get_by_id(product_id)
    if not product:
        raise ValueError("Product not found")

    repo = wishlist_repo
    if repo.exists(user_id, product_id):
        raise ValueError("Already in wishlist")
    repo.add_item(user_id, product_id)
    return product


def remove_from_wishlist(db: Session, user_id: str, product_id: int, wishlist_repo: WishlistRepository) -> bool:
    repo = wishlist_repo
    return repo.remove_item(user_id, product_id)


def clear_wishlist(db: Session, user_id: str, wishlist_repo: WishlistRepository) -> int:
    repo = wishlist_repo
    return repo.clear(user_id)
