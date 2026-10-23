# Semantic Analysis Frontend

Vite + React SPA for the Semantic Comment Analyzer.

## Development

```bash
# Install dependencies
npm install

# Start development server with proxy to FastAPI (port 8000)
npm run dev
```

The dev server will run on `http://localhost:3000` and automatically proxy `/api` requests to `http://127.0.0.1:8000`.

## Production Build

```bash
npm run build
```

Compiles the production static bundle into `dist/`. FastAPI automatically mounts and serves `frontend/dist` on port 8000.
