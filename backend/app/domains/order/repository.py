from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.infrastructure.database.sqlite.models.order import OrderModel, OrderItemModel
from app.domains.order.entity import Order, OrderItem, OrderStatus


class OrderRepository:
    """Repository for order data access operations."""

    def __init__(self, db: Session):
        self.db = db

    def create(self, order: Order) -> Order:
        """Create a new order with items."""
        # Create order model
        order_model = OrderModel(
            customer_id=order.customer_id,
            status=order.status,
            total_amount=order.total_amount,
            tax_amount=order.tax_amount,
            shipping_amount=order.shipping_amount,
            delivery_address=order.delivery_address,
        )

        self.db.add(order_model)
        self.db.flush()  # Flush to get the order ID

        # Create order items
        for item in order.items:
            item_model = OrderItemModel(
                order_id=order_model.id,
                product_id=item.product_id,
                product_name=item.product_name,
                product_price=item.product_price,
                quantity=item.quantity,
                subtotal=item.subtotal,
            )
            self.db.add(item_model)

        self.db.commit()
        self.db.refresh(order_model)
        return self._to_entity(order_model)

    def get_all(self, customer_id: Optional[str] = None) -> List[Order]:
        """Retrieve all orders, optionally filtered by customer."""
        query = self.db.query(OrderModel)
        if customer_id:
            query = query.filter(OrderModel.customer_id == customer_id)
        orders = query.order_by(OrderModel.created_at.desc()).all()
        return [self._to_entity(o) for o in orders]

    def get_by_id(self, order_id: int) -> Optional[Order]:
        """Retrieve a single order by ID."""
        order = self.db.query(OrderModel).filter(OrderModel.id == order_id).first()
        return self._to_entity(order) if order else None

    def update_status(self, order_id: int, status: OrderStatus) -> Optional[Order]:
        """Update order status."""
        order = self.db.query(OrderModel).filter(OrderModel.id == order_id).first()
        if not order:
            return None

        order.status = status

        # Update relevant timestamps based on status
        if status == OrderStatus.DELIVERED:
            order.delivered_at = datetime.utcnow()
        elif status == OrderStatus.CANCELLED:
            order.cancelled_at = datetime.utcnow()
        elif status == OrderStatus.REFUND_REQUESTED:
            order.refund_requested_at = datetime.utcnow()
        elif status == OrderStatus.REFUNDED:
            order.refunded_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(order)
        return self._to_entity(order)

    def cancel_order(self, order_id: int) -> Optional[Order]:
        """Cancel an order (only if in processing status)."""
        order = self.db.query(OrderModel).filter(OrderModel.id == order_id).first()
        if not order:
            return None

        if order.status != OrderStatus.PROCESSING:
            return None

        order.status = OrderStatus.CANCELLED
        order.cancelled_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(order)
        return self._to_entity(order)

    def request_refund(self, order_id: int, reason: Optional[str] = None) -> Optional[Order]:
        """Request a refund for a delivered order."""
        order = self.db.query(OrderModel).filter(OrderModel.id == order_id).first()
        if not order:
            return None

        if order.status != OrderStatus.DELIVERED:
            return None

        # Check if within 30 days
        if order.delivered_at:
            days_since_delivery = (datetime.utcnow() - order.delivered_at).days
            if days_since_delivery > 30:
                return None

        order.status = OrderStatus.REFUND_REQUESTED
        order.refund_requested_at = datetime.utcnow()
        order.refund_reason = reason  # Save the refund reason

        self.db.commit()
        self.db.refresh(order)
        return self._to_entity(order)

    def approve_refund(self, order_id: int, refund_amount: float) -> Optional[Order]:
        """Approve a refund request."""
        order = self.db.query(OrderModel).filter(OrderModel.id == order_id).first()
        if not order:
            return None

        if order.status != OrderStatus.REFUND_REQUESTED:
            return None

        order.status = OrderStatus.REFUNDED
        order.refunded_at = datetime.utcnow()
        order.refund_amount = refund_amount

        self.db.commit()
        self.db.refresh(order)
        return self._to_entity(order)

    def reject_refund(self, order_id: int) -> Optional[Order]:
        """Reject a refund request and revert to delivered status."""
        order = self.db.query(OrderModel).filter(OrderModel.id == order_id).first()
        if not order:
            return None

        if order.status != OrderStatus.REFUND_REQUESTED:
            return None

        order.status = OrderStatus.DELIVERED

        self.db.commit()
        self.db.refresh(order)
        return self._to_entity(order)

    def delete(self, order_id: int) -> bool:
        """Delete an order by ID. Returns True if deleted, False if not found."""
        order = self.db.query(OrderModel).filter(OrderModel.id == order_id).first()
        if order:
            self.db.delete(order)
            self.db.commit()
            return True
        return False

    def _to_entity(self, model: OrderModel) -> Order:
        """Convert SQLAlchemy model to domain entity."""
        items = [
            OrderItem(
                id=item.id,
                order_id=item.order_id,
                product_id=item.product_id,
                product_name=item.product_name,
                product_price=item.product_price,
                quantity=item.quantity,
                subtotal=item.subtotal,
            )
            for item in model.items
        ]

        return Order(
            id=model.id,
            customer_id=model.customer_id,
            status=model.status,
            total_amount=model.total_amount,
            tax_amount=model.tax_amount,
            shipping_amount=model.shipping_amount,
            delivery_address=model.delivery_address,
            created_at=model.created_at,
            updated_at=model.updated_at,
            items=items,
            delivered_at=model.delivered_at,
            cancelled_at=model.cancelled_at,
            refund_requested_at=model.refund_requested_at,
            refunded_at=model.refunded_at,
            refund_amount=model.refund_amount,
            refund_reason=model.refund_reason,
        )