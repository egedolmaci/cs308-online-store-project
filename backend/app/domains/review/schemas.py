"""
Review Domain Schemas (Pydantic models for API validation)
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class ReviewCreate(BaseModel):
    """Schema for creating a review."""
    rating: int = Field(ge=1, le=5, description="Rating between 1 and 5 stars")
    comment: Optional[str] = Field(None, min_length=10, max_length=1000, description="Optional comment (min 10 chars)")


class ReviewResponse(BaseModel):
    """Schema for review API response."""
    id: int
    product_id: int
    user_id: str
    order_id: int
    rating: int
    comment: Optional[str]
    is_approved: bool
    approved_by: Optional[str]
    approved_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReviewApprovalAction(BaseModel):
    """Schema for approving/rejecting a review."""
    approved: bool = Field(..., description="True to approve, False to reject")
