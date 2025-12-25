from typing import Protocol, List, Dict, Any


class WishlistNotifier(Protocol):
    def send_stock_email(self, user_ids: List[str], product: Dict[str, Any]) -> None:
        ...

    def send_out_of_stock_email(self, user_ids: List[str], product: Dict[str, Any]) -> None:
        ...

    def send_discount_email(
        self,
        user_ids: List[str],
        product: Dict[str, Any],
        discount_active: bool,
        discount_rate: float,
    ) -> None:
        ...


class ConsoleWishlistNotifier(WishlistNotifier):
    """Simple notifier that logs to stdout; replace with real email service."""

    def send_stock_email(self, user_ids: List[str], product: Dict[str, Any]) -> None:
        print("[NOTIFY] back-in-stock", user_ids, product)

    def send_out_of_stock_email(self, user_ids: List[str], product: Dict[str, Any]) -> None:
        print("[NOTIFY] out-of-stock", user_ids, product)

    def send_discount_email(
        self,
        user_ids: List[str],
        product: Dict[str, Any],
        discount_active: bool,
        discount_rate: float,
    ) -> None:
        print(
            "[NOTIFY] discount-changed",
            user_ids,
            product,
            {"discount_active": discount_active, "discount_rate": discount_rate},
        )
