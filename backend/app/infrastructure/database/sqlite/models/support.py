from datetime import datetime
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.infrastructure.database.sqlite.session import Base


class SupportConversationModel(Base):
    __tablename__ = "support_conversations"

    id = Column(String(36), primary_key=True, index=True)
    status = Column(String(20), nullable=False, index=True, default="open")
    customer_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    conversation_token = Column(String(255), unique=True, nullable=True)
    assigned_agent_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    guest_name = Column(String(100), nullable=True)
    guest_email = Column(String(255), nullable=True)
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    closed_at = Column(DateTime, nullable=True)
    last_message_at = Column(DateTime, default=datetime.utcnow, index=True)

    messages = relationship(
        "SupportMessageModel",
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="SupportMessageModel.created_at",
    )
    attachments = relationship(
        "SupportAttachmentModel",
        back_populates="conversation",
        cascade="all, delete-orphan",
    )
    context_snapshot = relationship(
        "SupportContextSnapshotModel",
        back_populates="conversation",
        cascade="all, delete-orphan",
        uselist=False,
    )


class SupportMessageModel(Base):
    __tablename__ = "support_messages"

    id = Column(String(36), primary_key=True, index=True)
    conversation_id = Column(String(36), ForeignKey("support_conversations.id"), index=True, nullable=False)
    sender_role = Column(String(20), nullable=False)
    sender_id = Column(String(36), nullable=True, index=True)
    body = Column(Text, nullable=True)
    attachment_id = Column(String(36), ForeignKey("support_attachments.id"), nullable=True)
    status = Column(String(20), nullable=False, default="delivered")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    conversation = relationship("SupportConversationModel", back_populates="messages")
    attachment = relationship("SupportAttachmentModel", back_populates="message", uselist=False)


class SupportAttachmentModel(Base):
    __tablename__ = "support_attachments"
    __table_args__ = (
        UniqueConstraint("id", "conversation_id", name="uq_support_attachment_conversation"),
    )

    id = Column(String(36), primary_key=True, index=True)
    conversation_id = Column(String(36), ForeignKey("support_conversations.id"), index=True, nullable=False)
    filename = Column(String(255), nullable=False)
    mime_type = Column(String(100), nullable=False)
    size_bytes = Column(Integer, nullable=False)
    storage_path = Column(String(500), nullable=False)
    checksum = Column(String(128), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("SupportConversationModel", back_populates="attachments")
    message = relationship("SupportMessageModel", back_populates="attachment", uselist=False)


class SupportContextSnapshotModel(Base):
    __tablename__ = "support_context_snapshots"

    conversation_id = Column(String(36), ForeignKey("support_conversations.id"), primary_key=True)
    cart_items = Column(JSON, nullable=True)
    orders_summary = Column(JSON, nullable=True)
    wish_list_items = Column(JSON, nullable=True)
    captured_at = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("SupportConversationModel", back_populates="context_snapshot")
