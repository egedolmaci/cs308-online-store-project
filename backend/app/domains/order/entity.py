from dataclasses import dataclass
from typing import Optional, List
from datetime import datetime
from enum import Enum


class OrderStatus(str, Enum):
    """Order status enumeration."""
    PROCESSING = "processing"
    IN_TRANSIT = "in-transit"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUND_REQUESTED = "refund_requested"
    REFUNDED = "refunded"


@dataclass
class OrderItem:
    """Order item entity representing a product in an order."""

    id: Optional[int]
    order_id: Optional[int]
    product_id: int
    product_name: str
    product_price: float
    quantity: int
    subtotal: float


@dataclass
class Order:
    """Order entity representing a customer order."""

    id: Optional[int]
    customer_id: str  # UUID from identity system
    status: OrderStatus
    total_amount: float
    tax_amount: float
    shipping_amount: float
    delivery_address: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    items: List[OrderItem]

    # Additional fields for tracking
    delivered_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    refund_requested_at: Optional[datetime] = None
    refunded_at: Optional[datetime] = None
    refund_amount: Optional[float] = None