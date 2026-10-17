# Semantic analysis frontend

Web client for the Semantic Comment Analysis platform. Built with React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, and Recharts.

## Design system

- Typography:
  - Display and headers: Inter Tight at light weights (300, 330, 400).
  - Body and controls: Inter (`#000000` ink, `#71717a` secondary shade).
  - Monospace: System monospace for JSON, tokens, latency, and vector dimensions.
- Color system:
  - Canvas: Cream background (`#fbfbf5`).
  - Cards: White surfaces (`#ffffff`) with Level 3 soft paper shadows.
  - Hairlines: Light zinc borders (`#e4e4e7`).
  - Featured accent: Aloe mint (`#c1fbd4`).
- Interactive controls:
  - Interactive buttons and selector chips use pill geometry (`rounded-pill`).

## Component architecture

```text
src/
├── components/
│   ├── About/                         # Specifications and architecture hub
│   │   ├── AboutView.tsx              # Consolidated 6-tab specifications hub
│   │   ├── ArchitectureDiagram.tsx    # Subsystem SVG topology inspector
│   │   ├── HowItWorks.tsx             # 4-stage execution overview
│   │   ├── InteractivePipeline.tsx    # Pipeline stages and latency inspector
│   │   ├── OcclusionSimulator.tsx     # Token occlusion attribution sandbox
│   │   ├── BusinessHeuristicsMatrix.tsx # Tone and urgency decision matrix
│   │   ├── BenchmarkComparison.tsx    # Latency, throughput, and hardware benchmarks
│   │   ├── ApiReferenceView.tsx       # REST API reference with copyable code snippets
│   │   └── TechStackGrid.tsx          # Subsystem component catalog
│   ├── OverviewView.tsx               # Product overview and live interactive demo
│   ├── SingleAnalysisView.tsx         # Real-time comment analysis with word heatmap
│   ├── BatchProcessingView.tsx        # Chunked CSV batch upload with live progress table
│   ├── Navbar.tsx                     # Top navigation capsule
│   ├── Footer.tsx                     # Page footer with documentation links
│   ├── PageHeader.tsx                 # View header
│   └── Button.tsx                     # Reusable pill button
├── config.ts                          # API_BASE environment configuration
├── router.ts                          # Client hash-based navigation router
├── index.css                          # Design tokens and base styling
├── App.tsx                            # Root application shell
└── main.tsx                           # Application entry point
```

## Development and build

### 1. Install dependencies

```bash
npm install
```

### 2. Start dev server

```bash
npm run dev
```

Starts the local Vite dev server on port 3000. It proxies `/semantic/*` calls to the local backend on `http://127.0.0.1:8000`.

### 3. Production build

```bash
npm run build
```

Type-checks with `tsc` and compiles static assets into `dist/` with relative asset links (`base: "./"`).

### 4. GitHub Pages deployment

Assets build automatically via GitHub Actions on pushes to `main` using `.github/workflows/deploy.yml`. Because routing uses hash-based URLs (`#/overview`, `#/analyze`, `#/batch`, `#/architecture`), pages reload without requiring server-side fallback rules.
