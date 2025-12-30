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

## Email/SMTP Configuration

The backend can email PDF invoices after a successful order creation. If SMTP is not configured, invoice sending is skipped with a warning in logs.

Environment variables:

- `SMTP_HOST` – SMTP server hostname (e.g., `smtp.gmail.com`). If empty, emails are skipped.
- `SMTP_PORT` – Port number. Use `587` for STARTTLS, or `465` for SSL.
- `SMTP_USERNAME` – SMTP account/username (often your full email address).
- `SMTP_PASSWORD` – SMTP password. For Gmail, use a 16‑character App Password (not your normal password).
- `SMTP_STARTTLS` – `true` to use STARTTLS (port 587). Set `false` for SSL (port 465).
- `EMAIL_FROM` – From header shown to recipients. Use your sender or a verified alias, e.g., `Fashion Store <yourname@gmail.com>`.

Sample `.env` (Gmail with STARTTLS on 587):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=yourname@gmail.com
SMTP_PASSWORD=<your-16-char-app-password>
SMTP_STARTTLS=true
EMAIL_FROM=Fashion Store <yourname@gmail.com>
```

Sample `.env` (Gmail with SSL on 465):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USERNAME=yourname@gmail.com
SMTP_PASSWORD=<your-16-char-app-password>
SMTP_STARTTLS=false
EMAIL_FROM=Fashion Store <yourname@gmail.com>
```

Gmail setup (recommended for development/low volume):

- Enable 2‑Step Verification on the Gmail account.
- Create an App Password: Google Account → Security → App passwords → select “Mail” → Generate.
- Use the generated 16‑character App Password as `SMTP_PASSWORD`.
- Keep `EMAIL_FROM` matching your Gmail (or a verified “Send mail as” alias) to avoid rewrites.

Production alternatives:

- Google Workspace with your domain (`no-reply@yourdomain.com`) and proper SPF/DKIM/DMARC.
- Transactional providers (SendGrid, Mailgun, Amazon SES, Postmark) for higher deliverability, logs, and quotas.

How it works:

- On successful order creation, a background task generates a PDF invoice (ReportLab) and sends it via SMTP to the user’s email.
- If `SMTP_HOST` is unset, the system logs a warning and skips sending.

Relevant files:

- PDF generator: `backend/app/infrastructure/pdf/invoice.py`
- Email service: `backend/app/infrastructure/notifications/email_service.py`
- Orchestrator: `backend/app/infrastructure/notifications/invoice_email.py`
- Orders endpoint: `backend/app/api/endpoints/orders.py`

### Troubleshooting

- Auth errors (e.g., 535/534): Use an App Password (Gmail) and correct port/TLS settings.
- From address rewritten: Make `EMAIL_FROM` match your SMTP user or a verified alias.
- TLS/SSL issues: Ensure `SMTP_STARTTLS` matches your port (`587` → `true`, `465` → `false`).
- Deliverability: For production, use a domain sender with SPF/DKIM/DMARC or a transactional provider.
- Attachments flagged: Keep PDFs small and simple; avoid suspicious content.

### Security Notes

- Do not commit `.env` to version control.
- Rotate credentials periodically and prefer provider‑specific App Passwords.
- Consider a secrets manager for production (e.g., environment variables in your deployment platform).

## Data Security & Encryption

All sensitive data is encrypted at rest in the database:

**Encrypted Fields:**
- **User passwords**: Bcrypt hashing (irreversible)
- **User home addresses**: Fernet encryption (AES-128)
- **Order delivery addresses**: Fernet encryption (AES-128)
- **Guest emails** (support): Fernet encryption (AES-128)

**How It Works:**
- Encryption key is derived from `SECRET_KEY` environment variable
- Repository layer automatically encrypts on save, decrypts on read
- User emails remain unencrypted for authentication lookups
- Implementation files: `app/core/crypto.py` and `app/core/security.py`
