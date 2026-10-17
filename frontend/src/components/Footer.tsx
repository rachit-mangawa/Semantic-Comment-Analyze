import React from "react";
import { ArrowUp, ExternalLink } from "lucide-react";
import { RouteView } from "@/router";
import { API_BASE } from "@/config";

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

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-white text-ink border-t border-hairline-light mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col gap-6">
        {/* Row 1: Brand & Subtitle + Primary Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-pill bg-black text-white flex items-center justify-center font-display text-[13px] font-bold select-none shadow-xs shrink-0">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-display text-[16px] font-[400] text-ink tracking-tight leading-snug">
                Semantic Comment Analysis
              </span>
              <span className="text-[12px] font-sans text-shade-50">
                Explainable NLP &amp; Deterministic Triage Intelligence
              </span>
            </div>
          </div>

          {/* Core Navigation Links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-sans text-shade-60">
            <button
              onClick={() => onNavigate("architecture", "overview")}
              className="hover:text-black transition-colors"
            >
              Blueprint
            </button>
            <button
              onClick={() => onNavigate("architecture", "pipeline")}
              className="hover:text-black transition-colors"
            >
              Pipeline
            </button>
            <button
              onClick={() => onNavigate("architecture", "occlusion")}
              className="hover:text-black transition-colors"
            >
              Occlusion XAI
            </button>
            <button
              onClick={() => onNavigate("architecture", "api")}
              className="hover:text-black transition-colors"
            >
              REST API
            </button>
            {import.meta.env.DEV && (
              <a
                href={`${API_BASE}/docs`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-colors inline-flex items-center gap-1"
              >
                <span>Swagger</span>
                <ExternalLink size={11} className="text-shade-40" />
              </a>
            )}
            <a
              href="https://github.com/rachit-mangawa/Semantic-Comment-Analyze"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors inline-flex items-center gap-1.5"
            >
              <GithubIcon size={14} className="text-shade-50" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Row 2: Secondary Metadata, License & Back to Top */}
        <div className="pt-5 border-t border-hairline-light flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[12px] font-sans text-shade-50">
          <div className="flex flex-wrap items-center gap-2">
            <span>Open-source software licensed under MIT</span>
            <span className="text-shade-30 hidden xs:inline">•</span>
            <span className="hidden xs:inline">Standard CPU execution with air-gapped data privacy</span>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            <a
              href="https://github.com/rachit-mangawa/Semantic-Comment-Analyze"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink transition-colors font-mono text-[11px]"
            >
              rachit-mangawa/Semantic-Comment-Analyze
            </a>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[12px] font-sans text-shade-60 hover:text-ink bg-canvas-cream hover:bg-white border border-hairline-light transition-all active:scale-95 select-none shadow-xs"
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
