from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.infrastructure.database.sqlite.session import Base
from app.domains.order.entity import OrderStatus


class OrderModel(Base):
    """SQLAlchemy model for orders."""

    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(String(36), nullable=False, index=True)  # UUID string
    status = Column(SQLEnum(OrderStatus), nullable=False, default=OrderStatus.PROCESSING)
    total_amount = Column(Float, nullable=False)
    tax_amount = Column(Float, nullable=False)
    shipping_amount = Column(Float, nullable=False)
    delivery_address = Column(String(500), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    delivered_at = Column(DateTime(timezone=True), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    refund_requested_at = Column(DateTime(timezone=True), nullable=True)
    refunded_at = Column(DateTime(timezone=True), nullable=True)
    refund_amount = Column(Float, nullable=True)
    refund_reason = Column(String(500), nullable=True)  # Reason for refund request

    # Relationship to order items
    items = relationship("OrderItemModel", back_populates="order", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Order(id={self.id}, customer_id={self.customer_id}, status={self.status}, total={self.total_amount})>"


class OrderItemModel(Base):
    """SQLAlchemy model for order items."""

    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(Integer, nullable=False, index=True)
    product_name = Column(String(200), nullable=False)
    product_price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    subtotal = Column(Float, nullable=False)

    # Relationship to order
    order = relationship("OrderModel", back_populates="items")

    def __repr__(self):
        return f"<OrderItem(id={self.id}, order_id={self.order_id}, product_id={self.product_id}, quantity={self.quantity})>"