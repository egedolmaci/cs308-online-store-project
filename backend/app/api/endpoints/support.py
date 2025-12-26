from typing import Dict, Optional, Set

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    Request,
    UploadFile,
    WebSocket,
    WebSocketDisconnect,
    status,
)
from fastapi.responses import FileResponse

from app.api.endpoints.auth import ACCESS_COOKIE_NAME, get_current_user, require_roles
from app.core.config import get_settings
from app.core.logging import logger
from app.domains.identity.use_cases import get_user, verify_token
from app.domains.support import use_cases
from app.domains.support.entity import ConversationStatus, SenderRole
from app.domains.support.schemas import (
    SupportAttachmentResponse,
    SupportCloseRequest,
    SupportConversationCreate,
    SupportConversationResponse,
    SupportConversationSummary,
    SupportContextSnapshotResponse,
    SupportMessageResponse,
    SupportQueueResponse,
)
from app.infrastructure.database.sqlite.session import SessionLocal, get_db
from app.infrastructure.storageutils.local import save_support_attachment

router = APIRouter(prefix="/api/v1/support", tags=["support"])
settings = get_settings()


def _optional_user(request: Request):
    """
    Extract authenticated user if present. Raises 401 on invalid token.
    """
    token: Optional[str] = request.cookies.get(ACCESS_COOKIE_NAME)
    auth_header = request.headers.get("authorization")
    if auth_header and auth_header.lower().startswith("bearer "):
        token = auth_header.split(" ", 1)[1]

    if not token:
        return None

    payload = verify_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = get_user(payload.get("sub"))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return user, payload.get("role")


def _map_attachment(attachment) -> SupportAttachmentResponse:
    return SupportAttachmentResponse(
        id=attachment.id,
        filename=attachment.filename,
        mime_type=attachment.mime_type,
        size_bytes=attachment.size_bytes,
        created_at=attachment.created_at,
    )


def _map_message(message) -> SupportMessageResponse:
    attachment = _map_attachment(message.attachment) if message.attachment else None
    return SupportMessageResponse(
        id=message.id,
        conversation_id=message.conversation_id,
        sender_role=message.sender_role,
        sender_id=message.sender_id,
        body=message.body,
        status=message.status,
        created_at=message.created_at,
        attachment=attachment,
    )


def _map_conversation(conversation, messages=None) -> SupportConversationResponse:
    context = None
    if conversation.context_snapshot:
        snapshot = conversation.context_snapshot
        context = SupportContextSnapshotResponse(
            cart_items=snapshot.cart_items,
            orders_summary=snapshot.orders_summary,
            wish_list_items=snapshot.wish_list_items,
            captured_at=snapshot.captured_at,
        )
    message_list = messages if messages is not None else conversation.messages
    mapped_messages = [_map_message(msg) for msg in message_list]

    return SupportConversationResponse(
        id=conversation.id,
        status=conversation.status,
        customer_id=conversation.customer_id,
        conversation_token=conversation.conversation_token,
        assigned_agent_id=conversation.assigned_agent_id,
        guest_name=conversation.guest_name,
        guest_email=conversation.guest_email,
        last_message_at=conversation.last_message_at,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
        closed_at=conversation.closed_at,
        resolution_notes=conversation.resolution_notes,
        context_snapshot=context,
        messages=mapped_messages,
    )


def _map_summary(conversation) -> SupportConversationSummary:
    return SupportConversationSummary(
        id=conversation.id,
        status=conversation.status,
        customer_id=conversation.customer_id,
        assigned_agent_id=conversation.assigned_agent_id,
        guest_name=conversation.guest_name,
        guest_email=conversation.guest_email,
        last_message_at=conversation.last_message_at,
        created_at=conversation.created_at,
    )


def _is_agent(role: Optional[str]) -> bool:
    return role in ("support_agent", "support_admin")


def _ensure_conversation_access(conversation, user_id: Optional[str], role: Optional[str], conversation_token: Optional[str]):
    if conversation is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    if _is_agent(role):
        return

    if conversation.customer_id and conversation.customer_id == user_id:
        return

    if conversation.conversation_token and conversation_token == conversation.conversation_token:
        return

    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")


