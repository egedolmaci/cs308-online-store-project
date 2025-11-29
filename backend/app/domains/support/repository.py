import uuid
from typing import List, Optional
from datetime import datetime

from sqlalchemy.orm import Session

from app.domains.support.entity import (
    ConversationStatus,
    MessageStatus,
    SenderRole,
    SupportAttachment,
    SupportConversation,
    SupportCustomerContextSnapshot,
    SupportMessage,
)
from app.infrastructure.database.sqlite.models.support import (
    SupportAttachmentModel,
    SupportContextSnapshotModel,
    SupportConversationModel,
    SupportMessageModel,
)


class SupportRepository:
    """Data access for support conversations, messages, and attachments."""

    def __init__(self, db: Session):
        self.db = db

    def _to_attachment(self, model: SupportAttachmentModel) -> SupportAttachment:
        return SupportAttachment(
            id=model.id,
            conversation_id=model.conversation_id,
            filename=model.filename,
            mime_type=model.mime_type,
            size_bytes=model.size_bytes,
            storage_path=model.storage_path,
            checksum=model.checksum,
            created_at=model.created_at,
        )

    def _to_message(self, model: SupportMessageModel) -> SupportMessage:
        attachment = self._to_attachment(model.attachment) if model.attachment else None
        return SupportMessage(
            id=model.id,
            conversation_id=model.conversation_id,
            sender_role=SenderRole(model.sender_role),
            sender_id=model.sender_id,
            body=model.body,
            attachment=attachment,
            status=MessageStatus(model.status),
            created_at=model.created_at,
        )

    def _to_context(self, model: Optional[SupportContextSnapshotModel]) -> Optional[SupportCustomerContextSnapshot]:
        if not model:
            return None
        return SupportCustomerContextSnapshot(
            conversation_id=model.conversation_id,
            cart_items=model.cart_items or [],
            orders_summary=model.orders_summary or [],
            wish_list_items=model.wish_list_items or [],
            captured_at=model.captured_at,
        )

    def _to_conversation(self, model: SupportConversationModel, include_messages: bool = True) -> SupportConversation:
        messages = [self._to_message(m) for m in model.messages] if include_messages else []
        attachments = [self._to_attachment(a) for a in model.attachments] if include_messages else []
        return SupportConversation(
            id=model.id,
            status=ConversationStatus(model.status),
            customer_id=model.customer_id,
            conversation_token=model.conversation_token,
            assigned_agent_id=model.assigned_agent_id,
            guest_name=model.guest_name,
            guest_email=model.guest_email,
            resolution_notes=model.resolution_notes,
            last_message_at=model.last_message_at,
            created_at=model.created_at,
            updated_at=model.updated_at,
            closed_at=model.closed_at,
            messages=messages,
            attachments=attachments,
            context_snapshot=self._to_context(model.context_snapshot),
        )

    def create_conversation(
        self,
        *,
        customer_id: Optional[str],
        guest_name: Optional[str],
        guest_email: Optional[str],
        context_snapshot: Optional[dict],
        initial_message: Optional[str],
        initial_sender_role: SenderRole,
        conversation_token: Optional[str] = None,
    ) -> SupportConversation:
        conversation_id = str(uuid.uuid4())
        model = SupportConversationModel(
            id=conversation_id,
            status=ConversationStatus.OPEN.value,
            customer_id=customer_id,
            conversation_token=conversation_token,
            guest_name=guest_name,
            guest_email=guest_email,
            last_message_at=datetime.utcnow(),
        )

        if context_snapshot:
            model.context_snapshot = SupportContextSnapshotModel(
                conversation_id=conversation_id,
                cart_items=context_snapshot.get("cart_items") or [],
                orders_summary=context_snapshot.get("orders_summary") or [],
                wish_list_items=context_snapshot.get("wish_list_items") or [],
            )

        if initial_message:
            message_model = SupportMessageModel(
                id=str(uuid.uuid4()),
                conversation_id=conversation_id,
                sender_role=initial_sender_role.value,
                sender_id=customer_id,
                body=initial_message,
                status=MessageStatus.DELIVERED.value,
                created_at=datetime.utcnow(),
            )
            model.messages.append(message_model)
            model.last_message_at = message_model.created_at

        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return self._to_conversation(model)

    def get_conversation(self, conversation_id: str) -> Optional[SupportConversation]:
        model = (
            self.db.query(SupportConversationModel)
            .filter(SupportConversationModel.id == conversation_id)
            .first()
        )
        return self._to_conversation(model) if model else None

    def get_conversation_by_token(self, token: str) -> Optional[SupportConversation]:
        model = (
            self.db.query(SupportConversationModel)
            .filter(SupportConversationModel.conversation_token == token)
            .first()
        )
        return self._to_conversation(model) if model else None

    def list_queue(self, limit: int = 50) -> List[SupportConversation]:
        rows = (
            self.db.query(SupportConversationModel)
            .filter(SupportConversationModel.status.in_([ConversationStatus.OPEN.value, ConversationStatus.ASSIGNED.value]))
            .order_by(SupportConversationModel.created_at.asc())
            .limit(limit)
            .all()
        )
        return [self._to_conversation(row, include_messages=False) for row in rows]

    def claim_conversation(self, conversation_id: str, agent_id: str) -> Optional[SupportConversation]:
        conversation = (
            self.db.query(SupportConversationModel)
            .filter(
                SupportConversationModel.id == conversation_id,
                SupportConversationModel.assigned_agent_id.is_(None),
                SupportConversationModel.status.in_([ConversationStatus.OPEN.value, ConversationStatus.ASSIGNED.value]),
            )
            .first()
        )
        if not conversation:
            return None

        conversation.assigned_agent_id = agent_id
        conversation.status = ConversationStatus.ASSIGNED.value
        conversation.updated_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(conversation)
        return self._to_conversation(conversation)

    def close_conversation(self, conversation_id: str, resolution_notes: Optional[str]) -> Optional[SupportConversation]:
        conversation = (
            self.db.query(SupportConversationModel)
            .filter(SupportConversationModel.id == conversation_id)
            .first()
        )
        if not conversation:
            return None

        conversation.status = ConversationStatus.CLOSED.value
        conversation.closed_at = datetime.utcnow()
        conversation.resolution_notes = resolution_notes
        conversation.updated_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(conversation)
        return self._to_conversation(conversation)

    def save_attachment(
        self,
        *,
        conversation_id: str,
        filename: str,
        mime_type: str,
        size_bytes: int,
        storage_path: str,
        checksum: Optional[str],
    ) -> SupportAttachment:
        model = SupportAttachmentModel(
            id=str(uuid.uuid4()),
            conversation_id=conversation_id,
            filename=filename,
            mime_type=mime_type,
            size_bytes=size_bytes,
            storage_path=storage_path,
            checksum=checksum,
        )
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return self._to_attachment(model)

    def add_message(
        self,
        *,
        conversation_id: str,
        sender_role: SenderRole,
        sender_id: Optional[str],
        body: Optional[str],
        attachment_id: Optional[str] = None,
    ) -> Optional[SupportMessage]:
        conversation = (
            self.db.query(SupportConversationModel)
            .filter(SupportConversationModel.id == conversation_id)
            .first()
        )
        if not conversation:
            return None

        message_model = SupportMessageModel(
            id=str(uuid.uuid4()),
            conversation_id=conversation_id,
            sender_role=sender_role.value,
            sender_id=sender_id,
            body=body,
            attachment_id=attachment_id,
            status=MessageStatus.DELIVERED.value,
            created_at=datetime.utcnow(),
        )
        self.db.add(message_model)

        conversation.last_message_at = message_model.created_at
        conversation.updated_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(message_model)
        return self._to_message(message_model)

    def get_recent_messages(self, conversation_id: str, limit: int = 50) -> List[SupportMessage]:
        messages = (
            self.db.query(SupportMessageModel)
            .filter(SupportMessageModel.conversation_id == conversation_id)
            .order_by(SupportMessageModel.created_at.desc())
            .limit(limit)
            .all()
        )
        return [self._to_message(m) for m in reversed(messages)]
