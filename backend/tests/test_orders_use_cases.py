import pytest

from app.domains.order import use_cases as order_use_cases
from app.domains.order.entity import OrderStatus
from app.infrastructure.database.sqlite.models.product import ProductModel


def test_create_order_reduces_stock_and_computes_totals(db_session):
    product = db_session.query(ProductModel).first()
    original_stock = product.stock
    unit_price = product.price
    quantity = 2

    order = order_use_cases.create_order(
        db_session,
        customer_id="customer-1",
        delivery_address="123 Fashion St",
        items=[{"product_id": product.id, "quantity": quantity}],
    )

    assert order is not None
    db_session.refresh(product)
    assert product.stock == original_stock - quantity

    subtotal = unit_price * quantity
    expected_tax = subtotal * 0.08
    expected_shipping = 0.0 if subtotal >= 100 else 10.0
    assert order.total_amount == pytest.approx(subtotal + expected_tax + expected_shipping, rel=1e-4)
    assert order.tax_amount == pytest.approx(expected_tax, rel=1e-4)
    assert order.shipping_amount == expected_shipping


def test_create_order_fails_when_stock_is_insufficient(db_session):
    product = db_session.query(ProductModel).first()
    product.stock = 1
    db_session.commit()

    order = order_use_cases.create_order(
        db_session,
        customer_id="customer-1",
        delivery_address="123 Fashion St",
        items=[{"product_id": product.id, "quantity": 5}],
    )

    assert order is None


def test_cancel_order_restores_inventory(db_session):
    product = db_session.query(ProductModel).first()
    original_stock = product.stock

    order = order_use_cases.create_order(
        db_session,
        customer_id="customer-1",
        delivery_address="123 Fashion St",
        items=[{"product_id": product.id, "quantity": 1}],
    )
    assert order is not None

    cancelled = order_use_cases.cancel_order(db_session, order.id)
    assert cancelled is not None
    assert cancelled.status == OrderStatus.CANCELLED

    refreshed_product = db_session.get(ProductModel, product.id)
    assert refreshed_product.stock == original_stock
