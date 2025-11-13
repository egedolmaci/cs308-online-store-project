"""
Review Domain Use Cases (Business Logic)
"""
from typing import List, Optional
from sqlalchemy.orm import Session

from app.domains.review.entity import Review
from app.domains.review.repository import ReviewRepository
from app.domains.order.repository import OrderRepository
from app.domains.order.entity import OrderStatus
from app.infrastructure.database.sqlite.models.order import OrderItemModel


def create_review(
    db: Session,
    user_id: str,
    product_id: int,
    order_id: int,
    rating: int,
    comment: Optional[str] = None
) -> Optional[Review]:
    """
    Create a product review.

    Business rules:
    - User must have purchased the product (order must contain the product)
    - Order must be delivered
    - User cannot review the same product from the same order twice
    - Ratings (1-5) are automatically approved
    - Comments require product manager approval

    Args:
        db: Database session
        user_id: UUID of the user creating the review
        product_id: ID of the product being reviewed
        order_id: ID of the order that contains the product
        rating: Rating (1-5 stars)
        comment: Optional comment text

    Returns:
        Created Review entity if successful, None if validation fails
    """
    review_repo = ReviewRepository(db)
    order_repo = OrderRepository(db)

    # 1. Verify order exists and belongs to user
    order = order_repo.get_by_id(order_id)
    if not order or order.customer_id != user_id:
        return None

    # 2. Verify order is delivered
    if order.status != OrderStatus.DELIVERED:
        return None

    # 3. Verify product is in the order
    order_item = db.query(OrderItemModel).filter(
        OrderItemModel.order_id == order_id,
        OrderItemModel.product_id == product_id
    ).first()

    if not order_item:
        return None

    # 4. Check if user already reviewed this product from this order
    existing_review = review_repo.check_existing_review(user_id, product_id, order_id)
    if existing_review:
        return None

    # 5. Create review
    # Comments require approval, ratings are auto-approved
    is_approved = comment is None or len(comment.strip()) == 0

    review = Review(
        id=None,
        product_id=product_id,
        user_id=user_id,
        order_id=order_id,
        rating=rating,
        comment=comment if comment and comment.strip() else None,
        is_approved=is_approved,
        approved_by=None,
        approved_at=None,
        created_at=None,
        updated_at=None,
    )

    return review_repo.create(review)


def get_product_reviews(db: Session, product_id: int, include_pending: bool = False) -> List[Review]:
    """
    Get all reviews for a product.

    Args:
        db: Database session
        product_id: ID of the product
        include_pending: If True, include pending reviews (for managers)

    Returns:
        List of Review entities
    """
    repo = ReviewRepository(db)
    return repo.get_by_product(product_id, approved_only=not include_pending)


def get_pending_reviews(db: Session) -> List[Review]:
    """
    Get all reviews pending approval (for product managers).

    Args:
        db: Database session

    Returns:
        List of pending Review entities
    """
    repo = ReviewRepository(db)
    return repo.get_pending_reviews()


def approve_review(db: Session, review_id: int, approved_by: str) -> Optional[Review]:
    """
    Approve a review (product manager only).

    Args:
        db: Database session
        review_id: ID of the review to approve
        approved_by: UUID of the product manager approving

    Returns:
        Updated Review entity if found, None otherwise
    """
    repo = ReviewRepository(db)
    return repo.approve_review(review_id, approved_by)


def reject_review(db: Session, review_id: int) -> bool:
    """
    Reject (delete) a review (product manager only).

    Args:
        db: Database session
        review_id: ID of the review to reject

    Returns:
        True if review was deleted, False if not found
    """
    repo = ReviewRepository(db)
    return repo.reject_review(review_id)


def get_user_reviews(db: Session, user_id: str) -> List[Review]:
    """
    Get all reviews created by a user.

    Args:
        db: Database session
        user_id: UUID of the user

    Returns:
        List of Review entities
    """
    repo = ReviewRepository(db)
    return repo.get_user_reviews(user_id)


def get_review_by_id(db: Session, review_id: int) -> Optional[Review]:
    """
    Get a single review by ID.

    Args:
        db: Database session
        review_id: ID of the review

    Returns:
        Review entity if found, None otherwise
    """
    repo = ReviewRepository(db)
    return repo.get_by_id(review_id)
