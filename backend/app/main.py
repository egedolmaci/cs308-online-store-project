from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.logging import logger

from app.infrastructure.database.sqlite.session import Base, engine, SessionLocal
from app.infrastructure.database.sqlite.models.product import ProductModel
from app.infrastructure.database.sqlite.seeder import seed_database 

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