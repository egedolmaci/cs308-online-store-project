import logging
import smtplib
from email.message import EmailMessage
from typing import List, Dict, Any

from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.domains.notifications.notifier import WishlistNotifier
from app.infrastructure.database.sqlite.models.user import UserModel

logger = logging.getLogger(__name__)


class EmailWishlistNotifier(WishlistNotifier):
    """SMTP-backed notifier for wishlist events."""

    def __init__(self, db: Session):
        self.db = db
        self.settings = get_settings()

    def _get_emails(self, user_ids: List[str]) -> List[str]:
        if not user_ids:
            return []
        rows = (
            self.db.query(UserModel.email)
            .filter(UserModel.id.in_(user_ids))
            .all()
        )
        emails = [row[0] for row in rows if row and row[0]]
        # De-duplicate
        return list({e for e in emails})

    def _send(self, to_addresses: List[str], subject: str, body: str) -> None:
        if not to_addresses:
            return
        if not self.settings.SMTP_HOST or not self.settings.SMTP_USERNAME or not self.settings.SMTP_PASSWORD:
            logger.warning("SMTP not configured; skipping email send.")
            return

        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = self.settings.EMAIL_FROM
        msg["To"] = ", ".join(to_addresses)
        msg.set_content(body)

        try:
            with smtplib.SMTP(self.settings.SMTP_HOST, self.settings.SMTP_PORT, timeout=10) as smtp:
                if self.settings.SMTP_STARTTLS:
                    smtp.starttls()
                smtp.login(self.settings.SMTP_USERNAME, self.settings.SMTP_PASSWORD)
                smtp.send_message(msg)
        except Exception as exc:
            logger.error("Failed to send wishlist email: %s", exc)

    def send_stock_email(self, user_ids: List[str], product: Dict[str, Any]) -> None:
        emails = self._get_emails(user_ids)
        subject = f"Good news: {product.get('name', 'Product')} is back!"
        body = (
            "Heads up, wishlist friend!\n"
            "----------------------------------------\n"
            f"{product.get('name')} just came back in stock.\n"
            f"Price: ${product.get('final_price', product.get('price', 0))}\n"
            f"Stock: {product.get('stock', 'Available')} ready to ship.\n"
            "Move fast before it disappears again.\n"
            "----------------------------------------\n"
            "Open your wishlist to grab it now."
        )
        self._send(emails, subject, body)

    def send_out_of_stock_email(self, user_ids: List[str], product: Dict[str, Any]) -> None:
        emails = self._get_emails(user_ids)
        subject = f"Sold out: {product.get('name', 'Product')} just ran out"
        body = (
            "Quick update from your wishlist:\n"
            "----------------------------------------\n"
            f"{product.get('name')} just went out of stock.\n"
            "We will ping you when it returns, so you can be first in line.\n"
            "----------------------------------------\n"
            "Keep an eye on your wishlist for a restock alert."
        )
        self._send(emails, subject, body)

    def send_discount_email(
        self,
        user_ids: List[str],
        product: Dict[str, Any],
        discount_active: bool,
        discount_rate: float,
    ) -> None:
        emails = self._get_emails(user_ids)
        status_label = "Discount active" if discount_active else "Discount ended"
        subject = f"{status_label}: {product.get('name', 'Product')}"
        price_line = f"Deal price: ${product.get('final_price', product.get('price', 0))}"
        body = (
            "Wishlist deal update:\n"
            "----------------------------------------\n"
            f"{product.get('name')} now has a {discount_rate}% change.\n"
            f"{price_line}\n"
            f"Status: {'Live discount' if discount_active else 'Discount ended'}\n"
            "----------------------------------------\n"
            "Peek at your wishlist to see the latest price."
        )
        self._send(emails, subject, body)
