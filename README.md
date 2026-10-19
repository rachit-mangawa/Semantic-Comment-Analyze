# Semantic comment analysis platform

A fast, explainable NLP pipeline for customer feedback, support tickets, and open-ended text.

[![Python Version](https://img.shields.io/badge/Python-3.13%2B-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat)](LICENSE)

[Architecture](docs/ARCHITECTURE.md) • [Design System](docs/DESIGN.md) • [API Reference](docs/API_REFERENCE.md) • [Quickstart](#quickstart) • [Live Demo](https://rachit-mangawa.github.io/Semantic-Comment-Analyze/)

## Overview

Customer feedback triage often relies on generative language models. That introduces three problems: high latency (800ms to 2.5s per request), compounding token costs, and opaque predictions.

This platform uses a focused CPU pipeline:

1. Dense vector space: Maps text into a 384-dimensional semantic space with `sentence-transformers/all-MiniLM-L6-v2`.
2. Linear classifier head: Classifies intent (Bug Report, Feature Request, Complaint, Praise, Question) via an L2-regularized logistic head.
3. Leave-one-out explainability: Masks each token to measure confidence drops, producing exact word-level attribution without surrogate approximations.
4. Deterministic business rules: Maps intent and sentiment into operational decisions (urgency, tone, recommended action) via transparent matrix lookups.
5. Streaming batch processor: Streams CSV feedback files in 32-sample micro-batches with steady memory usage (~45 MB RAM).

## Documentation

Full architectural decisions, designs, and API contracts are located in the `docs/` folder:

- [System Architecture](docs/ARCHITECTURE.md): Subsystems, mathematical formulations, and engineering tradeoffs.
- [Design System](docs/DESIGN.md): Visual design specifications, color tokens, typography scales, and component guidelines.
- [API Reference](docs/API_REFERENCE.md): Detailed HTTP request and response schemas with cURL, Python, and TypeScript examples.

## Benchmarks

Measurements recorded on a standard 8-core CPU:

| Metric | Cloud LLMs (GPT-4, Claude) | Local zero-shot (BART-Large) | This platform (MiniLM + Logistic head) |
| :--- | :--- | :--- | :--- |
| Single inference latency | 800ms to 2,500ms | 120ms to 350ms | 10ms to 25ms |
| CPU throughput | ~2 req/s | ~8 req/s | 250+ req/s |
| Cost per 1M texts | $15 to $60 | Dedicated GPU compute | $0.00 (local CPU) |
| Explainability | Generative text | Surrogate approximation | Exact token occlusion delta |
| Offline capability | No (requires internet) | Yes | Yes (100% offline once cached) |
| Batch memory | Cloud API dependent | High GPU VRAM | Constant ~45 MB RAM |

## Quickstart

### Option 1: Local offline execution (Windows)

To run the complete platform locally and offline:

```cmd
run.bat
```

The script performs the following actions:
1. Checks and installs npm dependencies if missing.
2. Detects if the backend is already running on port 8000 (avoiding port conflicts). If not running, it launches `backend/dev.py`.
3. Opens your browser to `http://localhost:3000`.
4. Starts the Vite dev server with hot reload (dev mode connects directly to `http://127.0.0.1:8000`).

### Option 2: Manual setup

#### 1. Backend

```bash
# Clone the repository
git clone https://github.com/rachit-mangawa/Semantic-Comment-Analyze.git
cd Semantic-Comment-Analyze

# With uv (recommended)
uv sync
uv run python backend/dev.py

# Or with standard pip
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python backend/dev.py
```

The backend starts at `http://127.0.0.1:8000` with routes mounted under `/semantic`.

#### 2. Frontend

```bash
cd frontend
npm install

# Run the local development server (port 3000)
npm run dev

# Or build the static production bundle
npm run build
```

### Option 3: Online web deployment

- Frontend: Hosted statically on GitHub Pages at [https://rachit-mangawa.github.io/Semantic-Comment-Analyze/](https://rachit-mangawa.github.io/Semantic-Comment-Analyze/).
- Backend: Hosted on Hugging Face Spaces at `https://idkhowtocodefr-hf-backend.hf.space`.

## API summary

### 1. Analyze comment (`POST /semantic/analyze`)

```bash
curl -X POST "http://127.0.0.1:8000/semantic/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The app freezes completely whenever I click export on large PDF tables.",
    "threshold": 0.5,
    "include_explanation": true
  }'
```

### 2. Stream batch CSV (`POST /semantic/batch`)

```bash
curl -X POST "http://127.0.0.1:8000/semantic/batch" \
  -F "file=@customer_tickets.csv" \
  -F "targetColumn=feedback" \
  -F "threshold=0.5" \
  --output results.csv
```

### 3. Service health check (`GET /semantic/health`)

```bash
curl -X GET "http://127.0.0.1:8000/semantic/health"
```

## Running tests

Run the test suite using pytest:

```bash
uv run pytest
```

This verifies API routes, streaming CSV output, business heuristics, and token occlusion calculations.

## License

MIT. See [LICENSE](LICENSE) for details.
