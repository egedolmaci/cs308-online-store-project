from app.domains.order import use_cases as order_use_cases
from app.domains.order.entity import OrderStatus
from app.domains.review import use_cases as review_use_cases
from app.infrastructure.database.sqlite.models.product import ProductModel


def _create_order_for_product(db_session, customer_id, product_id):
    return order_use_cases.create_order(
        db_session,
        customer_id=customer_id,
        delivery_address="456 Review Rd",
        items=[{"product_id": product_id, "quantity": 1}],
    )


def test_create_review_requires_delivered_order(db_session, customer_user):
    product = db_session.query(ProductModel).first()
    order = _create_order_for_product(db_session, customer_user.id, product.id)
    assert order is not None

    review = review_use_cases.create_review(
        db_session,
        user_id=customer_user.id,
        user_name=f"{customer_user.first_name} {customer_user.last_name}",
        product_id=product.id,
        rating=5,
        comment=None,
    )

    assert review is None


def test_create_review_with_comment_enforces_approval(db_session, customer_user):
    product = db_session.query(ProductModel).first()
    order = _create_order_for_product(db_session, customer_user.id, product.id)
    order_use_cases.update_order_status(db_session, order.id, OrderStatus.DELIVERED)

    review = review_use_cases.create_review(
        db_session,
        user_id=customer_user.id,
        user_name=f"{customer_user.first_name} {customer_user.last_name}",
        product_id=product.id,
        rating=4,
        comment="Fantastic quality and fit!",
    )

    assert review is not None
    assert review.is_approved is False  # comments require manager approval
    assert review.order_id == order.id


def test_user_cannot_review_same_product_twice(db_session, customer_user):
    product = db_session.query(ProductModel).first()
    order = _create_order_for_product(db_session, customer_user.id, product.id)
    order_use_cases.update_order_status(db_session, order.id, OrderStatus.DELIVERED)

    first = review_use_cases.create_review(
        db_session,
        user_id=customer_user.id,
        user_name=f"{customer_user.first_name} {customer_user.last_name}",
        product_id=product.id,
        rating=5,
        comment=None,
    )
    assert first is not None

    duplicate = review_use_cases.create_review(
        db_session,
        user_id=customer_user.id,
        user_name=f"{customer_user.first_name} {customer_user.last_name}",
        product_id=product.id,
        rating=4,
        comment="Outstanding fabric quality!",
    )

    assert duplicate is None
