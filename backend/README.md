# Backend API

FastAPI backend for the online store.

## Project Structure

```
app/
    api/            # HTTP routes and endpoints
    core/           # Config, security, exceptions
```

## Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your values (SECRET_KEY, DATABASE_URL)

```

## Run

```bash
uvicorn app.main:app --reload
```

**Docs**: http://localhost:8000/api/v1/docs

## Architecture

**Request Flow**: Endpoint � Service � Repository � Database

- **Endpoints**: Validate input, call services
- **Services**: Business logic, orchestration
- **Repositories**: Database operations
- **Models**: Database schema
- **Schemas**: API contracts

## Environment Variables

See `.env.example` for required variables.
