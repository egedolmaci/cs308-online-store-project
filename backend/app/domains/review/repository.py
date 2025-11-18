"""
Review Domain Repository
"""
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.infrastructure.database.sqlite.models.review import ReviewModel
from app.domains.review.entity import Review


class ReviewRepository:
    """Repository for review data access operations."""

    def __init__(self, db: Session):
        self.db = db

    def create(self, review: Review) -> Review:
        """Create a new review."""
        model = ReviewModel(
            product_id=review.product_id,
            user_id=review.user_id,
            user_name=review.user_name,
            order_id=review.order_id,
            rating=review.rating,
            comment=review.comment,
            is_approved=review.is_approved,
        )

        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)

    def get_by_id(self, review_id: int) -> Optional[Review]:
        """Get a review by ID."""
        model = self.db.query(ReviewModel).filter(ReviewModel.id == review_id).first()
        return self._to_entity(model) if model else None

    def get_by_product(self, product_id: int, approved_only: bool = True) -> List[Review]:
        """Get all reviews for a product."""
        query = self.db.query(ReviewModel).filter(ReviewModel.product_id == product_id)

        if approved_only:
            query = query.filter(ReviewModel.is_approved == True)

        models = query.order_by(ReviewModel.created_at.desc()).all()
        return [self._to_entity(model) for model in models]

    def get_pending_reviews(self) -> List[Review]:
        """Get all reviews pending approval."""
        models = self.db.query(ReviewModel).filter(
            and_(
                ReviewModel.is_approved == False,
                ReviewModel.comment.isnot(None)  # Only reviews with comments need approval
            )
        ).order_by(ReviewModel.created_at.asc()).all()
        return [self._to_entity(model) for model in models]

    def check_existing_review(self, user_id: str, product_id: int, order_id: int) -> Optional[Review]:
        """Check if user already reviewed this product from this order."""
        model = self.db.query(ReviewModel).filter(
            and_(
                ReviewModel.user_id == user_id,
                ReviewModel.product_id == product_id,
                ReviewModel.order_id == order_id
            )
        ).first()
        return self._to_entity(model) if model else None

    def approve_review(self, review_id: int, approved_by: str) -> Optional[Review]:
        """Approve a review."""
        model = self.db.query(ReviewModel).filter(ReviewModel.id == review_id).first()
        if not model:
            return None

        model.is_approved = True
        model.approved_by = approved_by
        model.approved_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)

    def reject_review(self, review_id: int) -> bool:
        """Reject (delete) a review."""
        model = self.db.query(ReviewModel).filter(ReviewModel.id == review_id).first()
        if not model:
            return False

        self.db.delete(model)
        self.db.commit()
        return True

    def get_user_reviews(self, user_id: str) -> List[Review]:
        """Get all reviews by a user."""
        models = self.db.query(ReviewModel).filter(
            ReviewModel.user_id == user_id
        ).order_by(ReviewModel.created_at.desc()).all()
        return [self._to_entity(model) for model in models]

    def _to_entity(self, model: ReviewModel) -> Review:
        """Convert SQLAlchemy model to domain entity."""
        return Review(
            id=model.id,
            product_id=model.product_id,
            user_id=model.user_id,
            user_name=model.user_name,
            order_id=model.order_id,
            rating=model.rating,
            comment=model.comment,
            is_approved=model.is_approved,
            approved_by=model.approved_by,
            approved_at=model.approved_at,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
