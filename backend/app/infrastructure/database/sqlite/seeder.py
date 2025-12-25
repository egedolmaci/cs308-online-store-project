import uuid
from sqlalchemy.orm import Session
from app.infrastructure.database.sqlite.models.product import ProductModel
from app.infrastructure.database.sqlite.models.category import CategoryModel
from app.infrastructure.database.sqlite.models.user import UserModel
from app.infrastructure.database.sqlite.seed_data import PRODUCTS, CATEGORIES
from app.core.security import hash_password
from app.core.logging import logger
from app.core.crypto import encrypt_str


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
        seed_users = [
            {
                "id": str(uuid.uuid4()),
                "first_name": "Prod",
                "last_name": "Manager",
                "email": "manager@example.com",
                "password_hash": hash_password("12345678"),
                "address": encrypt_str("123 Manager Rd, Business City"),
                "role": "product_manager",
            },
            {
                "id": str(uuid.uuid4()),
                "first_name": "Sales",
                "last_name": "Manager",
                "email": "sales@example.com",
                "password_hash": hash_password("12345678"),
                "address": encrypt_str("123 Sales St, Commerce City"),
                "role": "sales_manager",
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
        logger.info(f"Successfully seeded {len(PRODUCTS)} products!")

        logger.info("Database seeding completed successfully!")

    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {e}")
        raise
