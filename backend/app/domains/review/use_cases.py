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
from app.infrastructure.database.sqlite.models.review import ReviewModel


def create_review(
    db: Session,
    user_id: str,
    user_name: str,
    product_id: int,
    rating: Optional[int] = None,
    comment: Optional[str] = None
) -> Optional[Review]:
    """
    Create a product review.

    Business rules:
    - User must have purchased the product in a delivered order
    - User can only review each product once (regardless of how many times purchased)
    - At least one of rating or comment must be provided
    - Ratings (1-5) are automatically approved
    - Comments require product manager approval

    Args:
        db: Database session
        user_id: UUID of the user creating the review
        user_name: Full name of the user (for display)
        product_id: ID of the product being reviewed
        rating: Optional rating (1-5 stars)
        comment: Optional comment text

    Returns:
        Created Review entity if successful, None if validation fails
    """
    review_repo = ReviewRepository(db)
    order_repo = OrderRepository(db)

    # 0. Validate at least one field is provided
    if rating is None and (comment is None or not comment.strip()):
        return None  # Must provide either rating or comment

    # 1. Check if user already reviewed this product (regardless of order)
    existing_reviews = db.query(ReviewModel).filter(
        ReviewModel.user_id == user_id,
        ReviewModel.product_id == product_id
    ).first()

    if existing_reviews:
        return None  # User already reviewed this product

    # 2. Find any delivered order that contains this product for this user
    # Get all user's delivered orders
    user_orders = order_repo.get_all_orders(customer_id=user_id)
    delivered_orders = [order for order in user_orders if order.status == OrderStatus.DELIVERED]

    # Find an order that contains the product
    valid_order_id = None
    for order in delivered_orders:
        order_item = db.query(OrderItemModel).filter(
            OrderItemModel.order_id == order.id,
            OrderItemModel.product_id == product_id
        ).first()

        if order_item:
            valid_order_id = order.id
            break

    # 3. If no valid order found, user hasn't purchased this product
    if valid_order_id is None:
        return None

    # 4. Create review
    # Comments require approval, ratings are auto-approved
    is_approved = comment is None or len(comment.strip()) == 0

    review = Review(
        id=None,
        product_id=product_id,
        user_id=user_id,
        user_name=user_name,
        order_id=valid_order_id,
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
