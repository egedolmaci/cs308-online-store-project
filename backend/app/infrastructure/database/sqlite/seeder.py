import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.infrastructure.database.sqlite.models.product import ProductModel
from app.infrastructure.database.sqlite.models.category import CategoryModel
from app.infrastructure.database.sqlite.models.user import UserModel
from app.core.crypto import encrypt_str
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
        customer2_id = str(uuid.uuid4())
        seed_users = [
            {
                "id": str(uuid.uuid4()),
                "first_name": "Prod",
                "last_name": "Manager",
                "email": "manager@example.com",
                "password_hash": hash_password("12345678"),
                "address": encrypt_str("123 Manager Rd, Business City"),
                "role": "product_manager",
                "tax_id": encrypt_str("11111111111"),
            },
            {
                "id": str(uuid.uuid4()),
                "first_name": "Sales",
                "last_name": "Manager",
                "email": "sales@example.com",
                "password_hash": hash_password("12345678"),
                "address": encrypt_str("123 Sales St, Commerce City"),
                "role": "sales_manager",
                "tax_id": encrypt_str("11111111111"),
            },
            {
                "id": str(uuid.uuid4()),
                "first_name": "Support",
                "last_name": "Agent",
                "email": "support@example.com",
                "password_hash": hash_password("12345678"),
                "address": encrypt_str("123 Sales St, Commerce City"),
                "role": "support_agent",
                "tax_id": encrypt_str("11111111111"),
            },
            {
                "id": customer_id,
                "first_name": "Ahmet",
                "last_name": "Yılmaz",
                "email": "customer@example.com",
                "password_hash": hash_password("12345678"),
                "address": encrypt_str("123 Sales St, Commerce City"),
                "role": "customer",
                "tax_id": encrypt_str("11111111111"),
            },
            {
                "id": customer2_id,
                "first_name": "Customer",
                "last_name": "Example",
                "email": "examplecustomer@example.com",
                "password_hash": hash_password("12345678"),
                "address": encrypt_str("456 Example Ave, Sample Town"),
                "role": "customer",
                "tax_id": encrypt_str("22222222222"),
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

        # Seed orders for customer Customer Example
        logger.info("Seeding orders for Customer Example...")

        # Get various products for diverse order history
        product_a = next((p for p in products if "Product A" in p.name), None)
        product_e = next((p for p in products if "Product E" in p.name), None)
        product_f = next((p for p in products if "Product F" in p.name), None)
        hoodie = next((p for p in products if "Hoodie" in p.name and "Product" not in p.name), None)
        tshirt = next((p for p in products if "Classic Cotton T-Shirt" in p.name), None)

        # Order 1: 5 months ago - delivered
        if tshirt and hoodie:
            order_1_date = datetime.utcnow() - timedelta(days=150)
            order_1_subtotal = (tshirt.price * 2) + hoodie.price
            order_1_tax = round(order_1_subtotal * 0.08, 2)
            order_1 = OrderModel(
                customer_id=customer2_id,
                status=OrderStatus.DELIVERED,
                total_amount=round(order_1_subtotal + order_1_tax, 2),
                tax_amount=order_1_tax,
                shipping_amount=0.00,
                delivery_address=encrypt_str("456 Example Ave, Sample Town"),
                created_at=order_1_date,
                updated_at=order_1_date,
                delivered_at=order_1_date + timedelta(days=4),
            )
            db.add(order_1)
            db.flush()

            # 2x T-shirts
            db.add(OrderItemModel(
                order_id=order_1.id,
                product_id=tshirt.id,
                product_name=tshirt.name,
                product_price=tshirt.price,
                quantity=2,
                subtotal=tshirt.price * 2,
            ))
            # 1x Hoodie
            db.add(OrderItemModel(
                order_id=order_1.id,
                product_id=hoodie.id,
                product_name=hoodie.name,
                product_price=hoodie.price,
                quantity=1,
                subtotal=hoodie.price,
            ))

        # Order 2: 4 months ago - delivered
        if product_b:
            order_2_date = datetime.utcnow() - timedelta(days=120)
            order_2_subtotal = product_b.price * 1
            order_2_tax = round(order_2_subtotal * 0.08, 2)
            order_2 = OrderModel(
                customer_id=customer2_id,
                status=OrderStatus.DELIVERED,
                total_amount=round(order_2_subtotal + order_2_tax, 2),
                tax_amount=order_2_tax,
                shipping_amount=0.00,
                delivery_address=encrypt_str("456 Example Ave, Sample Town"),
                created_at=order_2_date,
                updated_at=order_2_date,
                delivered_at=order_2_date + timedelta(days=3),
            )
            db.add(order_2)
            db.flush()

            db.add(OrderItemModel(
                order_id=order_2.id,
                product_id=product_b.id,
                product_name=product_b.name,
                product_price=product_b.price,
                quantity=1,
                subtotal=product_b.price,
            ))

        # Order 3: 3 months ago - delivered
        if product_e and product_a:
            order_3_date = datetime.utcnow() - timedelta(days=90)
            order_3_subtotal = product_e.price + (product_a.price * 3)
            order_3_tax = round(order_3_subtotal * 0.08, 2)
            order_3 = OrderModel(
                customer_id=customer2_id,
                status=OrderStatus.DELIVERED,
                total_amount=round(order_3_subtotal + order_3_tax, 2),
                tax_amount=order_3_tax,
                shipping_amount=0.00,
                delivery_address=encrypt_str("456 Example Ave, Sample Town"),
                created_at=order_3_date,
                updated_at=order_3_date,
                delivered_at=order_3_date + timedelta(days=5),
            )
            db.add(order_3)
            db.flush()

            db.add(OrderItemModel(
                order_id=order_3.id,
                product_id=product_e.id,
                product_name=product_e.name,
                product_price=product_e.price,
                quantity=1,
                subtotal=product_e.price,
            ))
            db.add(OrderItemModel(
                order_id=order_3.id,
                product_id=product_a.id,
                product_name=product_a.name,
                product_price=product_a.price,
                quantity=3,
                subtotal=product_a.price * 3,
            ))

        # Order 4: 2 months ago - delivered
        if product_f:
            order_4_date = datetime.utcnow() - timedelta(days=60)
            order_4_subtotal = product_f.price * 2
            order_4_tax = round(order_4_subtotal * 0.08, 2)
            order_4 = OrderModel(
                customer_id=customer2_id,
                status=OrderStatus.DELIVERED,
                total_amount=round(order_4_subtotal + order_4_tax, 2),
                tax_amount=order_4_tax,
                shipping_amount=0.00,
                delivery_address=encrypt_str("456 Example Ave, Sample Town"),
                created_at=order_4_date,
                updated_at=order_4_date,
                delivered_at=order_4_date + timedelta(days=4),
            )
            db.add(order_4)
            db.flush()

            db.add(OrderItemModel(
                order_id=order_4.id,
                product_id=product_f.id,
                product_name=product_f.name,
                product_price=product_f.price,
                quantity=2,
                subtotal=product_f.price * 2,
            ))

        # Order 5: 1 month ago - delivered
        if product_c and product_d:
            order_5_date = datetime.utcnow() - timedelta(days=30)
            order_5_subtotal = product_c.price + product_d.price
            order_5_tax = round(order_5_subtotal * 0.08, 2)
            order_5 = OrderModel(
                customer_id=customer2_id,
                status=OrderStatus.DELIVERED,
                total_amount=round(order_5_subtotal + order_5_tax, 2),
                tax_amount=order_5_tax,
                shipping_amount=0.00,
                delivery_address=encrypt_str("456 Example Ave, Sample Town"),
                created_at=order_5_date,
                updated_at=order_5_date,
                delivered_at=order_5_date + timedelta(days=3),
            )
            db.add(order_5)
            db.flush()

            db.add(OrderItemModel(
                order_id=order_5.id,
                product_id=product_c.id,
                product_name=product_c.name,
                product_price=product_c.price,
                quantity=1,
                subtotal=product_c.price,
            ))
            db.add(OrderItemModel(
                order_id=order_5.id,
                product_id=product_d.id,
                product_name=product_d.name,
                product_price=product_d.price,
                quantity=1,
                subtotal=product_d.price,
            ))

        db.commit()
        logger.info("Successfully seeded 5 orders for customer Customer Example!")

        logger.info("Database seeding completed successfully!")

    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {e}")
        raise
