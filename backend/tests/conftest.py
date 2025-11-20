import os
import sys
import uuid
from pathlib import Path
from typing import Dict

import pytest
from fastapi.testclient import TestClient

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

TEST_DB_PATH = ROOT_DIR / "tests" / "test_database.db"
os.environ["SQLITE_DATABASE_URL"] = f"sqlite:///{TEST_DB_PATH}"

from app.core.config import get_settings
from app.infrastructure.database.sqlite import session as db_session
from app.infrastructure.database.sqlite.seeder import seed_database
from app.infrastructure.database.sqlite.session import get_db
from app.api.endpoints import auth as auth_module
from app.domains.identity.repository import User
from app.main import create_application

get_settings.cache_clear()

app = create_application()
Base = db_session.Base
engine = db_session.engine
SessionLocal = db_session.SessionLocal


@pytest.fixture(scope="function")
def seeded_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as session:
        seed_database(session)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db_session(seeded_db):
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def customer_user():
    return User(
        id=str(uuid.uuid4()),
        first_name="Test",
        last_name="Customer",
        email="customer@example.com",
        password_hash="hashed",
        role="customer",
        address="123 Test St",
    )


@pytest.fixture()
def product_manager_user():
    return User(
        id=str(uuid.uuid4()),
        first_name="Prod",
        last_name="Manager",
        email="manager@example.com",
        password_hash="hashed",
        role="product_manager",
        address="321 Manager Rd",
    )


@pytest.fixture()
def sales_manager_user():
    return User(
        id=str(uuid.uuid4()),
        first_name="Sales",
        last_name="Manager",
        email="sales@example.com",
        password_hash="hashed",
        role="sales_manager",
        address="654 Sales Ave",
    )


@pytest.fixture()
def auth_state(customer_user) -> Dict[str, object]:
    return {"user": customer_user, "role": "customer"}


@pytest.fixture()
def another_customer_user():
    return User(
        id=str(uuid.uuid4()),
        first_name="Alt",
        last_name="Customer",
        email="alt.customer@example.com",
        password_hash="hashed",
        role="customer",
        address="987 Alternate St",
    )


@pytest.fixture()
def set_auth_state(auth_state):
    def _set(user, role: str):
        auth_state["user"] = user
        auth_state["role"] = role
    return _set


@pytest.fixture()
def client(seeded_db, auth_state):
    def override_get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    def override_get_current_user():
        return auth_state["user"], auth_state["role"]

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[auth_module.get_current_user] = override_get_current_user

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
