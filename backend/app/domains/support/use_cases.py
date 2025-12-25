import uuid
from typing import List, Optional, Tuple
from datetime import datetime

from sqlalchemy.orm import Session

from app.core.logging import logger
from app.domains.order.repository import OrderRepository
from app.domains.support.entity import (
    ConversationStatus,
    SenderRole,
    SupportAttachment,
    SupportConversation,
    SupportCustomerContextSnapshot,
    SupportMessage,
)
from app.domains.support.repository import SupportRepository


def _build_context_snapshot(db: Session, customer_id: Optional[str], cart_items: list | None, wish_list_items: list | None) -> dict:
    orders_summary: List[dict] = []
    if customer_id:
        order_repo = OrderRepository(db)
        orders = order_repo.get_all(customer_id)
        orders_summary = [
            {
                "id": order.id,
                "status": getattr(order.status, "value", order.status),
                "total_amount": order.total_amount,
                "tax_amount": order.tax_amount,
                "shipping_amount": order.shipping_amount,
                "created_at": order.created_at.isoformat() if order.created_at else None,
                "delivery_address": order.delivery_address,
                "delivered_at": order.delivered_at.isoformat() if order.delivered_at else None,
                "items": [
                    {
                        "product_name": item.product_name,
                        "product_price": item.product_price,
                        "quantity": item.quantity,
                        "subtotal": item.subtotal,
                    }
                    for item in order.items
                ],
            }
            for order in orders
        ]

    return {
        "cart_items": cart_items or [],
        "orders_summary": orders_summary,
        "wish_list_items": wish_list_items or [],
    }


def start_conversation(
    db: Session,
    *,
    customer_id: Optional[str],
    guest_name: Optional[str],
    guest_email: Optional[str],
    initial_message: Optional[str],
    cart_items: list | None,
    wish_list_items: list | None,
) -> Tuple[SupportConversation, Optional[str]]:
    """
    Create a new conversation. Returns conversation and optional guest token.
    """
    from app.infrastructure.database.sqlite.models.user import UserModel

    repo = SupportRepository(db)
    token: Optional[str] = None

    # For authenticated users, fetch their name and email from the database
    if customer_id:
        user = db.query(UserModel).filter(UserModel.id == customer_id).first()
        if user:
            guest_name = f"{user.first_name} {user.last_name}"
            guest_email = user.email
    else:
        token = str(uuid.uuid4())

    cart_payload = [
        item.model_dump() if hasattr(item, "model_dump") else item
        for item in (cart_items or [])
    ]
    wish_payload = [
        item.model_dump() if hasattr(item, "model_dump") else item
        for item in (wish_list_items or [])
    ]

    context_snapshot = _build_context_snapshot(db, customer_id, cart_payload, wish_payload)
    conversation = repo.create_conversation(
        customer_id=customer_id,
        guest_name=guest_name,
        guest_email=guest_email,
        context_snapshot=context_snapshot,
        initial_message=initial_message,
        initial_sender_role=SenderRole.CUSTOMER,
        conversation_token=token,
    )
    return conversation, token


def get_conversation(db: Session, conversation_id: str) -> Optional[SupportConversation]:
    repo = SupportRepository(db)
    return repo.get_conversation(conversation_id)


def list_queue(db: Session, limit: int = 50) -> List[SupportConversation]:
    repo = SupportRepository(db)
    return repo.list_queue(limit=limit)


def claim_conversation(db: Session, conversation_id: str, agent_id: str) -> Optional[SupportConversation]:
    repo = SupportRepository(db)
    claimed = repo.claim_conversation(conversation_id, agent_id)
    if not claimed:
        logger.warning(f"Conversation {conversation_id} already claimed or missing")
    return claimed


def close_conversation(db: Session, conversation_id: str, resolution_notes: Optional[str]) -> Optional[SupportConversation]:
    repo = SupportRepository(db)
    return repo.close_conversation(conversation_id, resolution_notes)


def add_message(
    db: Session,
    *,
    conversation_id: str,
    sender_role: SenderRole,
    sender_id: Optional[str],
    body: Optional[str],
    attachment_id: Optional[str] = None,
) -> Optional[SupportMessage]:
    repo = SupportRepository(db)
    return repo.add_message(
        conversation_id=conversation_id,
        sender_role=sender_role,
        sender_id=sender_id,
        body=body,
        attachment_id=attachment_id,
    )


def add_attachment(
    db: Session,
    *,
    conversation_id: str,
    filename: str,
    mime_type: str,
    size_bytes: int,
    storage_path: str,
    checksum: Optional[str],
) -> SupportAttachment:
    repo = SupportRepository(db)
    return repo.save_attachment(
        conversation_id=conversation_id,
        filename=filename,
        mime_type=mime_type,
        size_bytes=size_bytes,
        storage_path=storage_path,
        checksum=checksum,
    )


def get_attachment(db: Session, attachment_id: str) -> Optional[SupportAttachment]:
    """Get an attachment by ID."""
    repo = SupportRepository(db)
    return repo.get_attachment(attachment_id)


def recent_messages(db: Session, conversation_id: str, limit: int = 50) -> List[SupportMessage]:
    repo = SupportRepository(db)
    return repo.get_recent_messages(conversation_id, limit=limit)
