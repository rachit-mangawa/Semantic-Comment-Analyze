# Semantic Analysis Frontend Client

Single-page analytical interface built with React 18, Vite, Tailwind CSS, Lucide Icons, Framer Motion, and Recharts.

---

## Design System

- **Typography**:
  - **Headings**: *EB Garamond* serif font.
  - **Data & Controls**: *Inter* sans-serif font.
  - **Code**: System monospace font for JSON payloads, parameters, and tokens.
- **Color System**:
  - **Background**: Soft Canvas (`#f5f5f5` / `#fafafa`) with white card surfaces (`#ffffff`).
  - **Typography**: Deep Ink (`#0c0a09`) with muted body (`#4e4e4e`) and secondary labels (`#777169`).
  - **Borders**: Hairlines (`#e7e5e4`).
  - **Intent Accents**:
    - Bug Report: `#ef4444` (Red)
    - Complaint: `#f97316` (Orange)
    - Feature Request: `#8b5cf6` (Purple)
    - Praise: `#22c55e` (Green)
    - Question: `#3b82f6` (Blue)

---

## Component Architecture

```text
src/
├── components/
│   ├── About/                      # Architecture & documentation views
│   │   ├── AboutView.tsx           # Tabbed navigation hub
│   │   ├── ArchitectureDiagram.tsx # SVG flow diagram inspector
│   │   ├── HeroSection.tsx         # Overview header
│   │   ├── HowItWorks.tsx          # Execution lifecycle steps
│   │   ├── InteractivePipeline.tsx # Step-by-step pipeline inspector
│   │   ├── OcclusionSimulator.tsx  # Token masking simulator
│   │   ├── BusinessHeuristicsMatrix.tsx # Rule matrix explorer
│   │   ├── BenchmarkComparison.tsx # Latency & cost benchmarks
│   │   ├── ApiReferenceView.tsx    # In-app REST API docs
│   │   └── TechStackGrid.tsx       # Subsystem components & repo tree
│   ├── SingleAnalysisView.tsx      # Single text analysis with heatmap & radar chart
│   ├── BatchProcessingView.tsx     # Streaming CSV uploader & table preview
│   ├── Navbar.tsx                  # Top navigation bar with active view tracking
│   ├── FeatureCard.tsx             # Card container component
│   └── Button.tsx                  # Standardized button
├── index.css                       # Tailwind layers and font definitions
├── App.tsx                         # View router & layout
└── main.tsx                        # DOM mount
```

---

## Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Vite Dev Server
```bash
npm run dev
```
Starts local dev server at `http://localhost:3000`. Vite automatically proxies `/semantic/*`, `/sementic/*`, and `/api/*` requests to `http://127.0.0.1:8000`.

### 3. Build for Production
```bash
npm run build
```
Compiles the production static bundle into `dist/`. FastAPI serves `dist/` directly from `/`.
