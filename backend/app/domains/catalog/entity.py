from dataclasses import dataclass
from typing import Optional


@dataclass
class Product:
    """Product entity representing a catalog item."""

    id: Optional[int]
    name: str
    model: str
    serial_number: str
    description: Optional[str]
    price: float
    stock: int
    category_id: int
    category: str  # Category name (denormalized for API responses)
    image: Optional[str]
    rating: Optional[float]
    warranty_status: Optional[str]
    distributor: Optional[str]
    discount_rate: float = 0.0
    discount_active: bool = False
    final_price: Optional[float] = None 