@router.post("/conversations", response_model=SupportConversationResponse)
def start_conversation(
    payload: SupportConversationCreate,
    request: Request,
    db=Depends(get_db),
):
    user_with_role = _optional_user(request)
    user_id = user_with_role[0].id if user_with_role else None

    conversation, token = use_cases.start_conversation(
        db,
        customer_id=user_id,
        guest_name=payload.guest_name,
        guest_email=payload.guest_email,
        initial_message=payload.initial_message,
        cart_items=payload.cart_items or [],
        wish_list_items=payload.wish_list_items or [],
    )

    # Ensure token is reflected back for guests
    conversation.conversation_token = token or conversation.conversation_token
    messages = use_cases.recent_messages(db, conversation.id, limit=settings.SUPPORT_HISTORY_LIMIT)
    return _map_conversation(conversation, messages=messages)

@router.get(
    "/conversations/queue",
    response_model=SupportQueueResponse,
    dependencies=[Depends(require_roles("support_agent", "support_admin"))],
)
def get_queue(db=Depends(get_db)):
    items = use_cases.list_queue(db, limit=settings.SUPPORT_QUEUE_LIMIT)
    summaries = [_map_summary(item) for item in items]
    return SupportQueueResponse(conversations=summaries)


@router.get("/conversations/{conversation_id}", response_model=SupportConversationResponse)
def get_conversation(
    conversation_id: str,
    request: Request,
    conversation_token: Optional[str] = None,
    db=Depends(get_db),
):
    user_with_role = _optional_user(request)
    user_id = user_with_role[0].id if user_with_role else None
    role = user_with_role[1] if user_with_role else None

    conversation = use_cases.get_conversation(db, conversation_id)
    _ensure_conversation_access(conversation, user_id, role, conversation_token)

    messages = use_cases.recent_messages(db, conversation_id, limit=settings.SUPPORT_HISTORY_LIMIT)
    return _map_conversation(conversation, messages=messages)


@router.post(
    "/conversations/{conversation_id}/claim",
    response_model=SupportConversationResponse,
    dependencies=[Depends(require_roles("support_agent", "support_admin"))],
)
def claim_conversation(conversation_id: str, user=Depends(get_current_user), db=Depends(get_db)):
    agent, _role = user
    conversation = use_cases.claim_conversation(db, conversation_id, agent.id)
    if not conversation:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Conversation already claimed or missing")
    messages = use_cases.recent_messages(db, conversation.id, limit=settings.SUPPORT_HISTORY_LIMIT)
    return _map_conversation(conversation, messages=messages)


@router.post("/conversations/{conversation_id}/close", response_model=SupportConversationResponse)
def close_conversation(
    conversation_id: str,
    payload: SupportCloseRequest,
    request: Request,
    conversation_token: Optional[str] = None,
    db=Depends(get_db),
):
    user_with_role = _optional_user(request)
    user_id = user_with_role[0].id if user_with_role else None
    role = user_with_role[1] if user_with_role else None

    conversation = use_cases.get_conversation(db, conversation_id)
    _ensure_conversation_access(conversation, user_id, role, conversation_token)

    closed = use_cases.close_conversation(db, conversation_id, payload.resolution_notes)
    if not closed:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    # Broadcast close event to all connected clients
    manager.broadcast_sync(
        conversation_id,
        {
            "type": "conversation_closed",
            "closed_by": "agent" if _is_agent(role) else "customer",
            "resolution_notes": payload.resolution_notes,
            "closed_at": closed.closed_at.isoformat() if closed.closed_at else None,
        }
    )

    messages = use_cases.recent_messages(db, conversation_id, limit=settings.SUPPORT_HISTORY_LIMIT)
    return _map_conversation(closed, messages=messages)


