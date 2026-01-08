# Online Store Frontend (React + Vite)

React/Vite UI for the CS308 online fashion store. Uses Redux Toolkit for state, Tailwind for styles, and Vitest + Testing Library for unit tests.

## Quick Start

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

## Scripts

- `npm run dev` – start Vite dev server with HMR
- `npm run build` – production build
- `npm run preview` – serve the production build locally
- `npm run lint` – ESLint (flat config)
- `npm run test` – Vitest unit tests (`-- --run` for single pass, `-- --coverage` for coverage)

## Testing Notes

- Tests live under `src/store/slices` and `src/pages/**/components`.
- Vitest runs in a JSDOM environment; no extra setup required.
- Use `npm run test -- path/to/file.test.*` to run a specific file.

## API Integration

The frontend is ready to point at the FastAPI backend on `http://localhost:8000`. When adding data fetching, use the `src/api` layer and Redux thunks for consistency with existing slices.
