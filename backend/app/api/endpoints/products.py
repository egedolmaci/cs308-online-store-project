from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.infrastructure.database.sqlite.session import get_db
from app.domains.catalog.schemas import ProductResponse, ProductUpdate
from app.domains.catalog import use_cases

router = APIRouter(prefix="/api/v1/products", tags=["products"])


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

    updated_product = use_cases.update_product(db, product_id, updates)
    if not updated_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found"
        )
    return updated_product