@router.get("/conversations/{conversation_id}/messages", response_model=list[SupportMessageResponse])
def get_messages(
    conversation_id: str,
    request: Request,
    conversation_token: Optional[str] = None,
    db=Depends(get_db),
):
    user_with_role = _optional_user(request)
    user_id = user_with_role[0].id if user_with_role else None
    role = user_with_role[1] if user_with_role else None

    conversation = use_cases.get_conversation(db, conversation_id)
    _ensure_conversation_access(conversation, user_id, role, conversation_token)

    messages = use_cases.recent_messages(db, conversation_id, limit=settings.SUPPORT_HISTORY_LIMIT)
    return [_map_message(m) for m in messages]


@router.post("/conversations/{conversation_id}/attachments", response_model=SupportMessageResponse)
def upload_attachment(
    conversation_id: str,
    request: Request,
    file: UploadFile = File(...),
    conversation_token: Optional[str] = None,
    db=Depends(get_db),
):
    user_with_role = _optional_user(request)
    user_id = user_with_role[0].id if user_with_role else None
    role = user_with_role[1] if user_with_role else None

    conversation = use_cases.get_conversation(db, conversation_id)
    _ensure_conversation_access(conversation, user_id, role, conversation_token)

    if conversation.status == ConversationStatus.CLOSED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Conversation is closed")

    max_bytes = settings.SUPPORT_ATTACHMENT_MAX_MB * 1024 * 1024
    storage_path, size, checksum = save_support_attachment(
        conversation_id=conversation_id,
        upload=file,
        base_dir=settings.SUPPORT_ATTACHMENT_DIR,
        max_bytes=max_bytes,
        allowed_mime_prefixes=settings.SUPPORT_ALLOWED_MIME_PREFIXES,
    )

    attachment = use_cases.add_attachment(
        db,
        conversation_id=conversation_id,
        filename=file.filename or "attachment",
        mime_type=file.content_type or "application/octet-stream",
        size_bytes=size,
        storage_path=storage_path,
        checksum=checksum,
    )

    sender_role = SenderRole.AGENT if _is_agent(role) else SenderRole.CUSTOMER
    sender_id = user_id if user_id else None

    message = use_cases.add_message(
        db,
        conversation_id=conversation_id,
        sender_role=sender_role,
        sender_id=sender_id,
        body=None,
        attachment_id=attachment.id,
    )

    mapped = _map_message(message)
    # Notify live participants
    manager.broadcast_sync(conversation_id, {"type": "message", "payload": mapped.model_dump(mode="json")})
    return mapped


@router.get("/attachments/{attachment_id}/download")
def download_attachment(
    attachment_id: str,
    request: Request,
    conversation_token: Optional[str] = None,
    db=Depends(get_db),
):
    """Download an attachment file."""
    import os

    user_with_role = _optional_user(request)
    user_id = user_with_role[0].id if user_with_role else None
    role = user_with_role[1] if user_with_role else None

    # Get attachment
    attachment = use_cases.get_attachment(db, attachment_id)
    if not attachment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attachment not found")

    # Verify access to the conversation
    conversation = use_cases.get_conversation(db, attachment.conversation_id)
    _ensure_conversation_access(conversation, user_id, role, conversation_token)

    # Build full file path
    file_path = os.path.join(settings.SUPPORT_ATTACHMENT_DIR, attachment.storage_path)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found on server")

    return FileResponse(
        path=file_path,
        filename=attachment.filename,
        media_type=attachment.mime_type,
    )


class SupportConnectionManager:
    """Tracks active websocket connections per conversation."""

    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, conversation_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.setdefault(conversation_id, set()).add(websocket)

    def disconnect(self, conversation_id: str, websocket: WebSocket):
        conns = self.active_connections.get(conversation_id)
        if conns and websocket in conns:
            conns.remove(websocket)
        if conns and len(conns) == 0:
            self.active_connections.pop(conversation_id, None)

    async def broadcast(self, conversation_id: str, message: dict):
        conns = list(self.active_connections.get(conversation_id, []))
        for connection in conns:
            try:
                await connection.send_json(message)
            except Exception as exc:  # noqa: BLE001
                logger.warning(f"Failed to broadcast to websocket: {exc}")
                self.disconnect(conversation_id, connection)

    def broadcast_sync(self, conversation_id: str, message: dict):
        """Best-effort sync broadcast for HTTP endpoints."""
        import asyncio

        try:
            loop = asyncio.get_running_loop()
            loop.create_task(self.broadcast(conversation_id, message))
        except RuntimeError:
            asyncio.run(self.broadcast(conversation_id, message))


