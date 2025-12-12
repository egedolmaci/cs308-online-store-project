"""
Review Domain Entity
"""
from dataclasses import dataclass
from typing import Optional
from datetime import datetime
from enum import Enum

class ReviewStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    DISAPPROVED = "disapproved"

@dataclass
class Review:
    """Review entity representing a product review and rating."""

    id: Optional[int]
    product_id: int
    user_id: str  # UUID from identity system
    user_name: str  # Reviewer's full name (denormalized)
    order_id: int
    rating: Optional[int]  # 1-5 stars (optional)
    comment: Optional[str]
    status: ReviewStatus
    is_approved: bool
    approved_by: Optional[str]  # UUID of product manager who approved
    approved_at: Optional[datetime]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    def __post_init__(self):
        """Validate review data"""
        # At least one of rating or comment must be provided
        if self.rating is None and (self.comment is None or not self.comment.strip()):
            raise ValueError("At least one of rating or comment must be provided")

        # Validate rating if provided
        if self.rating is not None and not 1 <= self.rating <= 5:
            raise ValueError("Rating must be between 1 and 5")

        # Validate comment if provided
        if self.comment and len(self.comment.strip()) < 10:
            raise ValueError("Comment must be at least 10 characters long")
