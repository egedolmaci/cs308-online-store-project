import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.infrastructure.database.sqlite.models.product import ProductModel
from app.infrastructure.database.sqlite.models.category import CategoryModel
from app.infrastructure.database.sqlite.models.user import UserModel
from app.infrastructure.database.sqlite.models.order import OrderModel, OrderItemModel
from app.infrastructure.database.sqlite.seed_data import PRODUCTS, CATEGORIES
from app.core.security import hash_password
from app.core.logging import logger
from app.core.crypto import encrypt_str
from app.domains.order.entity import OrderStatus


def seed_database(db: Session) -> None:
    """Seed database with initial categories, products, and users"""

    # Check if database is already seeded
    existing_product_count = db.query(ProductModel).count()
    existing_category_count = db.query(CategoryModel).count()
    existing_user_count = db.query(UserModel).count()

    if existing_product_count > 0 or existing_category_count > 0:
        logger.info(
            f"Database already has {existing_category_count} categories "
            f"and {existing_product_count} products. Skipping seed."
        )
        return

    logger.info("Database is empty. Seeding with initial data...")

    try:
        # Seed users first
        logger.info("Seeding users...")
        customer_id = str(uuid.uuid4())
        seed_users = [
            {
                "id": str(uuid.uuid4()),
                "first_name": "Prod",
                "last_name": "Manager",
                "email": "manager@example.com",
                "password_hash": hash_password("12345678"),
                "address": encrypt_str("123 Manager Rd, Business City"),
                "role": "product_manager",
                "tax_id": "11111111111",
            },
            {
                "id": str(uuid.uuid4()),
                "first_name": "Sales",
                "last_name": "Manager",
                "email": "sales@example.com",
                "password_hash": hash_password("12345678"),
                "address": encrypt_str("123 Sales St, Commerce City"),
                "role": "sales_manager",
                "tax_id": "11111111111",
            },
            {
                "id": str(uuid.uuid4()),
                "first_name": "Support",
                "last_name": "Agent",
                "email": "support@example.com",
                "password_hash": hash_password("12345678"),
                "address": encrypt_str("123 Sales St, Commerce City"),
                "role": "support_agent",
                "tax_id": "11111111111",
            },
            {
                "id": customer_id,
                "first_name": "Ahmet",
                "last_name": "Yılmaz",
                "email": "customer@example.com",
                "password_hash": hash_password("12345678"),
                "address": encrypt_str("123 Sales St, Commerce City"),
                "role": "customer",
                "tax_id": "11111111111",
            },
        ]

        for user_data in seed_users:
            user = UserModel(**user_data)
            db.add(user)

        db.commit()
        logger.info(f"Successfully seeded {len(seed_users)} users!")

        # Seed categories
        logger.info("Seeding categories...")
        category_map = {}  # Map category name to ID
        for category_name in CATEGORIES:
            category = CategoryModel(name=category_name)
            db.add(category)
            db.flush()  # Get the ID without committing
            category_map[category_name] = category.id

        db.commit()
        logger.info(f"Successfully seeded {len(CATEGORIES)} categories!")

        # Seed products
        logger.info("Seeding products...")
        for product_data in PRODUCTS:
            # Convert category name to category_id
            product_dict = product_data.copy()
            category_name = product_dict.pop("category")  # Remove category string
            product_dict["category_id"] = category_map[category_name]  # Add category_id

            product = ProductModel(**product_dict)
            db.add(product)

        db.commit()
        db.flush()
        logger.info(f"Successfully seeded {len(PRODUCTS)} products!")

        # Seed orders for customer Ahmet Yılmaz
        logger.info("Seeding orders...")

        # Get product IDs for Product B, C, D (indices 1, 2, 12 in the products list)
        products = db.query(ProductModel).all()
        product_b = next((p for p in products if "Product B" in p.name), None)
        product_c = next((p for p in products if "Product C" in p.name), None)
        product_d = next((p for p in products if "Product D" in p.name), None)

        if product_b and product_c and product_d:
            # Order 1: Product B - delivered more than 30 days ago
            order_b_date = datetime.utcnow() - timedelta(days=45)
            order_b = OrderModel(
                customer_id=customer_id,
                status=OrderStatus.DELIVERED,
                total_amount=86.39,
                tax_amount=6.40,
                shipping_amount=0.00,
                delivery_address=encrypt_str("123 Sales St, Commerce City"),
                created_at=order_b_date,
                updated_at=order_b_date,
                delivered_at=order_b_date + timedelta(days=3),
            )
            db.add(order_b)
            db.flush()

            order_b_item = OrderItemModel(
                order_id=order_b.id,
                product_id=product_b.id,
                product_name=product_b.name,
                product_price=product_b.price,
                quantity=1,
                subtotal=product_b.price,
            )
            db.add(order_b_item)

            # Order 2: Product C - delivered less than 30 days ago
            order_c_date = datetime.utcnow() - timedelta(days=15)
            order_c = OrderModel(
                customer_id=customer_id,
                status=OrderStatus.DELIVERED,
                total_amount=59.39,
                tax_amount=4.40,
                shipping_amount=0.00,
                delivery_address=encrypt_str("123 Sales St, Commerce City"),
                created_at=order_c_date,
                updated_at=order_c_date,
                delivered_at=order_c_date + timedelta(days=2),
            )
            db.add(order_c)
            db.flush()

            order_c_item = OrderItemModel(
                order_id=order_c.id,
                product_id=product_c.id,
                product_name=product_c.name,
                product_price=product_c.price,
                quantity=1,
                subtotal=product_c.price,
            )
            db.add(order_c_item)

            # Order 3: Product D - processing status (recent)
            order_d_date = datetime.utcnow() - timedelta(days=2)
            order_d = OrderModel(
                customer_id=customer_id,
                status=OrderStatus.PROCESSING,
                total_amount=161.99,
                tax_amount=12.00,
                shipping_amount=0.00,
                delivery_address=encrypt_str("123 Sales St, Commerce City"),
                created_at=order_d_date,
                updated_at=order_d_date,
            )
            db.add(order_d)
            db.flush()

            order_d_item = OrderItemModel(
                order_id=order_d.id,
                product_id=product_d.id,
                product_name=product_d.name,
                product_price=product_d.price,
                quantity=1,
                subtotal=product_d.price,
            )
            db.add(order_d_item)

            db.commit()
            logger.info("Successfully seeded 3 orders for customer Ahmet Yılmaz!")

        logger.info("Database seeding completed successfully!")

    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {e}")
        raise
