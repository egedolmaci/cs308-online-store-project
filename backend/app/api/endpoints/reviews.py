"""
Review API Endpoints
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.infrastructure.database.sqlite.session import get_db
from app.domains.review.schemas import ReviewCreate, ReviewResponse, ReviewApprovalAction
from app.domains.review import use_cases
from app.domains.identity.entity import User
from app.api.endpoints.auth import require_roles
from app.core.logging import logger

router = APIRouter(prefix="/api/v1", tags=["Reviews"])


@router.post("/products/{product_id}/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_product_review(
    product_id: int,
    review_data: ReviewCreate,
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("customer")),
):
    """
    Create a review for a product (customers only).

    Requirements:
    - User must have purchased the product in a delivered order
    - Cannot review the same product from the same order twice
    - Ratings are automatically approved
    - Comments require product manager approval

    Args:
        product_id: ID of the product to review
        review_data: Review data (rating and optional comment)
        order_id: ID of the delivered order containing the product
        current_user: Authenticated user

    Returns:
        Created review details

    Raises:
        400: If validation fails (order not delivered, product not in order, already reviewed)
        401: If not authenticated
        403: If not a customer
    """
    logger.info(f"POST /api/v1/products/{product_id}/reviews - User {current_user.id} creating review")

    review = use_cases.create_review(
        db=db,
        user_id=current_user.id,
        product_id=product_id,
        order_id=order_id,
        rating=review_data.rating,
        comment=review_data.comment,
    )

    if not review:
        logger.warning(f"Review creation failed for user {current_user.id}, product {product_id}, order {order_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create review. Ensure: 1) Order is delivered, 2) Product is in the order, 3) You haven't already reviewed this product from this order"
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
    approval_data: ReviewApprovalAction,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("product_manager")),
):
    """
    Approve or reject a review (product managers only).

    Args:
        review_id: ID of the review
        approval_data: Approval decision (true=approve, false=reject)
        current_user: Authenticated product manager

    Returns:
        Updated review (if approved) or success message (if rejected)

    Raises:
        404: If review not found
        401: If not authenticated
        403: If not a product manager
    """
    logger.info(f"PATCH /api/v1/reviews/{review_id}/approve - Manager {current_user.id} {'approving' if approval_data.approved else 'rejecting'}")

    if approval_data.approved:
        # Approve the review
        review = use_cases.approve_review(db, review_id, current_user.id)
        if not review:
            logger.warning(f"Review {review_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Review {review_id} not found"
            )

        logger.info(f"Review {review_id} approved successfully")
        return review
    else:
        # Reject (delete) the review
        success = use_cases.reject_review(db, review_id)
        if not success:
            logger.warning(f"Review {review_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Review {review_id} not found"
            )

        logger.info(f"Review {review_id} rejected and deleted")
        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            detail="Review rejected"
        )


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
