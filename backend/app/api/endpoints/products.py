from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.infrastructure.database.sqlite.session import get_db
from app.domains.catalog.schemas import ProductResponse, ProductCreate, ProductUpdate, ProductDiscountRequest, ProductDiscountClearRequest
from app.domains.catalog import use_cases
from app.infrastructure.database.sqlite.repositories.wishlist_repository import WishlistRepositorySQLite
from app.domains.notifications.notifier import ConsoleWishlistNotifier
from app.infrastructure.notifications.email_notifier import EmailWishlistNotifier
from app.core.config import get_settings

settings = get_settings()


def _get_notifier(db: Session):
    if settings.SMTP_HOST and settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
        return EmailWishlistNotifier(db)
    return ConsoleWishlistNotifier()

router = APIRouter(prefix="/api/v1/products", tags=["products"])


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    """
    Create a new product in the catalog.

    Args:
        product: Product data to create

    Returns:
        Created product details

    Raises:
        HTTPException: 400 if serial_number already exists
    """
    try:
        product_data = product.model_dump()
        if(product_data.get("image") == ""):
            product_data["image"] = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
        created_product = use_cases.create_product(db, product_data)
        return created_product
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("", response_model=List[ProductResponse])
def get_all_products(db: Session = Depends(get_db)):
    """
    Retrieve all products from the catalog.

    Returns:
        List of all products
    """
    products = use_cases.get_all_products(db)
    return products


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a single product by ID.

    Args:
        product_id: The ID of the product to retrieve

    Returns:
        Product details

    Raises:
        HTTPException: 404 if product not found
    """
    product = use_cases.get_single_product(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found"
        )
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """
    Delete a product by ID.

    Args:
        product_id: The ID of the product to delete

    Raises:
        HTTPException: 404 if product not found
    """
    deleted = use_cases.delete_product(db, product_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found"
        )
    return None


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a product with the provided fields.

    Args:
        product_id: The ID of the product to update
        product_update: Fields to update (all optional)

    Returns:
        Updated product details

    Raises:
        HTTPException: 404 if product not found
    """
    # Convert Pydantic model to dict, excluding None values
    updates = product_update.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update"
        )

    wishlist_repo = WishlistRepositorySQLite(db)
    notifier = _get_notifier(db)

    updated_product = use_cases.update_product(
        db,
        product_id,
        updates,
        wishlist_repo=wishlist_repo,
        notifier=notifier,
    )
    if not updated_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found"
        )
    return updated_product


@router.patch("/discount", response_model=List[ProductResponse])
def apply_discount(discount_request: ProductDiscountRequest, db: Session = Depends(get_db)):
    """
    Apply a percentage discount to multiple products and return the updated products.
    """
    try:
        wishlist_repo = WishlistRepositorySQLite(db)
        notifier = _get_notifier(db)

        updated_products = use_cases.apply_discount(
            db,
            discount_request.product_ids,
            discount_rate=discount_request.discount_rate,
            wishlist_repo=wishlist_repo,
            notifier=notifier,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    if not updated_products:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No products found for the provided IDs",
        )

    return updated_products


@router.patch("/discount/clear", response_model=List[ProductResponse])
def clear_discount(discount_request: ProductDiscountClearRequest, db: Session = Depends(get_db)):
    wishlist_repo = WishlistRepositorySQLite(db)
    notifier = _get_notifier(db)

    cleared_products = use_cases.clear_discount(
        db,
        discount_request.product_ids,
        wishlist_repo=wishlist_repo,
        notifier=notifier,
    )
    if not cleared_products:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No products found for the provided IDs",
        )
    return cleared_products
