from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.logging import logger

from app.infrastructure.database.sqlite.session import Base, engine, SessionLocal
from app.infrastructure.database.sqlite.models.product import ProductModel
from app.infrastructure.database.sqlite.models.category import CategoryModel
from app.infrastructure.database.sqlite.models.order import OrderModel, OrderItemModel
from app.infrastructure.database.sqlite.models.user import UserModel
from app.infrastructure.database.sqlite.models.review import ReviewModel
from app.infrastructure.database.sqlite.seeder import seed_database

from app.api.endpoints import auth as auth_endpoints
from app.api.endpoints import products as products_endpoints
from app.api.endpoints import orders as orders_endpoints
from app.api.endpoints import categories as categories_endpoints
from app.api.endpoints import reviews as reviews_endpoints
from app.api.endpoints import support as support_endpoints
from app.api.endpoints import users as users_endpoints

settings = get_settings()

def create_application() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth_endpoints.router)
    app.include_router(products_endpoints.router)
    app.include_router(categories_endpoints.router)
    app.include_router(orders_endpoints.router)
    app.include_router(reviews_endpoints.router)
    app.include_router(support_endpoints.router)
    app.include_router(users_endpoints.router)

    @app.get("/health")
    def health_check():
        return {"status": "healthy", "version": settings.VERSION}


    @app.on_event("startup")
    def startup_event():
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully!")

        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()
          

    return app

app = create_application()
