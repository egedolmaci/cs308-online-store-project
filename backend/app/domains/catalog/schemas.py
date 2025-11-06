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