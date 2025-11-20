from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session

from app.infrastructure.database.sqlite.session import get_db
from app.domains.order.schemas import (
    OrderCreate,
    OrderResponse,
    OrderStatusUpdate,
    OrderRefundRequest,
    OrderRefundApproval,
)
from app.domains.order import use_cases
from app.api.endpoints.auth import get_current_user, require_roles
from app.domains.identity.repository import User
from app.infrastructure.notifications.invoice_email import send_order_invoice_email

router = APIRouter(prefix="/api/v1/orders", tags=["orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_data: OrderCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("customer")),
):
    """
    Create a new order (customers only, must be authenticated).

    Args:
        order_data: Order creation data (delivery_address and items)
        current_user: Authenticated user from JWT token

    Returns:
        Created order details

    Raises:
        HTTPException: 400 if validation fails (product not found, insufficient stock, etc.)
        HTTPException: 401 if not authenticated
        HTTPException: 403 if not a customer
    """
    # Convert items to dict format for use_cases
    items = [{"product_id": item.product_id, "quantity": item.quantity} for item in order_data.items]

    order = use_cases.create_order(
        db=db,
        customer_id=current_user.id,  # Use UUID directly
        delivery_address=order_data.delivery_address,
        items=items,
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create order. Check product availability and stock.",
        )
    
    customer_name = f"{current_user.first_name} {current_user.last_name}".strip()
    background_tasks.add_task(send_order_invoice_email, order, current_user.email, customer_name)

    return order


@router.get("/all", response_model=List[OrderResponse])
def get_all_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("product_manager", "sales_manager")),
):
    """
    Retrieve all orders from all customers (managers only).

    Returns:
        List of all orders in the system

    Raises:
        HTTPException: 401 if not authenticated
        HTTPException: 403 if not a product manager or sales manager
    """
    orders = use_cases.get_all_orders(db, customer_id=None)
    return orders


@router.get("", response_model=List[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("customer")),
):
    """
    Retrieve orders for the current customer (customers only).

    Returns:
        List of orders belonging to the authenticated customer

    Raises:
        HTTPException: 401 if not authenticated
        HTTPException: 403 if not a customer
    """
    orders = use_cases.get_all_orders(db, customer_id=current_user.id)
    return orders


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    user_with_role=Depends(get_current_user),
):
    """
    Retrieve a single order by ID (authenticated users only).
    - Customers can only see their own orders
    - Managers can see any order

    Args:
        order_id: The ID of the order to retrieve

    Returns:
        Order details

    Raises:
        HTTPException: 403 if customer tries to access another's order
        HTTPException: 404 if order not found
    """
    current_user, role = user_with_role

    order = use_cases.get_order_by_id(db, order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Order with id {order_id} not found"
        )

    # Customers can only view their own orders
    if role == "customer" and order.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You can only view your own orders"
        )

    return order


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("product_manager")),
):
    """
    Update order status (product managers only - handles delivery).

    Args:
        order_id: The ID of the order to update
        status_update: New status

    Returns:
        Updated order details

    Raises:
        HTTPException: 401 if not authenticated
        HTTPException: 403 if not a product manager
        HTTPException: 404 if order not found
    """
    order = use_cases.update_order_status(db, order_id, status_update.status)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Order with id {order_id} not found"
        )
    return order


@router.post("/{order_id}/cancel", response_model=OrderResponse)
def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("customer")),
):
    """
    Cancel an order (customers only, only if in processing status).

    Args:
        order_id: The ID of the order to cancel

    Returns:
        Updated order details

    Raises:
        HTTPException: 400 if order cannot be cancelled
        HTTPException: 403 if not customer or not order owner
        HTTPException: 404 if order not found
    """
    # Check ownership
    order_check = use_cases.get_order_by_id(db, order_id)
    if not order_check:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Order {order_id} not found")

    if order_check.customer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your order")

    order = use_cases.cancel_order(db, order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must be in 'processing' status to cancel",
        )
    return order


@router.post("/{order_id}/refund/request", response_model=OrderResponse)
def request_refund(
    order_id: int,
    refund_data: OrderRefundRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("customer")),
):
    """
    Request a refund for a delivered order (customers only, within 30 days).

    Args:
        order_id: The ID of the order to request refund for
        refund_data: Refund request data (optional reason)

    Returns:
        Updated order details

    Raises:
        HTTPException: 400 if order cannot be refunded
        HTTPException: 403 if not customer or not order owner
        HTTPException: 404 if order not found
    """
    # Check ownership
    order_check = use_cases.get_order_by_id(db, order_id)
    if not order_check:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Order {order_id} not found")

    if order_check.customer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your order")

    order = use_cases.request_refund(db, order_id, refund_data.reason)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must be delivered and within 30 days to request refund",
        )
    return order


@router.post("/{order_id}/refund/approve", response_model=OrderResponse)
def approve_refund(order_id: int, approval_data: OrderRefundApproval, db: Session = Depends(get_db)):
    """
    Approve or reject a refund request (for sales managers).

    Args:
        order_id: The ID of the order to approve/reject refund for
        approval_data: Approval decision and details

    Returns:
        Updated order details

    Raises:
        HTTPException: 400 if order refund cannot be processed
        HTTPException: 404 if order not found
    """
    if approval_data.approved:
        order = use_cases.approve_refund(db, order_id)
        if not order:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Order with id {order_id} refund cannot be approved. "
                "It must be in 'refund_requested' status.",
            )
    else:
        order = use_cases.reject_refund(db, order_id)
        if not order:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Order with id {order_id} refund cannot be rejected. "
                "It must be in 'refund_requested' status.",
            )
    return order


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    """
    Delete an order by ID.

    Args:
        order_id: The ID of the order to delete

    Raises:
        HTTPException: 404 if order not found
    """
    deleted = use_cases.delete_order(db, order_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Order with id {order_id} not found"
        )
    return None