# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a CS308 course project for an online fashion store with a React + Vite frontend and FastAPI backend following Domain-Driven Design (DDD) principles.

## Development Commands

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev       # Start dev server on http://localhost:5173
npm run build     # Production build
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env

# Start dev server on http://localhost:8000
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API documentation is auto-generated at `http://localhost:8000/api/v1/docs`

## Architecture

### Frontend Structure

```
frontend/src/
├── pages/              # Page components organized by route
│   ├── store/          # Product listing with filtering/sorting
│   ├── cart/           # Shopping cart with checkout UI
│   ├── not-found/      # 404 error page
│   └── home/           # Landing page (minimal)
├── ui/components/      # Shared components (Header, Footer)
├── store/              # Redux Toolkit state management
│   └── slices/         # Redux slices (currently: cartSlice.js)
├── api/                # API integration layer (ready for backend calls)
└── App.jsx             # Router setup with React Router v7
```

Each page follows a pattern: `pages/{route}/index.jsx` with `pages/{route}/components/` for page-specific components.

### Backend Structure (Domain-Driven Design)

```
backend/app/
├── api/endpoints/      # HTTP layer (route handlers)
├── domains/            # Business logic organized by domain
│   ├── catalog/        # Product domain (entity, repository, use_cases, schemas)
│   └── identity/       # Auth domain (future implementation)
├── infrastructure/     # Technical implementations (database, external services)
│   └── database/       # DB session, models, repositories
├── core/               # Cross-cutting (config, middleware)
└── main.py             # FastAPI app factory
```

**DDD Pattern**: Each domain contains:

- `entity.py` - Domain entities (business objects)
- `repository.py` - Data access abstractions
- `schemas.py` - Pydantic schemas for API validation
- `use_cases.py` - Business logic / application services

### State Management (Redux Toolkit)

Cart state is managed via `frontend/src/store/slices/cartSlice.js`:

**Actions**: `addToCart`, `removeFromCart`, `increaseQuantity`, `decreaseQuantity`, `updateQuantity`, `clearCart`

**State shape**:

```javascript
{
  cart: {
    items: [{ id, name, price, quantity, totalPrice, image, model, stock, category }],
    totalQuantity: number,
    totalAmount: number
  }
}
```

Components use `useSelector()` to read state and `useDispatch()` to trigger actions.

## Design System

### Color Palette (Tailwind Custom Theme)

Defined in `frontend/src/index.css`:

- **Neutrals**: `sand` (#B6AE9F), `sage` (#C5C7BC), `linen` (#DEDED1), `cream` (#FBF3D1)
- **Status**: `success`, `warning`, `error` (with light/dark variants)

### Design Principles

- **Modern minimalist** aesthetic with spacious layouts
- **Rounded corners** everywhere (xl, 2xl, 3xl border-radius)
- **Glass morphism** using backdrop-blur with transparency
- **Smooth animations** (300ms transitions, scale/transform on hover)
- **Shadow hierarchy** for depth (sm → lg → xl → 2xl)
- **Gradient backgrounds** with `bg-linear-to-*` for visual interest
- **Mobile-first responsive** design

### Component Patterns

1. **Cards**: White background, rounded-3xl, hover shadow effects, transform on hover
2. **Buttons**: Rounded-xl, active scale-95, gradient backgrounds for primary actions
3. **Inputs**: Rounded-2xl, border-2 with focus states, shadow on hover
4. **Icons**: Scale animations on hover, 300ms transitions
5. **Badges**: Rounded-full with pulsing animations for notifications

## Key Features

### Shopping Cart Implementation

- Add to cart from product cards (validates stock)
- Quantity controls with stock limits
- Real-time price calculations (subtotal, tax 8%, shipping)
- Free shipping over $100
- Empty state with CTA to store
- Checkout button (placeholder for payment integration)

### Product Filtering/Sorting

Filter component (`pages/store/components/Filter.jsx`) provides:

- **Search**: Real-time by name/description with clear button
- **Categories**: 11 categories (T-Shirts, Jeans, Hoodies, etc.) with pill UI
- **Sort**: Name, Price (low/high), Popularity

### Routing Structure

- `/` - Home page
- `/store` - Product listing with filters
- `/cart` - Shopping cart
- `*` - 404 Not Found page

All routes wrapped in Redux Provider with persistent Header/Footer.

## Tech Stack Details

**Frontend**:

- React 19.1.1 (latest with auto context)
- Vite 7.1.7 (ES modules, fast HMR)
- React Router DOM 7.9.4 (new data router API ready)
- Redux Toolkit 2.9.2 (Immer integration)
- Tailwind CSS 4.1.16 (new @theme syntax)

**Backend**:

- FastAPI 0.120.0 (async Python)
- Pydantic 2.12.3 (validation)
- Uvicorn (ASGI server)
- CORS configured for `http://localhost:5173`

## Development Notes

### Mock Data

12 sample clothing products in `frontend/src/pages/store/data/mock.js` with:

- Images from Unsplash
- Price range $29.99 - $199.99
- Stock levels and ratings
- Model numbers and warranty info

### ESLint Configuration

Uses ESLint v9 flat config format. React PropTypes checking is disabled (using TypeScript types or Pydantic for validation).

### Current Implementation Status

**Completed**:

- Frontend UI with all pages
- Redux cart functionality
- Responsive design with mobile menu
- Product browsing and filtering
- Shopping cart with checkout UI

**TODO** (Backend integration needed):

- API endpoints implementation (files exist but empty)
- Database models and migrations
- Authentication/identity domain
- Real product data from backend
- Payment gateway integration
- Order management

### When Adding New Features

1. **New pages**: Create in `pages/{route}/` with `index.jsx` + `components/` folder
2. **Shared components**: Add to `ui/components/`
3. **New state**: Create slice in `store/slices/`
4. **Backend endpoints**: Add to `api/endpoints/` following existing pattern
5. **Business logic**: Add to appropriate domain in `domains/`
6. **Match design system**: Use custom colors, rounded corners, smooth animations

### API Integration Pattern

When connecting frontend to backend:

1. Create API client in `frontend/src/api/index.js`
2. Use async thunks in Redux slices for data fetching
3. Backend expects/returns Pydantic schemas defined in domain `schemas.py`
4. CORS already configured between ports 5173 ↔ 8000
