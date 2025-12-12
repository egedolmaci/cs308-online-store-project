"""
Review Domain Schemas (Pydantic models for API validation)
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, model_validator
from app.domains.review.entity import ReviewStatus

class ReviewCreate(BaseModel):
    """Schema for creating a review."""
    rating: Optional[int] = Field(None, ge=1, le=5, description="Optional rating between 1 and 5 stars")
    comment: Optional[str] = Field(None, min_length=10, max_length=1000, description="Optional comment (min 10 chars)")

    @model_validator(mode='after')
    def check_at_least_one_field(self):
        """Ensure at least one of rating or comment is provided."""
        if self.rating is None and (self.comment is None or not self.comment.strip()):
            raise ValueError("At least one of rating or comment must be provided")
        return self


class ReviewResponse(BaseModel):
    """Schema for review API response."""
    id: int
    product_id: int
    user_id: str
    user_name: str
    order_id: int
    rating: Optional[int]
    comment: Optional[str]
    status: ReviewStatus
    is_approved: bool
    approved_by: Optional[str]
    approved_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReviewApprovalAction(BaseModel):
    """Schema for approving/rejecting a review."""
    approved: bool = Field(..., description="True to approve, False to reject")
