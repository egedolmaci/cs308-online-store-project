from sqlalchemy.orm import Session
from app.infrastructure.database.sqlite.models.product import ProductModel
from app.infrastructure.database.sqlite.seed_data import PRODUCTS
from app.core.logging import logger

def seed_database(db: Session) -> None:
    existing_count = db.query(ProductModel).count()

    if existing_count > 0:
        logger.info(f"Database already has {existing_count} products. Skipping seed.")
        return

    logger.info("Database is empty. Seeding with initial product data...")

    try:
        for product_data in PRODUCTS:
            product = ProductModel(**product_data)
            db.add(product)

        db.commit()
        logger.info(f"Successfully seeded database with {len(PRODUCTS)} products!")

    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {e}")
        raise