import React from "react";
import { motion } from "framer-motion";
import { Zap, Cpu, ShieldCheck, Database, FileText } from "lucide-react";

interface HeroSectionProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ activeTab, onTabChange }) => {
  return (
    <section className="mb-16 mt-6 text-center max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono font-semibold tracking-wider text-ink uppercase bg-surface-card border border-hairline rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Operational
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-mono tracking-wider text-muted uppercase bg-canvas-soft border border-hairline rounded-full">
            <Zap size={12} className="text-amber-600" />
            Sub-4ms Inference
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-mono tracking-wider text-muted uppercase bg-canvas-soft border border-hairline rounded-full">
            <Cpu size={12} />
            MiniLM-L6 (384d)
          </span>
        </div>

        <h1 className="text-5xl md:text-[60px] leading-[1.08] font-serif font-light tracking-[-1.5px] text-ink mb-6">
          Architecture & Technical <br className="hidden sm:inline" /> Specifications
        </h1>

        <p className="text-[17px] md:text-[19px] text-body leading-relaxed max-w-2xl mx-auto font-sans font-medium mb-8">
          An explainable NLP pipeline combining a fast logistic classification head over <code className="text-ink font-mono text-[14px] bg-surface-strong px-2 py-0.5 rounded border border-hairline">all-MiniLM-L6-v2</code> embeddings, token-level occlusion attribution, and deterministic business routing.
        </p>

        {/* Quick section navigation pills */}
        {onTabChange && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: "overview", label: "Architecture Overview" },
              { id: "pipeline", label: "Inference Pipeline" },
              { id: "occlusion", label: "Occlusion XAI" },
              { id: "heuristics", label: "Business Heuristics" },
              { id: "benchmarks", label: "Benchmarks" },
              { id: "api", label: "REST API Docs" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-sans font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-ink text-white shadow-sm"
                    : "bg-surface-card border border-hairline text-body hover:border-hairline-strong hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};
