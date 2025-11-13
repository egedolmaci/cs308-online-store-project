"""
Category Domain Schemas (Pydantic models for API validation)
"""
from pydantic import BaseModel, Field, field_validator


class CategoryCreate(BaseModel):
    """Schema for creating a new category"""
    name: str = Field(..., min_length=1, max_length=100, description="Category name")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        """Validate and normalize category name"""
        if not v or not v.strip():
            raise ValueError("Category name cannot be empty")
        return v.strip().title()


class CategoryResponse(BaseModel):
    """Schema for category API responses"""
    id: int = Field(..., description="Category ID")
    name: str = Field(..., description="Category name")

    class Config:
        from_attributes = True  # Pydantic v2 (replaces orm_mode)


class CategoryUpdate(BaseModel):
    """Schema for updating a category"""
    name: str = Field(..., min_length=1, max_length=100, description="New category name")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        """Validate and normalize category name"""
        if not v or not v.strip():
            raise ValueError("Category name cannot be empty")
        return v.strip().title()