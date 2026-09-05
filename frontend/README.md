# Semantic Analysis Frontend

Web client for the Semantic Comment Analysis platform. Built with React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, and Recharts.

---

## Design System

- **Typography**:
  - **Display / Headers**: `Inter Tight` (light weights 300, 330, 400) with `-0.025em` tracking.
  - **Body & Controls**: `Inter` (`#000000` ink, `#71717a` secondary shade).
  - **Code**: System monospace for JSON, tokens, latency, and vector dimensions.
- **Color System**:
  - **Canvas**: Cream background (`#fbfbf5`).
  - **Cards**: Pure white surfaces (`#ffffff`) with Level 3 soft paper shadows.
  - **Hairlines**: Light zinc borders (`#e4e4e7`).
  - **Featured CTA**: Aloe mint accent (`#c1fbd4` / `#aef5c5`).
- **Interactive Controls**:
  - All interactive buttons and selector chips use pill geometry (`rounded-pill`).

---

## Component Architecture

```text
src/
├── components/
│   ├── About/                         # Specs and architecture hub
│   │   ├── AboutView.tsx              # Consolidated 6-tab specifications hub
│   │   ├── ArchitectureDiagram.tsx    # Subsystem SVG topology inspector
│   │   ├── HowItWorks.tsx             # 4-stage execution lifecycle
│   │   ├── InteractivePipeline.tsx    # 7-stage pipeline inspector with latency metrics
│   │   ├── OcclusionSimulator.tsx     # Leave-One-Out token occlusion simulator
│   │   ├── BusinessHeuristicsMatrix.tsx # Deterministic rule matrix sandbox
│   │   ├── BenchmarkComparison.tsx    # Latency, throughput, and compute benchmarks
│   │   ├── ApiReferenceView.tsx       # REST API reference with copyable snippets
│   │   └── TechStackGrid.tsx          # Subsystem component catalog
│   ├── OverviewView.tsx               # Editorial Split Hero with live telemetry and sandbox
│   ├── SingleAnalysisView.tsx         # Real-time comment analysis and token heatmap
│   ├── BatchProcessingView.tsx        # Chunked CSV batch upload and live stream table
│   ├── Navbar.tsx                     # Floating capsule navigation with search shortcut
│   ├── Footer.tsx                     # Unified footer with site links and license
│   ├── PageHeader.tsx                 # Standardized view header
│   └── Button.tsx                     # Pill button component
├── router.ts                          # Client hash-based view router
├── index.css                          # Universal design tokens and utility layers
├── App.tsx                            # Root application shell
└── main.tsx                           # Application entry point
```

---

## Development & Build

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
Starts local Vite server on port 3000. Proxies `/semantic/*` and `/api/*` endpoints to the backend on `http://127.0.0.1:8000`.

### 3. Production Build
```bash
npm run build
```
Type-checks with `tsc` and compiles static assets into `dist/` with relative asset links (`base: "./"`).

### 4. GitHub Pages Deployment
Assets build automatically via GitHub Actions on pushes to `main` using `.github/workflows/deploy.yml`. Because routing uses hash-based URLs (`#/overview`, `#/single`, `#/batch`, `#/architecture`), pages reload without requiring server-side fallback rules.
