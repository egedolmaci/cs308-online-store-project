from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.endpoints.auth import get_current_user
from app.infrastructure.database.sqlite.session import get_db
from app.infrastructure.database.sqlite.repositories.wishlist_repository import WishlistRepositorySQLite
from app.domains.catalog.schemas import ProductResponse
from app.domains.wishlist import use_cases as wishlist_use_cases

router = APIRouter(prefix="/api/v1/wishlist", tags=["wishlist"])


class WishlistAddRequest(BaseModel):
    product_id: int = Field(..., gt=0)


@router.get("", response_model=List[ProductResponse])
def list_wishlist(
    user_with_role=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user, _role = user_with_role
    wishlist_repo = WishlistRepositorySQLite(db)
    products = wishlist_use_cases.list_wishlist(db, user.id, wishlist_repo)
    return products


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def add_to_wishlist(
    payload: WishlistAddRequest,
    user_with_role=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user, _role = user_with_role
    wishlist_repo = WishlistRepositorySQLite(db)
    try:
        product = wishlist_use_cases.add_to_wishlist(db, user.id, payload.product_id, wishlist_repo)
    except ValueError as e:
        message = str(e)
        if message == "Already in wishlist":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Product already in wishlist",
            )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_wishlist(
    product_id: int,
    user_with_role=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user, _role = user_with_role
    wishlist_repo = WishlistRepositorySQLite(db)
    removed = wishlist_use_cases.remove_from_wishlist(db, user.id, product_id, wishlist_repo)
    if not removed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wishlist item not found",
        )
    return None


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def clear_wishlist(
    user_with_role=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user, _role = user_with_role
    wishlist_repo = WishlistRepositorySQLite(db)
    wishlist_use_cases.clear_wishlist(db, user.id, wishlist_repo)
    return None
