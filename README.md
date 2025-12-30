# CS308 Online Store – Backend

FastAPI + SQLite service for the fashion storefront. The backend follows Domain-Driven Design (DDD), seeds demo data automatically, and exposes REST + WebSocket endpoints under `/api/v1`.

## Quick start

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # customize secrets before running
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API docs: http://localhost:8000/api/v1/docs (Swagger)
- Health check: `GET /health`
- Convenience script to launch frontend + backend together: `./backend/run_local.sh`

## Project layout

- `backend/app/main.py` – App factory, CORS, table creation, DB seeding
- `backend/app/api/endpoints/` – Routers for `auth`, `products`, `categories`, `orders`, `reviews`, `support` (WebSocket at `/api/v1/support/ws`)
- `backend/app/domains/` – DDD layers per domain (`catalog`, `category`, `order`, `review`, `support`, `identity`)
- `backend/app/infrastructure/` – SQLite models/session/seeder, PDF invoice generator, SMTP email sender, local storage for support attachments
- `backend/app/core/` – Settings, JWT/password utilities, structured logging
- `backend/tests/` – Pytest suite using its own SQLite DB (`tests/test_database.db`)

## Configuration (.env)

- `SECRET_KEY`, `JWT_ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `REFRESH_TOKEN_EXPIRE_DAYS`
- `SQLITE_DATABASE_URL` (default `sqlite:///./database.db`)
- Cookie settings: `COOKIE_DOMAIN`, `COOKIE_SECURE`, `COOKIE_SAMESITE`, `COOKIE_PATH`
- SMTP (optional for invoice email): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_STARTTLS`, `EMAIL_FROM`
- Support chat/attachments: `SUPPORT_ATTACHMENT_DIR`, `SUPPORT_ATTACHMENT_MAX_MB`, `SUPPORT_ALLOWED_MIME_PREFIXES`, `SUPPORT_HISTORY_LIMIT`, `SUPPORT_QUEUE_LIMIT`

## Security & Data Encryption

Sensitive data is encrypted at rest in the database using industry-standard cryptography:

**Encrypted Fields:**
- **User passwords**: Hashed with bcrypt (irreversible, one-way)
- **User home addresses**: Encrypted with Fernet (AES-128 symmetric encryption)
- **Order delivery addresses**: Encrypted with Fernet (AES-128 symmetric encryption)
- **Guest email addresses** (in support conversations): Encrypted with Fernet (AES-128 symmetric encryption)

**Implementation:**
- Encryption/decryption handled automatically in repository layer (`backend/app/domains/*/repository.py`)
- Encryption key derived from `SECRET_KEY` in `.env`
- Data encrypted before database write, decrypted after database read
- Encryption utilities: `backend/app/core/crypto.py` (Fernet) and `backend/app/core/security.py` (bcrypt)

**Authentication:**
- User emails remain unencrypted (required for login lookups)
- JWTs issued as HTTP-only cookies to prevent XSS attacks
- Role-based access control (RBAC) enforces permissions

## Concurrency Safety

The application handles multiple concurrent users safely through:

**Database Row Locking:**
- **Stock management**: Uses pessimistic locking (`with_for_update()`) during order creation to prevent overselling
- **Critical path**: Product stock locked from check to decrement (backend/app/domains/catalog/repository.py:26)
- **Flow**: Lock acquired → stock validated → order created → stock decreased → lock released

**Database Constraints:**
- **Review uniqueness**: Database-level unique constraint prevents duplicate reviews (user_id + product_id)
- **Foreign key enforcement**: Cascade deletes maintain referential integrity

**Transaction Management:**
- Each database session auto-commits or rolls back as a single atomic unit
- Failed operations don't leave partial state (e.g., stock decreased but order creation failed)

**Tested Scenarios:**
- ✅ Multiple users ordering last items simultaneously
- ✅ Concurrent order cancellations and refunds (stock restoration)
- ✅ Simultaneous review creation for same product by same user
- ✅ Concurrent discount applications by multiple managers

## Data and seed users

- On startup tables are created and seed data is added if the DB is empty (`backend/database.db`).
- Seeded accounts: `manager@example.com` (product manager), `sales@example.com` (sales manager) with password `12345678`. A support agent (`support@example.com` / `12345678`) is recreated automatically if missing. New registrations default to the `customer` role.
- Reset database: `rm backend/database.db` then restart the server.

## API overview & rules

- **Auth** (`/api/v1/auth`): register, login, refresh, logout, and `GET /me`. JWTs are issued as HTTP-only cookies. Roles: `customer`, `product_manager`, `sales_manager`, `support_agent`.
- **Catalog** (`/api/v1/products`): list/get products, update fields, delete, apply or clear percentage discounts via `/discount` endpoints.
- **Categories** (`/api/v1/categories`): CRUD with name uniqueness; deleting fails if products still reference the category.
- **Orders** (`/api/v1/orders`): customers create orders (8% tax, $10 shipping under $100). Product managers can update status; customers can cancel while `processing`; refunds follow `request` → manager `approve/reject`. All orders can be listed by managers, while customers only see their own. Invoice PDFs are emailed in a background task when SMTP is configured.
- **Reviews** (`/api/v1/products/{id}/reviews`): customers can review products they purchased in a delivered order (one review per product). Ratings-only are auto-approved; comments need product manager approval. Pending queue and approval/rejection endpoints live under `/api/v1/reviews`.
- **Support** (`/api/v1/support`): authenticated or guest users can start conversations, exchange messages, and upload attachments (size/type validated, stored in `storage/support_attachments`). Agents claim/close conversations and view a live queue. Real-time chat uses WebSocket at `/api/v1/support/ws`.

## Testing

```bash
cd backend
source venv/bin/activate
pytest
```

The test suite boots a fresh SQLite database (`tests/test_database.db`) and seeds it automatically; no manual cleanup is needed between runs.
