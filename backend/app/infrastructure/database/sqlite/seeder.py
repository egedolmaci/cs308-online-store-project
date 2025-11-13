from sqlalchemy.orm import Session
from app.infrastructure.database.sqlite.models.product import ProductModel
from app.infrastructure.database.sqlite.models.category import CategoryModel
from app.infrastructure.database.sqlite.seed_data import PRODUCTS, CATEGORIES
from app.core.logging import logger


def seed_database(db: Session) -> None:
    """Seed database with initial categories and products"""

    # Check if database is already seeded
    existing_product_count = db.query(ProductModel).count()
    existing_category_count = db.query(CategoryModel).count()

    if existing_product_count > 0 or existing_category_count > 0:
        logger.info(
            f"Database already has {existing_category_count} categories "
            f"and {existing_product_count} products. Skipping seed."
        )
        return

    logger.info("Database is empty. Seeding with initial data...")

    try:
        # Seed categories first
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