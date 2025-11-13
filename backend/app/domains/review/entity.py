"""
Review Domain Entity
"""
from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass
class Review:
    """Review entity representing a product review and rating."""

    id: Optional[int]
    product_id: int
    user_id: str  # UUID from identity system
    order_id: int
    rating: int  # 1-5 stars
    comment: Optional[str]
    is_approved: bool
    approved_by: Optional[str]  # UUID of product manager who approved
    approved_at: Optional[datetime]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    def __post_init__(self):
        """Validate review data"""
        if not 1 <= self.rating <= 5:
            raise ValueError("Rating must be between 1 and 5")

        if self.comment and len(self.comment.strip()) < 10:
            raise ValueError("Comment must be at least 10 characters long")
