from typing import Optional
from pydantic import BaseModel, ConfigDict


class ProductResponse(BaseModel):
    """Schema for product API response."""

    id: int
    name: str
    model: str
    serial_number: str
    description: Optional[str]
    price: float
    stock: int
    category: str
    image: Optional[str]
    rating: Optional[float]
    warranty_status: Optional[str]
    distributor: Optional[str]

    model_config = ConfigDict(from_attributes=True)


class ProductUpdate(BaseModel):
    """Schema for updating a product. All fields are optional."""

    name: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    category: Optional[str] = None
    image: Optional[str] = None
    rating: Optional[float] = None
    warranty_status: Optional[str] = None
    distributor: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)