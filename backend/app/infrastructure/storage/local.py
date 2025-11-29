import hashlib
import os
from pathlib import Path
from typing import Iterable, Tuple
from fastapi import HTTPException, UploadFile
from starlette import status

from app.core.logging import logger


def save_support_attachment(
    *,
    conversation_id: str,
    upload: UploadFile,
    base_dir: str,
    max_bytes: int,
    allowed_mime_prefixes: Iterable[str],
) -> Tuple[str, int, str]:
    """
    Save an uploaded attachment to disk with basic validation.

    Returns (storage_path, size_bytes, checksum).
    """
    mime = upload.content_type or "application/octet-stream"
    if allowed_mime_prefixes and not any(mime.startswith(prefix) for prefix in allowed_mime_prefixes):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported attachment type '{mime}'",
        )

    target_dir = Path(base_dir) / conversation_id
    target_dir.mkdir(parents=True, exist_ok=True)

    filename = upload.filename or "attachment"
    safe_name = os.path.basename(filename)
    storage_name = f"{hashlib.sha256(safe_name.encode()).hexdigest()[:8]}_{safe_name}"
    storage_path = target_dir / storage_name

    size = 0
    digest = hashlib.sha256()

    with storage_path.open("wb") as f:
        while True:
            chunk = upload.file.read(8192)
            if not chunk:
                break
            size += len(chunk)
            if size > max_bytes:
                storage_path.unlink(missing_ok=True)
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Attachment too large (limit {max_bytes} bytes)",
                )
            digest.update(chunk)
            f.write(chunk)

    checksum = digest.hexdigest()
    logger.info(f"Stored support attachment {storage_path} ({size} bytes)")

    return str(storage_path), size, checksum
