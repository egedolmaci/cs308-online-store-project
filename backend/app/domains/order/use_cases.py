from typing import List, Optional
from sqlalchemy.orm import Session
from app.domains.order.repository import OrderRepository
from app.domains.order.entity import Order, OrderItem, OrderStatus
from app.domains.catalog.repository import ProductRepository


def create_order(
    db: Session,
    customer_id: str,
    delivery_address: str,
    items: List[dict],
    tax_rate: float = 0.08,
    shipping_threshold: float = 100.0,
    shipping_cost: float = 10.0,
) -> Optional[Order]:
    """
    Create a new order.

    Args:
        db: Database session
        customer_id: ID of the customer placing the order
        delivery_address: Delivery address for the order
        items: List of items with product_id and quantity
        tax_rate: Tax rate (default 8%)
        shipping_threshold: Free shipping threshold (default $100)
        shipping_cost: Shipping cost if under threshold (default $10)

    Returns:
        Created Order entity or None if validation fails
    """
    product_repo = ProductRepository(db)
    order_repo = OrderRepository(db)

    # Validate products and calculate totals
    order_items = []
    subtotal = 0.0

    for item_data in items:
        product = product_repo.get_by_id(item_data["product_id"])
        if not product:
            return None  # Product not found

        if product.stock < item_data["quantity"]:
            return None  # Insufficient stock

        item_subtotal = product.price * item_data["quantity"]
        subtotal += item_subtotal

        order_items.append(
            OrderItem(
                id=None,
                order_id=None,
                product_id=product.id,
                product_name=product.name,
                product_price=product.price,
                quantity=item_data["quantity"],
                subtotal=item_subtotal,
            )
        )

        # Decrease stock
        product_repo.update(product.id, {"stock": product.stock - item_data["quantity"]})

    # Calculate tax and shipping
    tax_amount = subtotal * tax_rate
    shipping_amount = 0.0 if subtotal >= shipping_threshold else shipping_cost
    total_amount = subtotal + tax_amount + shipping_amount

    # Create order
    order = Order(
        id=None,
        customer_id=customer_id,
        status=OrderStatus.PROCESSING,
        total_amount=total_amount,
        tax_amount=tax_amount,
        shipping_amount=shipping_amount,
        delivery_address=delivery_address,
        created_at=None,
        updated_at=None,
        items=order_items,
    )

    return order_repo.create(order)


def get_all_orders(db: Session, customer_id: Optional[str] = None) -> List[Order]:
    """
    Retrieve all orders, optionally filtered by customer.

    Args:
        db: Database session
        customer_id: Optional customer ID to filter by

    Returns:
        List of Order entities
    """
    repository = OrderRepository(db)
    return repository.get_all(customer_id)


def get_order_by_id(db: Session, order_id: int) -> Optional[Order]:
    """
    Retrieve a single order by ID.

    Args:
        db: Database session
        order_id: ID of the order to retrieve

    Returns:
        Order entity if found, None otherwise
    """
    repository = OrderRepository(db)
    return repository.get_by_id(order_id)


def update_order_status(db: Session, order_id: int, status: OrderStatus) -> Optional[Order]:
    """
    Update order status.

    Args:
        db: Database session
        order_id: ID of the order to update
        status: New status

    Returns:
        Updated Order entity if found, None otherwise
    """
    repository = OrderRepository(db)
    return repository.update_status(order_id, status)


def cancel_order(db: Session, order_id: int) -> Optional[Order]:
    """
    Cancel an order (only if in processing status).

    Args:
        db: Database session
        order_id: ID of the order to cancel

    Returns:
        Updated Order entity if successful, None otherwise
    """
    repository = OrderRepository(db)
    order = repository.cancel_order(order_id)

    if order:
        # Restore stock for cancelled order
        product_repo = ProductRepository(db)
        for item in order.items:
            product = product_repo.get_by_id(item.product_id)
            if product:
                product_repo.update(item.product_id, {"stock": product.stock + item.quantity})

    return order


def request_refund(db: Session, order_id: int) -> Optional[Order]:
    """
    Request a refund for a delivered order (within 30 days).

    Args:
        db: Database session
        order_id: ID of the order to refund

    Returns:
        Updated Order entity if successful, None otherwise
    """
    repository = OrderRepository(db)
    return repository.request_refund(order_id)


def approve_refund(db: Session, order_id: int) -> Optional[Order]:
    """
    Approve a refund request.

    Args:
        db: Database session
        order_id: ID of the order to approve refund for

    Returns:
        Updated Order entity if successful, None otherwise
    """
    repository = OrderRepository(db)
    order = repository.get_by_id(order_id)

    if not order:
        return None

    # Calculate refund amount (the original purchase price with discount if applicable)
    refund_amount = order.total_amount

    approved_order = repository.approve_refund(order_id, refund_amount)

    if approved_order:
        # Add products back to stock
        product_repo = ProductRepository(db)
        for item in approved_order.items:
            product = product_repo.get_by_id(item.product_id)
            if product:
                product_repo.update(item.product_id, {"stock": product.stock + item.quantity})

    return approved_order


def reject_refund(db: Session, order_id: int) -> Optional[Order]:
    """
    Reject a refund request.

    Args:
        db: Database session
        order_id: ID of the order to reject refund for

    Returns:
        Updated Order entity if successful, None otherwise
    """
    repository = OrderRepository(db)
    return repository.reject_refund(order_id)


def delete_order(db: Session, order_id: int) -> bool:
    """
    Delete an order by ID.

    Args:
        db: Database session
        order_id: ID of the order to delete

    Returns:
        True if order was deleted, False if not found
    """
    repository = OrderRepository(db)
    return repository.delete(order_id)