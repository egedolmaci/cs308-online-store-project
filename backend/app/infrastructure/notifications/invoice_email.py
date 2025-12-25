from email.message import EmailMessage
import smtplib

from app.domains.order.entity import Order
from app.infrastructure.pdf.invoice import generate_invoice_pdf
from app.infrastructure.notifications.email_service import send_email_with_attachment
from app.core.config import get_settings
from app.core.logging import logger

def send_order_invoice_email(order: Order, to_email: str, customer_name: str | None = None) -> None:
    pdf_bytes = generate_invoice_pdf(order, customer_name=customer_name)
    subject = f"Your invoice #{order.id}"
    body = "Thank you for your purchase. Your invoice is attached."
    filename = f"invoice-{order.id}.pdf"
    send_email_with_attachment(to_email, subject, body, pdf_bytes, filename)


def send_refund_notification_email(order: Order, to_email: str, refund_amount: float, customer_name: str | None = None) -> None:
    """
    Send a simple refund notification email (no attachment).
    """
    settings = get_settings()
    if not settings.SMTP_HOST:
        logger.warning("SMTP not configured; skipping refund notification email send")
        return

    msg = EmailMessage()
    msg["Subject"] = f"Refund approved for order #{order.id}"
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = to_email
    name = customer_name or "Customer"
    msg.set_content(
        f"Hello {name},\n\n"
        f"Your refund request for order #{order.id} has been approved.\n"
        f"Refunded amount: ${refund_amount:.2f}\n"
        "The amount will be returned to your original payment method.\n\n"
        "Thank you."
    )

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as smtp:
            if settings.SMTP_STARTTLS:
                smtp.starttls()
            if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
                smtp.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            smtp.send_message(msg)
        logger.info(f"Sent refund notification email to {to_email}")
    except Exception as exc:
        logger.error(f"Failed to send refund notification email to {to_email}: {exc}")


def send_refund_decision_email(order: Order, to_email: str, approved: bool, refund_amount: float | None = None, notes: str | None = None, customer_name: str | None = None) -> None:
    """
    Send refund decision email (approved or rejected).
    """
    settings = get_settings()
    if not settings.SMTP_HOST:
        logger.warning("SMTP not configured; skipping refund decision email send")
        return

    msg = EmailMessage()
    status_line = "approved" if approved else "rejected"
    subject = f"Refund {status_line} for order #{order.id}" if approved else f"Refund {status_line} for order #{order.id}"
    msg["Subject"] = subject
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = to_email
    name = customer_name or "Customer"

    body_lines = [
        f"Hello {name},",
        "",
        f"Your refund request for order #{order.id} has been {status_line}.",
    ]
    if approved and refund_amount is not None:
        body_lines.append(f"Refunded amount: ${refund_amount:.2f}")
    if notes:
        body_lines.append(f"Notes: {notes}")
    if approved:
        body_lines.append("The amount will be returned to your original payment method.")
    body_lines.append("")
    body_lines.append("Thank you.")
    msg.set_content("\n".join(body_lines))

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as smtp:
            if settings.SMTP_STARTTLS:
                smtp.starttls()
            if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
                smtp.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            smtp.send_message(msg)
        logger.info(f"Sent refund decision email to {to_email}")
    except Exception as exc:
        logger.error(f"Failed to send refund decision email to {to_email}: {exc}")
