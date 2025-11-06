from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from app.domains.order.entity import OrderStatus


class OrderItemCreate(BaseModel):
    """Schema for creating an order item."""

    product_id: int
    quantity: int = Field(gt=0, description="Quantity must be greater than 0")


class OrderItemResponse(BaseModel):
    """Schema for order item response."""

    id: int
    order_id: int
    product_id: int
    product_name: str
    product_price: float
    quantity: int
    subtotal: float

    model_config = ConfigDict(from_attributes=True)


class OrderCreate(BaseModel):
    """Schema for creating an order."""

    delivery_address: str
    items: List[OrderItemCreate] = Field(min_length=1, description="Order must have at least one item")


class OrderResponse(BaseModel):
    """Schema for order response."""

    id: int
    customer_id: str  # UUID from identity system
    status: OrderStatus
    total_amount: float
    tax_amount: float
    shipping_amount: float
    delivery_address: str
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse]

    delivered_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    refund_requested_at: Optional[datetime] = None
    refunded_at: Optional[datetime] = None
    refund_amount: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)


class OrderStatusUpdate(BaseModel):
    """Schema for updating order status."""

    status: OrderStatus


class OrderRefundRequest(BaseModel):
    """Schema for requesting a refund."""

    reason: Optional[str] = None


class OrderRefundApproval(BaseModel):
    """Schema for approving/rejecting a refund."""

    approved: bool
    refund_amount: Optional[float] = None
    notes: Optional[str] = None
