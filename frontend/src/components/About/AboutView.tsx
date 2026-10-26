import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { InteractivePipeline } from "./InteractivePipeline";
import { OcclusionSimulator } from "./OcclusionSimulator";
import { BusinessHeuristicsMatrix } from "./BusinessHeuristicsMatrix";
import { BenchmarkComparison } from "./BenchmarkComparison";
import { ApiReferenceView } from "./ApiReferenceView";
import { HowItWorks } from "./HowItWorks";
import { TechStackGrid } from "./TechStackGrid";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Workflow,
  Cpu,
  ShieldCheck,
  Activity,
  Code2,
  LucideIcon,
  CheckCircle2,
  XCircle
} from "lucide-react";

interface AboutViewProps {
  initialTab?: string;
  onTabChange?: (tab: string) => void;
}

interface TabItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
}

export const AboutView: React.FC<AboutViewProps> = ({ initialTab = "overview", onTabChange }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const tabs: TabItem[] = [
    { id: "overview", label: "Architecture Blueprint", shortLabel: "Blueprint", icon: Layers },
    { id: "pipeline", label: "Inference Pipeline", shortLabel: "Pipeline", icon: Workflow },
    { id: "occlusion", label: "Occlusion XAI", shortLabel: "Occlusion", icon: Cpu },
    { id: "heuristics", label: "Business Heuristics", shortLabel: "Heuristics", icon: ShieldCheck },
    { id: "benchmarks", label: "Benchmarks", shortLabel: "Benchmarks", icon: Activity },
    { id: "api", label: "REST API Docs", shortLabel: "API Docs", icon: Code2 },
  ];

  return (
    <div className="page-container">
      {/* Page Header */}
      <PageHeader
        eyebrow="System Specifications & Methodology Hub"
        title="Architecture & Documentation"
        description="An explainable NLP architecture pairing a high-throughput logistic head over 384d all-MiniLM-L6-v2 embeddings, Leave-One-Out token occlusion attribution, and deterministic business routing on standard CPU."
      />

      {/* Floating Sub-navigation Dock: Responsive Segmented Grid on Mobile / Capsule Pill on Desktop */}
      <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-row lg:items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-white border border-hairline-light rounded-2xl lg:rounded-pill shadow-level-3 my-1 sm:my-2 self-stretch lg:self-start">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabSelect(tab.id)}
              className={`relative flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 lg:px-4 py-2 lg:py-2 rounded-xl lg:rounded-pill text-[12px] sm:text-[13px] font-sans font-medium whitespace-nowrap transition-colors duration-150 ease-out active:scale-[0.98] select-none ${
                isActive
                  ? "text-white font-semibold"
                  : "text-shade-60 hover:text-black hover:bg-black/5"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="about-subtab-pill"
                  className="absolute inset-0 rounded-xl lg:rounded-pill bg-black shadow-sm"
                  transition={{ type: "spring", stiffness: 480, damping: 38 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                <Icon
                  size={14}
                  strokeWidth={isActive ? 2 : 1.75}
                  className={`shrink-0 ${isActive ? "text-white" : "text-shade-50"}`}
                />
                <span className="hidden xl:inline">{tab.label}</span>
                <span className="xl:hidden">{tab.shortLabel}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Non-Overlapping View Sections */}
      <AnimatePresence mode="wait">
        {/* Sub-tab 1: Architecture Blueprint (ArchitectureDiagram + Design Rationale + TechStackGrid) */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-10"
          >
            <ArchitectureDiagram />

            {/* Design Rationale: Dense Embeddings vs Generative LLMs */}
            <div className="surface-card-base">
              <div className="max-w-3xl mb-8">
                <span className="text-[12px] font-sans uppercase tracking-[0.72px] font-medium text-shade-50 block mb-2 select-none">
                  Design Rationale
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-[330] text-ink tracking-tight mb-3">
                  Why Dense Embeddings &amp; Linear Heads Outperform Generative LLMs
                </h3>
                <p className="text-[15px] font-sans text-shade-60 leading-relaxed">
                  Most modern triage architectures default to calling large cloud language models (GPT-4, Claude). While versatile, generative LLMs present critical operational limitations for enterprise support streams: unpredictable latency spikes, recurring per-token cloud costs, prompt degradation, and non-deterministic routing output.
                </p>
              </div>

              {/* Side-by-Side Comparison Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-hairline-light">
                {/* Column 1: Generative LLM Pitfalls */}
                <div className="bg-canvas-cream border border-hairline-light rounded-lg p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3.5 text-rose-800">
                      <XCircle size={18} strokeWidth={2} />
                      <h4 className="font-sans text-[15px] font-semibold">Generative Cloud LLM Traps</h4>
                    </div>
                    <ul className="space-y-3 text-[13px] font-sans text-shade-60">
                      <li className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span><strong>High Latency Spikes:</strong> 800ms to 2,500ms network round-trip delays impede real-time ingestion pipelines.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span><strong>Unbounded Cost:</strong> Millions of incoming tickets incur continuous token fees ($15 to $60 per 1M items).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span><strong>Prompt Non-Determinism:</strong> Subtle formatting variations cause unexpected JSON schema breakdowns.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span><strong>Data Privacy Egress:</strong> Customer feedback leaves your perimeter to reach external API datacenters.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-3 border-t border-hairline-light text-[11px] font-mono text-shade-50">
                    Verdict: Fragile for high-throughput automated support routing
                  </div>
                </div>

                {/* Column 2: Our Platform Formulation */}
                <div className="bg-canvas-cream border border-hairline-light rounded-lg p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3.5 text-emerald-800">
                      <CheckCircle2 size={18} strokeWidth={2} />
                      <h4 className="font-sans text-[15px] font-semibold">Our Transformer Pipeline</h4>
                    </div>
                    <ul className="space-y-3 text-[13px] font-sans text-shade-60">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span><strong>In-Memory Execution:</strong> Microsecond vector projection over <code className="text-xs font-mono bg-white px-1.5 py-0.5 rounded border border-hairline-light text-ink">all-MiniLM-L6-v2</code>.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span><strong>Zero Compute Cost:</strong> Runs on standard server CPU cores with no expensive GPUs required.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span><strong>Deterministic Linear Head:</strong> Regularized logistic regression guarantees calibrated classification.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span><strong>Air-Gapped Privacy:</strong> No data leaves your host machine; safe for HIPAA and SOC2 compliance.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-3 border-t border-hairline-light text-[11px] font-mono text-emerald-800 font-medium">
                    Verdict: Production-grade consistency and microsecond execution
                  </div>
                </div>
              </div>
            </div>

            <TechStackGrid />
          </motion.div>
        )}

        {/* Sub-tab 2: Inference Pipeline (HowItWorks + InteractivePipeline) */}
        {activeTab === "pipeline" && (
          <motion.div
            key="pipeline"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-10"
          >
            <HowItWorks />
            <InteractivePipeline />
          </motion.div>
        )}

        {/* Sub-tab 3: Occlusion XAI (Formula Formulation Card + OcclusionSimulator) */}
        {activeTab === "occlusion" && (
          <motion.div
            key="occlusion"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-10"
          >
            <div className="surface-card-base">
              <div className="max-w-3xl mb-8">
                <span className="text-[12px] font-sans uppercase tracking-[0.72px] font-medium text-shade-50 block mb-2 select-none">
                  Mathematical Explainability
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-[330] text-ink tracking-tight mb-3">
                  Leave-One-Out (LOO) Occlusion Attribution
                </h3>
                <p className="text-[15px] font-sans text-shade-60 leading-relaxed mb-4">
                  Standard explanation frameworks like LIME or SHAP rely on sampling approximations or linear surrogate models that can hallucinate spurious relationships.
                </p>
                <p className="text-[15px] font-sans text-shade-60 leading-relaxed">
                  Our engine evaluates <strong>exact mathematical attribution</strong> by measuring the true marginal drop in intent probability when individual tokens are masked from the input sequence:
                </p>
              </div>

              {/* Exact Formula Display */}
              <div className="p-5 bg-canvas-cream border border-hairline-light rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-sans uppercase tracking-[0.72px] text-shade-50 block mb-1 font-medium">
                    Attribution Delta Formulation:
                  </span>
                  <div className="font-mono text-[14px] sm:text-[15px] text-ink font-semibold">
                    ΔP(w<sub>i</sub>) = P(Intent<sub>top</sub> | Text) − P(Intent<sub>top</sub> | Text \ &#123;w<sub>i</sub>&#125;)
                  </div>
                </div>
                <span className="pill-tag-shade select-none text-[12px]">
                  Zero-Surrogate Math
                </span>
              </div>
            </div>

            <OcclusionSimulator />
          </motion.div>
        )}

        {/* Sub-tab 4: Business Heuristics */}
        {activeTab === "heuristics" && (
          <motion.div
            key="heuristics"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-10"
          >
            <BusinessHeuristicsMatrix />
          </motion.div>
        )}

        {/* Sub-tab 5: Benchmarks */}
        {activeTab === "benchmarks" && (
          <motion.div
            key="benchmarks"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-10"
          >
            <BenchmarkComparison />
          </motion.div>
        )}

        {/* Sub-tab 6: REST API Reference */}
        {activeTab === "api" && (
          <motion.div
            key="api"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-10"
          >
            <ApiReferenceView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
