from typing import List, Optional
from sqlalchemy.orm import Session
from app.domains.order.repository import OrderRepository
from app.domains.order.entity import Order, OrderItem, OrderStatus
from app.domains.catalog.repository import ProductRepository
from app.domains.notifications.notifier import WishlistNotifier
from app.domains.wishlist.repository import WishlistRepository


def _notify_if_restocked(
    wishlist_repo: Optional[WishlistRepository],
    notifier: Optional[WishlistNotifier],
    previous_product,
    updated_product,
):
    """
    Send back-in-stock notification when stock crosses from 0 to >0.
    """
    if not wishlist_repo or not notifier:
        return
    if previous_product.stock != 0 or updated_product.stock <= 0:
        return

    user_ids = wishlist_repo.get_user_ids_by_product(int(updated_product.id))
    if not user_ids:
        return

    notifier.send_stock_email(
        user_ids,
        {
            "id": updated_product.id,
            "name": updated_product.name,
            "price": updated_product.price,
            "final_price": updated_product.final_price or updated_product.price,
            "stock": updated_product.stock,
            "image": getattr(updated_product, "image", None),
        },
    )


def _notify_if_stock_depleted(
    wishlist_repo: Optional[WishlistRepository],
    notifier: Optional[WishlistNotifier],
    previous_product,
    updated_product,
):
    """
    Send out-of-stock notification when stock crosses from >0 to 0.
    """
    if not wishlist_repo or not notifier:
        return
    if previous_product.stock <= 0 or updated_product.stock != 0:
        return

    user_ids = wishlist_repo.get_user_ids_by_product(int(updated_product.id))
    if not user_ids:
        return

    notifier.send_out_of_stock_email(
        user_ids,
        {
            "id": updated_product.id,
            "name": updated_product.name,
            "price": updated_product.price,
            "final_price": updated_product.final_price or updated_product.price,
            "stock": updated_product.stock,
            "image": getattr(updated_product, "image", None),
        },
    )


def _process_payment_refund(order: Order, amount: float) -> bool:
    """
    Simulated refund processing (no external payment gateway in this project).
    Always returns True.
    """
    return True


def create_order(
    db: Session,
    customer_id: str,
    delivery_address: str,
    items: List[dict],
    tax_rate: float = 0.08,
    shipping_threshold: float = 100.0,
    shipping_cost: float = 10.0,
    wishlist_repo: Optional[WishlistRepository] = None,
    notifier: Optional[WishlistNotifier] = None,
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
        # Lock the product row to prevent race conditions during stock check
        product = product_repo.get_by_id(item_data["product_id"], lock_for_update=True)
        if not product:
            return None  # Product not found

        if product.stock < item_data["quantity"]:
            return None  # Insufficient stock

        # Use purchase-time effective price (discounted if applicable)
        effective_price = getattr(product, "final_price", None) or product.price
        item_subtotal = effective_price * item_data["quantity"]
        subtotal += item_subtotal

        order_items.append(
            OrderItem(
                id=None,
                order_id=None,
                product_id=product.id,
                product_name=product.name,
                product_price=effective_price,
                quantity=item_data["quantity"],
                subtotal=item_subtotal,
            )
        )

        # Decrease stock
        updated_product = product_repo.update(product.id, {"stock": product.stock - item_data["quantity"]})
        if updated_product:
            _notify_if_stock_depleted(wishlist_repo, notifier, product, updated_product)

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


def cancel_order(
    db: Session,
    order_id: int,
    wishlist_repo: Optional[WishlistRepository] = None,
    notifier: Optional[WishlistNotifier] = None,
) -> Optional[Order]:
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
                updated = product_repo.update(item.product_id, {"stock": product.stock + item.quantity})
                if updated:
                    _notify_if_restocked(wishlist_repo, notifier, product, updated)

    return order


def request_refund(db: Session, order_id: int, reason: Optional[str] = None, items: Optional[List[dict]] = None) -> Optional[Order]:
    """
    Request a refund for a delivered order (within 30 days).

    Args:
        db: Database session
        order_id: ID of the order to refund
        reason: Optional reason for the refund request
        items: Optional list of specific items/quantities to refund

    Returns:
        Updated Order entity if successful, None otherwise
    """
    repository = OrderRepository(db)
    return repository.request_refund(order_id, reason, items)


def approve_refund(
    db: Session,
    order_id: int,
    refund_amount: Optional[float] = None,
    wishlist_repo: Optional[WishlistRepository] = None,
    notifier: Optional[WishlistNotifier] = None,
) -> Optional[Order]:
    """
    Approve a refund request.

    Args:
        db: Database session
        order_id: ID of the order to approve refund for
        refund_amount: Optional override for refund amount (defaults to calculated)

    Returns:
        Updated Order entity if successful, None otherwise
    """
    repository = OrderRepository(db)
    order = repository.get_by_id(order_id)

    if not order:
        return None

    # Determine which items were requested for refund; default to full order
    refund_items = order.refund_items or [{"product_id": item.product_id, "quantity": item.quantity} for item in order.items]

    # Calculate refund amount (purchase-time prices, respect discounts at purchase time)
    if refund_amount is None:
        price_map = {item.product_id: item.product_price for item in order.items}
        refund_amount = 0.0
        for payload in refund_items:
            pid = payload.get("product_id")
            qty = payload.get("quantity", 0)
            if pid is None or qty <= 0:
                return None
            unit_price = price_map.get(pid)
            if unit_price is None:
                return None
            refund_amount += unit_price * qty

    approved_order = repository.approve_refund(order_id, refund_amount, refund_items)

    if approved_order:
        # Simulated payment refund (no external gateway)
        _process_payment_refund(
            approved_order, approved_order.refund_amount or refund_amount or 0.0
        )

        # Add products back to stock
        product_repo = ProductRepository(db)
        # Use requested quantities if present for restocking
        restock_quantities = {
            item["product_id"]: item["quantity"] for item in (approved_order.refund_items or refund_items or [])
        }
        for item in approved_order.items:
            requested_qty = restock_quantities.get(item.product_id, item.quantity)
            if requested_qty <= 0:
                continue
            product = product_repo.get_by_id(item.product_id)
            if product:
                updated = product_repo.update(item.product_id, {"stock": product.stock + requested_qty})
                if updated:
                    _notify_if_restocked(wishlist_repo, notifier, product, updated)

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
