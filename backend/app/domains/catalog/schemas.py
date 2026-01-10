from typing import Optional, List
from pydantic import BaseModel, ConfigDict, field_validator, Field


class ProductCreate(BaseModel):
    """Schema for creating a new product."""

    name: str = Field(min_length=1, max_length=200)
    model: str = Field(min_length=1, max_length=100)
    serial_number: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    price: float = Field(gt=0)
    stock: int = Field(ge=0)
    category_id: int = Field(gt=0)
    image: Optional[str] = Field(None, max_length=500)
    rating: Optional[float] = Field(None, ge=0, le=5)
    warranty_status: Optional[str] = Field(None, max_length=100)
    distributor: Optional[str] = Field(None, max_length=200)

    model_config = ConfigDict(from_attributes=True)


class ProductResponse(BaseModel):
    """Schema for product API response."""

    id: int
    name: str
    model: str
    serial_number: str
    description: Optional[str]
    price: float
    stock: int
    category_id: int
    category: str  # Category name for backward compatibility
    image: Optional[str]
    rating: Optional[float]
    warranty_status: Optional[str]
    distributor: Optional[str]
    discount_active: bool = False
    discount_rate: float = 0.0
    final_price: float

    model_config = ConfigDict(from_attributes=True)


class ProductUpdate(BaseModel):
    """Schema for updating a product. All fields are optional."""

    name: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    category_id: Optional[int] = None  # Use category_id for updates
    image: Optional[str] = None
    rating: Optional[float] = None
    warranty_status: Optional[str] = None
    distributor: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)



class ProductDiscountRequest(BaseModel):
    """Request payload for applying a percentage discount to products."""
    product_ids: List[int]
    discount_rate: float  # percent, e.g., 20 for 20%

    @field_validator("product_ids")
    @classmethod
    def validate_ids(cls, v):
        if not v:
            raise ValueError("product_ids cannot be empty")
        return v

    @field_validator("discount_rate")
    @classmethod
    def validate_rate(cls, v):
        if v <= 0 or v > 100:
            raise ValueError("discount_rate must be between 0 and 100")
        return v


class ProductDiscountClearRequest(BaseModel):
    product_ids: List[int]

    @field_validator("product_ids")
    @classmethod
    def validate_ids(cls, v):
        if not v:
            raise ValueError("product_ids cannot be empty")
        return v