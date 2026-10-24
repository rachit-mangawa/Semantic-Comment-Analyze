import React from "react";
import {
  ExternalLink,
  BookOpen,
  Code2,
  Layers,
  Cpu,
  Activity,
  Workflow,
  ShieldCheck,
  Zap,
  Database,
  Sparkles,
  FileText,
  Terminal,
  ArrowUp
} from "lucide-react";
import { RouteView } from "@/router";

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface FooterProps {
  activeView: RouteView;
  activeSubTab?: string;
  onNavigate: (view: RouteView, subTab?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ activeView, activeSubTab, onNavigate }) => {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full border-t border-hairline/80 bg-surface-card/90 backdrop-blur-xl mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Main 4-Column Balanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-hairline">
          
          {/* Column 1: Brand & Philosophy (Span 5 on large screens) */}
          <div className="lg:col-span-5 max-w-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3.5">
                <div className="w-8 h-8 rounded-xl bg-ink text-canvas flex items-center justify-center font-serif text-[15px] font-bold select-none shadow-xs ring-1 ring-ink/10">
                  S
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-[19px] font-medium tracking-tight text-ink leading-tight">
                    Semantic Analysis
                  </span>
                  <span className="text-[11px] font-mono text-muted tracking-wide">
                    Explainable NLP Intelligence Platform
                  </span>
                </div>
              </div>

              <p className="text-[14px] font-sans text-body leading-relaxed text-pretty mb-5">
                Deterministic intent classification, Leave-One-Out token occlusion explainability, and Twitter-RoBERTa sentiment analysis engineered to run on standard CPU without cloud LLM dependencies.
              </p>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-2 text-[12px] font-mono text-muted">
                <span className="inline-flex items-center gap-2 bg-canvas-soft border border-hairline px-2.5 py-1 rounded-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>CPU In-Memory Pipeline</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-canvas-soft border border-hairline px-2.5 py-1 rounded-md">
                  <span>384d Dense Vectorizer</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-canvas-soft border border-hairline px-2.5 py-1 rounded-md">
                  <span>Zero Cloud Token Cost</span>
                </span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-hairline/60 text-[12px] font-mono text-muted flex items-center gap-2">
              <span>FastAPI 0.115</span>
              <span>•</span>
              <span>SentenceTransformers</span>
              <span>•</span>
              <span>React 18</span>
            </div>
          </div>

          {/* Column 2: Workspace Navigation (Span 2 on large screens) */}
          <div className="lg:col-span-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-muted block mb-4 select-none">
              Workspace
            </span>
            <ul className="space-y-1.5 text-[13px] font-sans">
              <li>
                <a
                  href="#/overview"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("overview");
                  }}
                  className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 ease-out select-none ${
                    activeView === "overview"
                      ? "bg-canvas-soft text-ink font-medium border border-hairline"
                      : "text-body hover:text-ink hover:bg-canvas-soft/60"
                  }`}
                >
                  <Sparkles size={14} strokeWidth={1.75} className={`shrink-0 transition-colors ${activeView === "overview" ? "text-ink" : "text-muted group-hover:text-ink"}`} />
                  <span>Overview</span>
                </a>
              </li>
              <li>
                <a
                  href="#/methodology"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("methodology");
                  }}
                  className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 ease-out select-none ${
                    activeView === "methodology"
                      ? "bg-canvas-soft text-ink font-medium border border-hairline"
                      : "text-body hover:text-ink hover:bg-canvas-soft/60"
                  }`}
                >
                  <BookOpen size={14} strokeWidth={1.75} className={`shrink-0 transition-colors ${activeView === "methodology" ? "text-ink" : "text-muted group-hover:text-ink"}`} />
                  <span>Methodology</span>
                </a>
              </li>
              <li>
                <a
                  href="#/single"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("single");
                  }}
                  className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 ease-out select-none ${
                    activeView === "single"
                      ? "bg-canvas-soft text-ink font-medium border border-hairline"
                      : "text-body hover:text-ink hover:bg-canvas-soft/60"
                  }`}
                >
                  <Zap size={14} strokeWidth={1.75} className={`shrink-0 transition-colors ${activeView === "single" ? "text-ink" : "text-muted group-hover:text-ink"}`} />
                  <span>Single Analysis</span>
                </a>
              </li>
              <li>
                <a
                  href="#/batch"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("batch");
                  }}
                  className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 ease-out select-none ${
                    activeView === "batch"
                      ? "bg-canvas-soft text-ink font-medium border border-hairline"
                      : "text-body hover:text-ink hover:bg-canvas-soft/60"
                  }`}
                >
                  <Database size={14} strokeWidth={1.75} className={`shrink-0 transition-colors ${activeView === "batch" ? "text-ink" : "text-muted group-hover:text-ink"}`} />
                  <span>Batch Streaming</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Architecture in Pieces (Span 3 on large screens) */}
          <div className="lg:col-span-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-muted block mb-4 select-none">
              Architecture Pieces
            </span>
            <ul className="space-y-1.5 text-[13px] font-sans">
              <li>
                <a
                  href="#/architecture/overview"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("architecture", "overview");
                  }}
                  className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 ease-out select-none ${
                    activeView === "architecture" && activeSubTab === "overview"
                      ? "bg-canvas-soft text-ink font-medium border border-hairline"
                      : "text-body hover:text-ink hover:bg-canvas-soft/60"
                  }`}
                >
                  <Layers size={14} strokeWidth={1.75} className={`shrink-0 transition-colors ${activeView === "architecture" && activeSubTab === "overview" ? "text-ink" : "text-muted group-hover:text-ink"}`} />
                  <span>System Blueprint</span>
                </a>
              </li>
              <li>
                <a
                  href="#/architecture/pipeline"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("architecture", "pipeline");
                  }}
                  className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 ease-out select-none ${
                    activeView === "architecture" && activeSubTab === "pipeline"
                      ? "bg-canvas-soft text-ink font-medium border border-hairline"
                      : "text-body hover:text-ink hover:bg-canvas-soft/60"
                  }`}
                >
                  <Workflow size={14} strokeWidth={1.75} className={`shrink-0 transition-colors ${activeView === "architecture" && activeSubTab === "pipeline" ? "text-ink" : "text-muted group-hover:text-ink"}`} />
                  <span>Inference Pipeline</span>
                </a>
              </li>
              <li>
                <a
                  href="#/architecture/occlusion"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("architecture", "occlusion");
                  }}
                  className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 ease-out select-none ${
                    activeView === "architecture" && activeSubTab === "occlusion"
                      ? "bg-canvas-soft text-ink font-medium border border-hairline"
                      : "text-body hover:text-ink hover:bg-canvas-soft/60"
                  }`}
                >
                  <Cpu size={14} strokeWidth={1.75} className={`shrink-0 transition-colors ${activeView === "architecture" && activeSubTab === "occlusion" ? "text-ink" : "text-muted group-hover:text-ink"}`} />
                  <span>Occlusion XAI Math</span>
                </a>
              </li>
              <li>
                <a
                  href="#/architecture/heuristics"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("architecture", "heuristics");
                  }}
                  className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 ease-out select-none ${
                    activeView === "architecture" && activeSubTab === "heuristics"
                      ? "bg-canvas-soft text-ink font-medium border border-hairline"
                      : "text-body hover:text-ink hover:bg-canvas-soft/60"
                  }`}
                >
                  <ShieldCheck size={14} strokeWidth={1.75} className={`shrink-0 transition-colors ${activeView === "architecture" && activeSubTab === "heuristics" ? "text-ink" : "text-muted group-hover:text-ink"}`} />
                  <span>Heuristics Matrix</span>
                </a>
              </li>
              <li>
                <a
                  href="#/architecture/benchmarks"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("architecture", "benchmarks");
                  }}
                  className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 ease-out select-none ${
                    activeView === "architecture" && activeSubTab === "benchmarks"
                      ? "bg-canvas-soft text-ink font-medium border border-hairline"
                      : "text-body hover:text-ink hover:bg-canvas-soft/60"
                  }`}
                >
                  <Activity size={14} strokeWidth={1.75} className={`shrink-0 transition-colors ${activeView === "architecture" && activeSubTab === "benchmarks" ? "text-ink" : "text-muted group-hover:text-ink"}`} />
                  <span>Benchmark Comparison</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/rachit-mangawa/Semantic-Comment-Analyze/blob/main/ARCHITECTURE.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-body hover:text-ink hover:bg-canvas-soft/60 transition-all duration-150 ease-out font-mono text-[12px]"
                >
                  <span className="flex items-center gap-2">
                    <FileText size={14} strokeWidth={1.75} className="text-muted group-hover:text-ink transition-colors shrink-0" />
                    <span>ARCHITECTURE.md</span>
                  </span>
                  <ExternalLink size={11} strokeWidth={1.75} className="text-muted group-hover:text-ink transition-colors shrink-0" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: API & Developer (Span 2 on large screens) */}
          <div className="lg:col-span-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-muted block mb-4 select-none">
              API &amp; Docs
            </span>
            <ul className="space-y-1.5 text-[13px] font-sans">
              <li>
                <a
                  href="#/architecture/api"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("architecture", "api");
                  }}
                  className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 ease-out select-none ${
                    activeView === "architecture" && activeSubTab === "api"
                      ? "bg-canvas-soft text-ink font-medium border border-hairline"
                      : "text-body hover:text-ink hover:bg-canvas-soft/60"
                  }`}
                >
                  <Code2 size={14} strokeWidth={1.75} className={`shrink-0 transition-colors ${activeView === "architecture" && activeSubTab === "api" ? "text-ink" : "text-muted group-hover:text-ink"}`} />
                  <span>REST API Reference</span>
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-body hover:text-ink hover:bg-canvas-soft/60 transition-all duration-150 ease-out select-none"
                >
                  <span className="flex items-center gap-2">
                    <Terminal size={14} strokeWidth={1.75} className="text-muted group-hover:text-ink transition-colors shrink-0" />
                    <span>Swagger (/docs)</span>
                  </span>
                  <ExternalLink size={11} strokeWidth={1.75} className="text-muted group-hover:text-ink transition-colors shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/rachit-mangawa/Semantic-Comment-Analyze/blob/main/docs/API_REFERENCE.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-body hover:text-ink hover:bg-canvas-soft/60 transition-all duration-150 ease-out font-mono text-[12px]"
                >
                  <span className="flex items-center gap-2">
                    <FileText size={14} strokeWidth={1.75} className="text-muted group-hover:text-ink transition-colors shrink-0" />
                    <span>API_REFERENCE.md</span>
                  </span>
                  <ExternalLink size={11} strokeWidth={1.75} className="text-muted group-hover:text-ink transition-colors shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/rachit-mangawa/Semantic-Comment-Analyze"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-body hover:text-ink hover:bg-canvas-soft/60 transition-all duration-150 ease-out select-none"
                >
                  <span className="flex items-center gap-2">
                    <GithubIcon size={14} className="text-muted group-hover:text-ink transition-colors shrink-0" />
                    <span>GitHub Repo</span>
                  </span>
                  <ExternalLink size={11} strokeWidth={1.75} className="text-muted group-hover:text-ink transition-colors shrink-0" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright, License, Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] font-mono text-muted">
          <div className="flex flex-wrap items-center gap-2">
            <span>Semantic Comment Analysis Platform</span>
            <span>•</span>
            <span>MIT License</span>
            <span>•</span>
            <span className="text-body font-medium">Standard CPU Inference</span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="https://github.com/rachit-mangawa/Semantic-Comment-Analyze"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink transition-colors underline-offset-4 hover:underline"
            >
              rachit-mangawa/Semantic-Comment-Analyze
            </a>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-muted hover:text-ink hover:bg-canvas-soft border border-hairline transition-all active:scale-95 select-none"
              title="Scroll smoothly back to top"
            >
              <ArrowUp size={12} strokeWidth={2} />
              <span>Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
