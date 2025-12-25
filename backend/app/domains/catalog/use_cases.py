from typing import List, Optional
from sqlalchemy.orm import Session
from app.domains.catalog.repository import ProductRepository
from app.domains.catalog.entity import Product
from app.domains.notifications.notifier import WishlistNotifier
from app.domains.wishlist.repository import WishlistRepository


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


def update_product(
    db: Session,
    product_id: int,
    updates: dict,
    wishlist_repo: Optional[WishlistRepository] = None,
    notifier: Optional[WishlistNotifier] = None,
) -> Optional[Product]:
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
    previous = repository.get_by_id(product_id)
    updated = repository.update(product_id, updates)

    if previous and updated and wishlist_repo and notifier:
        _notify_wishlist_on_changes(wishlist_repo, notifier, previous, updated)

    return updated


def apply_discount(
    db: Session,
    product_ids: List[int],
    discount_rate: float,
    wishlist_repo: Optional[WishlistRepository] = None,
    notifier: Optional[WishlistNotifier] = None,
) -> List[Product]:
    """
    Apply a percentage discount to multiple products.
    """
    repository = ProductRepository(db)
    previous_map = {pid: repository.get_by_id(pid) for pid in product_ids}
    updated_products = repository.apply_discount(product_ids, discount_rate)

    if wishlist_repo and notifier:
        for product in updated_products:
            previous = previous_map.get(product.id)
            if previous:
                _notify_wishlist_on_changes(wishlist_repo, notifier, previous, product)

    return updated_products


def clear_discount(
    db: Session,
    product_ids: List[int],
    wishlist_repo: Optional[WishlistRepository] = None,
    notifier: Optional[WishlistNotifier] = None,
) -> List[Product]:
    repository = ProductRepository(db)
    previous_map = {pid: repository.get_by_id(pid) for pid in product_ids}
    updated_products = repository.clear_discount(product_ids)

    if wishlist_repo and notifier:
        for product in updated_products:
            previous = previous_map.get(product.id)
            if previous:
                _notify_wishlist_on_changes(wishlist_repo, notifier, previous, product)

    return updated_products


def _notify_wishlist_on_changes(
    wishlist_repo: WishlistRepository,
    notifier: WishlistNotifier,
    previous: Product,
    current: Product,
) -> None:
    user_ids = wishlist_repo.get_user_ids_by_product(int(current.id))
    if not user_ids:
        return

    # Stock back in (0 -> >0)
    if previous.stock == 0 and current.stock > 0:
        notifier.send_stock_email(
            user_ids,
            {
                "id": current.id,
                "name": current.name,
                "price": current.price,
                "final_price": current.final_price or current.price,
                "stock": current.stock,
                "image": getattr(current, "image", None),
            },
        )

    # Stock depleted (>0 -> 0)
    if previous.stock > 0 and current.stock == 0:
        notifier.send_out_of_stock_email(
            user_ids,
            {
                "id": current.id,
                "name": current.name,
                "price": current.price,
                "final_price": current.final_price or current.price,
                "stock": current.stock,
                "image": getattr(current, "image", None),
            },
        )

    # Discount state changed
    if (
        previous.discount_active != current.discount_active
        or (previous.discount_rate or 0) != (current.discount_rate or 0)
    ):
        notifier.send_discount_email(
            user_ids,
            {
                "id": current.id,
                "name": current.name,
                "price": current.price,
                "final_price": current.final_price or current.price,
                "image": getattr(current, "image", None),
            },
            current.discount_active,
            current.discount_rate or 0,
        )
