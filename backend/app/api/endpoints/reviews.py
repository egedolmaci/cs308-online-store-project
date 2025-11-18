"""
Review API Endpoints
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.infrastructure.database.sqlite.session import get_db
from app.domains.review.schemas import ReviewCreate, ReviewResponse
from app.domains.review import use_cases
from app.domains.identity.repository import User
from app.api.endpoints.auth import require_roles
from app.core.logging import logger

router = APIRouter(prefix="/api/v1", tags=["Reviews"])


@router.post("/products/{product_id}/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_product_review(
    product_id: int,
    review_data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("customer")),
):
    """
    Create a review for a product (customers only).

    Requirements:
    - User must have purchased the product in a delivered order
    - User can only review each product once
    - Ratings are automatically approved
    - Comments require product manager approval

    Args:
        product_id: ID of the product to review
        review_data: Review data (rating and optional comment)
        current_user: Authenticated user

    Returns:
        Created review details

    Raises:
        400: If validation fails (no delivered order with product, already reviewed)
        401: If not authenticated
        403: If not a customer
    """
    logger.info(f"POST /api/v1/products/{product_id}/reviews - User {current_user.id} creating review")

    # Construct full name from user
    user_name = f"{current_user.first_name} {current_user.last_name}"

    review = use_cases.create_review(
        db=db,
        user_id=current_user.id,
        user_name=user_name,
        product_id=product_id,
        rating=review_data.rating,
        comment=review_data.comment,
    )

    if not review:
        logger.warning(f"Review creation failed for user {current_user.id}, product {product_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create review. You must have purchased this product in a delivered order and not already reviewed it."
        )

    logger.info(f"Review {review.id} created successfully (approved={review.is_approved})")
    return review


@router.get("/products/{product_id}/reviews", response_model=List[ReviewResponse])
def get_product_reviews(
    product_id: int,
    db: Session = Depends(get_db),
):
    """
    Get all approved reviews for a product (public endpoint).

    Args:
        product_id: ID of the product

    Returns:
        List of approved reviews
    """
    logger.info(f"GET /api/v1/products/{product_id}/reviews - Fetching approved reviews")

    reviews = use_cases.get_product_reviews(db, product_id, include_pending=False)
    logger.info(f"Found {len(reviews)} approved reviews for product {product_id}")

    return reviews


@router.get("/reviews/pending", response_model=List[ReviewResponse])
def get_pending_reviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("product_manager")),
):
    """
    Get all reviews pending approval (product managers only).

    Args:
        current_user: Authenticated product manager

    Returns:
        List of pending reviews

    Raises:
        401: If not authenticated
        403: If not a product manager
    """
    logger.info(f"GET /api/v1/reviews/pending - Product manager {current_user.id} fetching pending reviews")

    reviews = use_cases.get_pending_reviews(db)
    logger.info(f"Found {len(reviews)} pending reviews")

    return reviews


@router.get("/reviews/my-reviews", response_model=List[ReviewResponse])
def get_my_reviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("customer")),
):
    """
    Get all reviews created by the current user.

    Args:
        current_user: Authenticated user

    Returns:
        List of user's reviews

    Raises:
        401: If not authenticated
    """
    logger.info(f"GET /api/v1/reviews/my-reviews - User {current_user.id} fetching their reviews")

    reviews = use_cases.get_user_reviews(db, current_user.id)
    logger.info(f"Found {len(reviews)} reviews for user {current_user.id}")

    return reviews


@router.patch("/reviews/{review_id}/approve", response_model=ReviewResponse)
def approve_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("product_manager")),
):
    """
    Approve a review (product managers only).

    Args:
        review_id: ID of the review to approve
        current_user: Authenticated product manager

    Returns:
        Approved review

    Raises:
        404: If review not found
        401: If not authenticated
        403: If not a product manager
    """
    logger.info(f"PATCH /api/v1/reviews/{review_id}/approve - Manager {current_user.id} approving review")

    review = use_cases.approve_review(db, review_id, current_user.id)
    if not review:
        logger.warning(f"Review {review_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Review {review_id} not found"
        )

    logger.info(f"Review {review_id} approved successfully")
    return review


@router.delete("/reviews/{review_id}/reject", status_code=status.HTTP_204_NO_CONTENT)
def reject_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("product_manager")),
):
    """
    Reject a review (product managers only).
    This will delete the review permanently.

    Args:
        review_id: ID of the review to reject
        current_user: Authenticated product manager

    Returns:
        No content (204)

    Raises:
        404: If review not found
        401: If not authenticated
        403: If not a product manager
    """
    logger.info(f"DELETE /api/v1/reviews/{review_id}/reject - Manager {current_user.id} rejecting review")

    success = use_cases.reject_review(db, review_id)
    if not success:
        logger.warning(f"Review {review_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Review {review_id} not found"
        )

    logger.info(f"Review {review_id} rejected and deleted successfully")
    return None


@router.get("/reviews/{review_id}", response_model=ReviewResponse)
def get_review(
    review_id: int,
    db: Session = Depends(get_db),
):
    """
    Get a single review by ID.

    Args:
        review_id: ID of the review

    Returns:
        Review details

    Raises:
        404: If review not found or not approved
    """
    logger.info(f"GET /api/v1/reviews/{review_id} - Fetching review")

    review = use_cases.get_review_by_id(db, review_id)
    if not review:
        logger.warning(f"Review {review_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Review {review_id} not found"
        )

    # Only return approved reviews to public
    if not review.is_approved:
        logger.warning(f"Review {review_id} not approved")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Review {review_id} not found"
        )

    return review
