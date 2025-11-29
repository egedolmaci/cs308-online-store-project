from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.domains.support.entity import ConversationStatus, MessageStatus, SenderRole


class SupportCartItem(BaseModel):
    product_id: str | int
    name: str
    price: float
    quantity: int
    total_price: Optional[float] = None
    image: Optional[str] = None
    model: Optional[str] = None
    category: Optional[str] = None


class SupportWishItem(BaseModel):
    product_id: str | int
    name: str
    price: float
    image: Optional[str] = None


class SupportConversationCreate(BaseModel):
    guest_name: Optional[str] = Field(None, description="Display name for guest users")
    guest_email: Optional[str] = Field(None, description="Email for follow-up if guest")
    initial_message: Optional[str] = Field(None, description="First message from customer")
    cart_items: Optional[List[SupportCartItem]] = None
    wish_list_items: Optional[List[SupportWishItem]] = None


class SupportAttachmentResponse(BaseModel):
    id: str
    filename: str
    mime_type: str
    size_bytes: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SupportMessageResponse(BaseModel):
    id: str
    conversation_id: str
    sender_role: SenderRole
    sender_id: Optional[str] = None
    body: Optional[str] = None
    status: MessageStatus
    created_at: datetime
    attachment: Optional[SupportAttachmentResponse] = None

    model_config = ConfigDict(from_attributes=True)


class SupportContextSnapshotResponse(BaseModel):
    cart_items: list
    orders_summary: list
    wish_list_items: list
    captured_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SupportConversationResponse(BaseModel):
    id: str
    status: ConversationStatus
    customer_id: Optional[str] = None
    conversation_token: Optional[str] = None
    assigned_agent_id: Optional[str] = None
    guest_name: Optional[str] = None
    guest_email: Optional[str] = None
    last_message_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    closed_at: Optional[datetime] = None
    resolution_notes: Optional[str] = None
    context_snapshot: Optional[SupportContextSnapshotResponse] = None
    messages: List[SupportMessageResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class SupportConversationSummary(BaseModel):
    id: str
    status: ConversationStatus
    customer_id: Optional[str] = None
    assigned_agent_id: Optional[str] = None
    guest_name: Optional[str] = None
    guest_email: Optional[str] = None
    last_message_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SupportQueueResponse(BaseModel):
    conversations: List[SupportConversationSummary]


class SupportCloseRequest(BaseModel):
    resolution_notes: Optional[str] = None
