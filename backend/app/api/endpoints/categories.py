"""
Category API Endpoints
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.infrastructure.database.sqlite.session import get_db
from app.domains.category.schemas import CategoryCreate, CategoryResponse, CategoryUpdate
from app.domains.category import use_cases
from app.core.logging import logger

router = APIRouter(prefix="/api/v1/categories", tags=["Categories"])


@router.get("", response_model=List[CategoryResponse])
def get_all_categories(db: Session = Depends(get_db)):
    """
    Get all categories

    Returns:
        List of all categories
    """
    logger.info("GET /api/v1/categories - Fetching all categories")
    categories = use_cases.get_all_categories(db)
    logger.info(f"Found {len(categories)} categories")
    return categories


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    """
    Get a single category by ID

    Args:
        category_id: Category ID

    Returns:
        Category details

    Raises:
        404: Category not found
    """
    logger.info(f"GET /api/v1/categories/{category_id} - Fetching category")
    category = use_cases.get_category_by_id(db, category_id)

    if not category:
        logger.warning(f"Category {category_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {category_id} not found"
        )

    logger.info(f"Category found: {category.name}")
    return category


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_data: CategoryCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new category

    Args:
        category_data: Category creation data

    Returns:
        Created category

    Raises:
        400: Category with this name already exists
    """
    logger.info(f"POST /api/v1/categories - Creating category: {category_data.name}")

    category = use_cases.create_category(db, category_data.name)

    if not category:
        logger.warning(f"Category '{category_data.name}' already exists")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category '{category_data.name}' already exists"
        )

    logger.info(f"Category created successfully with id {category.id}")
    return category


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a category

    Args:
        category_id: Category ID
        category_data: Updated category data

    Returns:
        Updated category

    Raises:
        404: Category not found
        400: Category name already exists
    """
    logger.info(f"PUT /api/v1/categories/{category_id} - Updating category to: {category_data.name}")

    # Check if category exists
    existing = use_cases.get_category_by_id(db, category_id)
    if not existing:
        logger.warning(f"Category {category_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {category_id} not found"
        )

    # Update category
    category = use_cases.update_category(db, category_id, category_data.name)

    if not category:
        logger.warning(f"Category name '{category_data.name}' already exists")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category '{category_data.name}' already exists"
        )

    logger.info(f"Category {category_id} updated successfully")
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    """
    Delete a category

    Args:
        category_id: Category ID

    Raises:
        404: Category not found
        400: Category has products (foreign key constraint)
    """
    logger.info(f"DELETE /api/v1/categories/{category_id} - Deleting category")

    try:
        success = use_cases.delete_category(db, category_id)

        if not success:
            logger.warning(f"Category {category_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found"
            )

        logger.info(f"Category {category_id} deleted successfully")
        return None

    except Exception as e:
        # Handle foreign key constraint violation
        if "FOREIGN KEY constraint failed" in str(e) or "IntegrityError" in str(type(e)):
            logger.warning(f"Cannot delete category {category_id} - has associated products")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot delete category - it has associated products. Please reassign or delete the products first."
            )
        raise
