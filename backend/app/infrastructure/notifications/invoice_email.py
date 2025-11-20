from app.domains.order.entity import Order
from app.infrastructure.pdf.invoice import generate_invoice_pdf
from app.infrastructure.notifications.email_service import send_email_with_attachment

def send_order_invoice_email(order: Order, to_email: str, customer_name: str | None = None) -> None:
    pdf_bytes = generate_invoice_pdf(order, customer_name=customer_name)
    subject = f"Your invoice #{order.id}"
    body = "Thank you for your purchase. Your invoice is attached."
    filename = f"invoice-{order.id}.pdf"
    send_email_with_attachment(to_email, subject, body, pdf_bytes, filename)
