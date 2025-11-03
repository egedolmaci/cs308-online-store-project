# Backend API

FastAPI backend with SQLite database and automatic seeding.

## Quick Start

```bash
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

**API Docs**: http://localhost:8000/docs

## Stack

- **FastAPI** 0.120.0 - Async Python web framework
- **SQLAlchemy** 2.0.44 - ORM for SQLite
- **Pydantic Settings** - Config management from `.env`
- **Loguru** - Structured logging with colors

## Structure

```
app/
├── api/endpoints/          # Route handlers
├── core/
│   ├── config.py          # Settings (reads .env)
│   └── logging.py         # Loguru config
├── domains/
│   └── catalog/           # Product domain (entities, schemas)
├── infrastructure/
│   └── database/
│       ├── sqlite/
│       │   ├── session.py      # DB connection & dependency
│       │   └── models/         # SQLAlchemy models
│       ├── seed_data.py        # Initial product data
│       └── seeder.py           # Auto-seed on startup
└── main.py                # App factory + startup events
```

## Database

**SQLite** with auto-migration and seeding:
- Tables created on startup via `Base.metadata.create_all()`
- Database seeded with 12 products if empty (from `seed_data.py`)
- File: `database.db` (gitignored)

**Reset database**: `rm database.db && uvicorn app.main:app --reload`

## Logging

Uses **Loguru** for structured logging. Import anywhere:

```python
from app.core.logging import logger

logger.info("Something happened")
logger.error("Something broke", extra_context="value")
```

## Config

Centralized in `app/core/config.py`. Override via `.env`:

```env
DATABASE_URL=sqlite:///./database.db
DEBUG=True
```

Access in code:
```python
from app.core.config import get_settings
settings = get_settings()
print(settings.DATABASE_URL)
```