manager = SupportConnectionManager()


def _extract_ws_token(websocket: WebSocket) -> Optional[str]:
    auth_header = websocket.headers.get("authorization")
    if auth_header and auth_header.lower().startswith("bearer "):
        return auth_header.split(" ", 1)[1]
    cookie_token = websocket.cookies.get(ACCESS_COOKIE_NAME)
    if cookie_token:
        return cookie_token
    return None


@router.websocket("/ws")
async def websocket_support(websocket: WebSocket):
    db = SessionLocal()
    params = websocket.query_params
    conversation_id = params.get("conversation_id")
    conversation_token = params.get("conversation_token")

    if not conversation_id:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="conversation_id is required")
        return

    # Authenticate if possible
    token = _extract_ws_token(websocket)
    user = None
    role = None
    if token:
        payload = verify_token(token)
        if not payload or payload.get("type") != "access":
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Invalid token")
            db.close()
            return
        user = get_user(payload.get("sub"))
        role = payload.get("role")
        if not user:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="User not found")
            db.close()
            return

    conversation = use_cases.get_conversation(db, conversation_id)
    try:
        _ensure_conversation_access(conversation, user.id if user else None, role, conversation_token)
    except HTTPException as exc:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason=exc.detail)
        db.close()
        return

    # Auto-claim for agents if unassigned
    if _is_agent(role) and conversation.assigned_agent_id is None and user:
        claimed = use_cases.claim_conversation(db, conversation_id, user.id)
        if claimed:
            conversation = claimed

    await manager.connect(conversation_id, websocket)

    # Send history and context once connected
    history = use_cases.recent_messages(db, conversation_id, limit=settings.SUPPORT_HISTORY_LIMIT)

    # Map context snapshot if available
    context_data = None
    if conversation.context_snapshot:
        snapshot = conversation.context_snapshot
        context_data = {
            "cart_items": snapshot.cart_items,
            "orders_summary": snapshot.orders_summary,
            "wish_list_items": snapshot.wish_list_items,
            "captured_at": snapshot.captured_at.isoformat() if snapshot.captured_at else None,
        }

    await websocket.send_json(
        {
            "type": "history",
            "messages": [ _map_message(m).model_dump(mode="json") for m in history],
            "context_snapshot": context_data,
        }
    )

    sender_role = SenderRole.AGENT if _is_agent(role) else SenderRole.CUSTOMER
    sender_id = user.id if user else None

    try:
        while True:
            data = await websocket.receive_json()
            action = data.get("action")

            if action == "send_message":
                body = data.get("body")
                conversation = use_cases.get_conversation(db, conversation_id)
                if not conversation:
                    await websocket.send_json({"type": "error", "detail": "Conversation not found"})
                    continue
                if conversation.status == ConversationStatus.CLOSED:
                    await websocket.send_json({"type": "error", "detail": "Conversation is closed"})
                    continue
                if not body:
                    await websocket.send_json({"type": "error", "detail": "Message body is required"})
                    continue
                message = use_cases.add_message(
                    db,
                    conversation_id=conversation_id,
                    sender_role=sender_role,
                    sender_id=sender_id,
                    body=body,
                )
                if message:
                    payload = _map_message(message).model_dump(mode="json")
                    await manager.broadcast(conversation_id, {"type": "message", "payload": payload})
            elif action == "typing":
                await manager.broadcast(
                    conversation_id,
                    {"type": "typing", "from": sender_role, "conversation_id": conversation_id},
                )
            else:
                await websocket.send_json({"type": "error", "detail": "Unknown action"})
    except WebSocketDisconnect:
        manager.disconnect(conversation_id, websocket)
    finally:
        if db:
            db.close()
