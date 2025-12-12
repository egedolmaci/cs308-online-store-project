import pytest
from datetime import datetime
from app.domains.catalog.entity import Product
from app.domains.catalog.schemas import ProductResponse, ProductUpdate, ProductDiscountRequest, ProductDiscountClearRequest
from app.domains.category.entity import Category
from app.domains.order.entity import Order, OrderItem, OrderStatus


# Product Entity Tests
def test_product_creation():
    """Test creating a product entity"""
    product = Product(
        id=1, name="Test", model="M1", serial_number="SN1",
        description="Desc", price=100.0, stock=10, category_id=1,
        category="Test Category", image="img.jpg", rating=4.5,
        warranty_status="1 year", distributor="Dist"
    )
    assert product.id == 1
    assert product.name == "Test"


def test_product_price_positive():
    """Test product with positive price"""
    product = Product(
        id=1, name="Test", model="M1", serial_number="SN1",
        description=None, price=50.0, stock=5, category_id=1,
        category="Cat", image=None, rating=None,
        warranty_status=None, distributor=None
    )
    assert product.price > 0


def test_product_stock_is_int():
    """Test product stock is integer"""
    product = Product(
        id=1, name="Test", model="M1", serial_number="SN1",
        description=None, price=50.0, stock=5, category_id=1,
        category="Cat", image=None, rating=None,
        warranty_status=None, distributor=None
    )
    assert isinstance(product.stock, int)


def test_product_discount_default():
    """Test product discount defaults"""
    product = Product(
        id=1, name="Test", model="M1", serial_number="SN1",
        description=None, price=50.0, stock=5, category_id=1,
        category="Cat", image=None, rating=None,
        warranty_status=None, distributor=None
    )
    assert product.discount_rate == 0.0
    assert product.discount_active is False


def test_product_optional_fields():
    """Test product optional fields can be None"""
    product = Product(
        id=None, name="Test", model="M1", serial_number="SN1",
        description=None, price=50.0, stock=5, category_id=1,
        category="Cat", image=None, rating=None,
        warranty_status=None, distributor=None
    )
    assert product.id is None
    assert product.description is None


# Category Entity Tests
def test_category_creation():
    """Test creating a category"""
    category = Category(id=1, name="Test Category")
    assert category.id == 1
    assert category.name == "Test Category"


def test_category_name_title_case():
    """Test category name is title cased"""
    category = Category(id=1, name="test category")
    assert category.name == "Test Category"


def test_category_name_stripped():
    """Test category name is stripped"""
    category = Category(id=1, name="  Test  ")
    assert category.name == "Test"


def test_category_empty_name_raises():
    """Test empty category name raises error"""
    with pytest.raises(ValueError):
        Category(id=1, name="")


def test_category_whitespace_name_raises():
    """Test whitespace-only name raises error"""
    with pytest.raises(ValueError):
        Category(id=1, name="   ")


# Order Entity Tests
def test_order_status_enum():
    """Test order status enum values"""
    assert OrderStatus.PROCESSING == "processing"
    assert OrderStatus.DELIVERED == "delivered"


def test_order_item_creation():
    """Test creating an order item"""
    item = OrderItem(
        id=1, order_id=1, product_id=1,
        product_name="Test", product_price=50.0,
        quantity=2, subtotal=100.0
    )
    assert item.quantity == 2
    assert item.subtotal == 100.0


def test_order_creation():
    """Test creating an order"""
    order = Order(
        id=1, customer_id="uuid-123",
        status=OrderStatus.PROCESSING,
        total_amount=100.0, tax_amount=8.0,
        shipping_amount=5.0, delivery_address="123 Main St",
        created_at=datetime.now(), updated_at=datetime.now(),
        items=[]
    )
    assert order.id == 1
    assert order.status == OrderStatus.PROCESSING


def test_order_items_list():
    """Test order items is a list"""
    order = Order(
        id=1, customer_id="uuid-123",
        status=OrderStatus.PROCESSING,
        total_amount=100.0, tax_amount=8.0,
        shipping_amount=5.0, delivery_address="123 Main St",
        created_at=None, updated_at=None,
        items=[]
    )
    assert isinstance(order.items, list)


def test_order_optional_timestamps():
    """Test order optional timestamp fields"""
    order = Order(
        id=1, customer_id="uuid-123",
        status=OrderStatus.PROCESSING,
        total_amount=100.0, tax_amount=8.0,
        shipping_amount=5.0, delivery_address="123 Main St",
        created_at=None, updated_at=None,
        items=[]
    )
    assert order.delivered_at is None
    assert order.cancelled_at is None


# Schema Tests
def test_product_discount_request_validation():
    """Test product discount request with valid data"""
    request = ProductDiscountRequest(
        product_ids=[1, 2, 3],
        discount_rate=20.0
    )
    assert len(request.product_ids) == 3
    assert request.discount_rate == 20.0


def test_product_discount_empty_ids_raises():
    """Test discount request with empty IDs raises error"""
    with pytest.raises(ValueError):
        ProductDiscountRequest(
            product_ids=[],
            discount_rate=20.0
        )


def test_product_discount_invalid_rate_raises():
    """Test discount request with invalid rate raises error"""
    with pytest.raises(ValueError):
        ProductDiscountRequest(
            product_ids=[1],
            discount_rate=150.0
        )


def test_product_discount_zero_rate_raises():
    """Test discount request with zero rate raises error"""
    with pytest.raises(ValueError):
        ProductDiscountRequest(
            product_ids=[1],
            discount_rate=0.0
        )


def test_product_discount_clear_request():
    """Test product discount clear request"""
    request = ProductDiscountClearRequest(product_ids=[1, 2])
    assert len(request.product_ids) == 2


def test_product_update_all_optional():
    """Test product update with no fields"""
    update = ProductUpdate()
    assert update.name is None
    assert update.price is None


def test_product_update_partial():
    """Test product update with partial fields"""
    update = ProductUpdate(name="New Name", price=99.99)
    assert update.name == "New Name"
    assert update.price == 99.99
    assert update.stock is None


def test_order_status_cancelled():
    """Test cancelled order status"""
    assert OrderStatus.CANCELLED == "cancelled"


def test_order_status_refunded():
    """Test refunded order status"""
    assert OrderStatus.REFUNDED == "refunded"


def test_order_total_amount_type():
    """Test order total amount is float"""
    order = Order(
        id=1, customer_id="uuid-123",
        status=OrderStatus.PROCESSING,
        total_amount=100.50, tax_amount=8.0,
        shipping_amount=5.0, delivery_address="123 Main St",
        created_at=None, updated_at=None,
        items=[]
    )
    assert isinstance(order.total_amount, float)
