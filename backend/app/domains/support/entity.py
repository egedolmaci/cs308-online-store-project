from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import List, Optional


class ConversationStatus(str, Enum):
    OPEN = "open"
    ASSIGNED = "assigned"
    TRANSFERRED = "transferred"
    CLOSED = "closed"


class MessageStatus(str, Enum):
    DELIVERED = "delivered"
    READ = "read"


class SenderRole(str, Enum):
    CUSTOMER = "customer"
    AGENT = "agent"
    SYSTEM = "system"


@dataclass
class SupportAttachment:
    id: str
    conversation_id: str
    filename: str
    mime_type: str
    size_bytes: int
    storage_path: str
    checksum: Optional[str]
    created_at: datetime


@dataclass
class SupportMessage:
    id: str
    conversation_id: str
    sender_role: SenderRole
    sender_id: Optional[str]
    body: Optional[str]
    attachment: Optional[SupportAttachment]
    status: MessageStatus
    created_at: datetime


@dataclass
class SupportCustomerContextSnapshot:
    conversation_id: str
    cart_items: list
    orders_summary: list
    wish_list_items: list
    captured_at: datetime


@dataclass
class SupportConversation:
    id: str
    status: ConversationStatus
    customer_id: Optional[str]
    conversation_token: Optional[str]
    assigned_agent_id: Optional[str]
    guest_name: Optional[str]
    guest_email: Optional[str]
    resolution_notes: Optional[str]
    last_message_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    closed_at: Optional[datetime]
    messages: List[SupportMessage] = field(default_factory=list)
    attachments: List[SupportAttachment] = field(default_factory=list)
    context_snapshot: Optional[SupportCustomerContextSnapshot] = None
