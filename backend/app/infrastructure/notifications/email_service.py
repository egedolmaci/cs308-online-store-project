import smtplib
from email.message import EmailMessage
from app.core.config import get_settings
from app.core.logging import logger

def send_email_with_attachment(
    to_email: str,
    subject: str,
    body: str,
    attachment_bytes: bytes,
    filename: str,
    content_type: str = "application/pdf",
) -> None:
    settings = get_settings()

    if not settings.SMTP_HOST:
        logger.warning("SMTP not configured; skipping invoice email send")
        return

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = to_email
    msg.set_content(body)

    maintype, subtype = content_type.split("/", 1)
    msg.add_attachment(attachment_bytes, maintype=maintype, subtype=subtype, filename=filename)

    try:
        if settings.SMTP_STARTTLS:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as smtp:
                smtp.ehlo()
                smtp.starttls()
                if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
                    smtp.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                smtp.send_message(msg)
        else:
            with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT) as smtp:
                if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
                    smtp.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                smtp.send_message(msg)
        logger.info(f"Sent order invoice email to {to_email}")
    except Exception as e:
        logger.error(f"Failed to send invoice email to {to_email}: {e}")
