from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator
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

    delivery_address: str = Field(min_length=1, max_length=500, description="Delivery address is required")
    items: List[OrderItemCreate] = Field(min_length=1, description="Order must have at least one item")

    @field_validator('delivery_address')
    @classmethod
    def validate_address(cls, v: str) -> str:
        """Validate that address is not empty or whitespace only."""
        if not v or not v.strip():
            raise ValueError('Delivery address cannot be empty')
        return v.strip()


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
    refund_reason: Optional[str] = None
    refund_items: Optional[List[dict]] = None
    customer_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class OrderStatusUpdate(BaseModel):
    """Schema for updating order status."""

    status: OrderStatus


class OrderRefundRequest(BaseModel):
    """Schema for requesting a refund."""

    class RefundItem(BaseModel):
        product_id: int
        quantity: int = Field(gt=0, description="Quantity to refund must be greater than 0")

    reason: Optional[str] = None
    items: Optional[List[RefundItem]] = Field(
        default=None,
        description="List of items (product_id, quantity) to refund. If omitted, full order is requested.",
    )

    @field_validator("items")
    @classmethod
    def validate_items(cls, v):
        if v is not None and len(v) == 0:
            raise ValueError("Refund items list cannot be empty")
        return v


class OrderRefundApproval(BaseModel):
    """Schema for approving/rejecting a refund."""

    approved: bool
    refund_amount: Optional[float] = None
    notes: Optional[str] = None

    @field_validator("refund_amount")
    @classmethod
    def validate_refund_amount(cls, v, info):
        approved = getattr(info, "data", {}).get("approved")
        if approved and v is not None and v <= 0:
            raise ValueError("Refund amount must be positive when approving a refund")
        return v
