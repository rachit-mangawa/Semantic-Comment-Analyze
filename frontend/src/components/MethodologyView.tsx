import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { HowItWorks } from "@/components/About/HowItWorks";
import { OcclusionSimulator } from "@/components/About/OcclusionSimulator";
import { BusinessHeuristicsMatrix } from "@/components/About/BusinessHeuristicsMatrix";
import { TechStackGrid } from "@/components/About/TechStackGrid";
import { RouteView } from "@/router";
import { 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  FileText,
  SlidersHorizontal,
  Workflow
} from "lucide-react";

interface MethodologyViewProps {
  onNavigate: (view: RouteView, subTab?: string) => void;
}

export const MethodologyView: React.FC<MethodologyViewProps> = ({ onNavigate }) => {
  return (
    <div className="page-container flex flex-col gap-12">
      {/* Universal Page Header */}
      <PageHeader
        eyebrow="Core Concepts & Technical Foundations"
        title="Methodology & ML Architecture"
        description="A technical deep-dive into how this platform classifies customer intent, extracts Twitter-RoBERTa sentiment polarity, computes Leave-One-Out attribution math, and executes deterministic business triage on standard CPU."
        badge={
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono tracking-wider text-ink uppercase bg-canvas-soft border border-hairline rounded-md select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Engineering Paper
          </span>
        }
      />

      {/* Section 1: Architectural Paradigm & Design Rationale */}
      <section className="bg-surface-card border border-hairline rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="max-w-3xl mb-8">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-muted block mb-2 select-none">
            01 / Design Rationale
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-ink tracking-tight mb-3">
            Why Dense Embeddings &amp; Linear Heads Outperform Generative LLMs
          </h2>
          <p className="text-[14px] sm:text-[15px] font-sans text-body leading-relaxed">
            Most modern triage architectures default to calling large cloud language models (GPT-4, Claude). While versatile, generative LLMs present critical operational limitations for enterprise support streams: unpredictable latency spikes, recurring per-token cloud costs, prompt degradation, and non-deterministic routing output.
          </p>
        </div>

        {/* Side-by-Side Comparison Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-hairline">
          {/* Column 1: Generative LLM Pitfalls */}
          <div className="bg-canvas-soft border border-hairline rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-red-700">
                <XCircle size={17} strokeWidth={2} />
                <h3 className="font-sans text-[15px] font-semibold">Generative Cloud LLM Traps</h3>
              </div>
              <ul className="space-y-3 text-[13px] font-sans text-body">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>High Latency Spikes:</strong> 800ms to 2,500ms network round-trip delays impede real-time ingestion pipelines.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Unbounded Cost:</strong> Millions of incoming tickets incur continuous token fees ($15 to $60 per 1M items).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Prompt Non-Determinism:</strong> Subtle formatting variations cause unexpected JSON schema breakdowns.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Data Privacy Egress:</strong> Customer feedback leaves your perimeter to reach external API datacenters.</span>
                </li>
              </ul>
            </div>
            <div className="mt-5 pt-3 border-t border-hairline text-[11px] font-mono text-muted">
              Verdict: Fragile for high-throughput automated support routing
            </div>
          </div>

          {/* Column 2: Our Platform Formulation */}
          <div className="bg-canvas-soft border border-hairline rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-emerald-700">
                <CheckCircle2 size={17} strokeWidth={2} />
                <h3 className="font-sans text-[15px] font-semibold">Our Self-Contained Transformer Pipeline</h3>
              </div>
              <ul className="space-y-3 text-[13px] font-sans text-body">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>In-Memory Execution:</strong> Microsecond vector projection over <code className="text-xs font-mono bg-surface-card px-1 rounded border border-hairline">all-MiniLM-L6-v2</code>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Zero Compute Cost:</strong> Runs on standard server CPU cores with no expensive GPUs required.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Deterministic Linear Head:</strong> Regularized logistic regression guarantees stable, calibrated classification.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>100% Air-Gapped Privacy:</strong> No data leaves your host machine; safe for HIPAA and SOC2 compliance.</span>
                </li>
              </ul>
            </div>
            <div className="mt-5 pt-3 border-t border-hairline text-[11px] font-mono text-emerald-700 font-medium">
              Verdict: Production-grade consistency and microsecond execution
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: 4-Stage Coordinated Lifecycle */}
      <section>
        <HowItWorks />
      </section>

      {/* Section 3: Leave-One-Out Token Attribution Mathematics */}
      <section className="bg-surface-card border border-hairline rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="max-w-3xl mb-8">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-muted block mb-2 select-none">
            02 / Explainability Mathematics
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-ink tracking-tight mb-3">
            Leave-One-Out (LOO) Occlusion Attribution
          </h2>
          <p className="text-[14px] sm:text-[15px] font-sans text-body leading-relaxed mb-4">
            Black-box machine learning predictions erode engineer confidence during incident triage. Standard explanation frameworks like LIME or SHAP rely on sampling approximations or linear surrogate models that can hallucinate spurious relationships.
          </p>
          <p className="text-[14px] sm:text-[15px] font-sans text-body leading-relaxed">
            Our engine evaluates <strong>exact mathematical attribution</strong> by measuring the true marginal drop in intent probability when individual tokens are masked from the input sequence:
          </p>
        </div>

        {/* Formula Display Callout */}
        <div className="p-5 bg-canvas-soft border border-hairline rounded-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">
              Exact Attribution Formulation:
            </span>
            <div className="font-mono text-[14px] sm:text-[15px] text-ink font-semibold">
              ΔP(w<sub>i</sub>) = P(Intent<sub>top</sub> | Text) − P(Intent<sub>top</sub> | Text \ &#123;w<sub>i</sub>&#125;)
            </div>
          </div>
          <span className="text-[12px] font-mono text-muted bg-surface-card px-3 py-1.5 rounded-lg border border-hairline">
            Zero-Surrogate Computation
          </span>
        </div>

        {/* Interactive Simulator */}
        <div>
          <h3 className="text-xl font-serif font-medium text-ink mb-2">
            Interactive Occlusion Sandbox
          </h3>
          <p className="text-[13px] text-body mb-6">
            Click words in the interactive benchmark below to simulate runtime occlusion and inspect how the marginal delta shifts:
          </p>
          <OcclusionSimulator />
        </div>
      </section>

      {/* Section 4: Deterministic Business Routing */}
      <section className="bg-surface-card border border-hairline rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="max-w-3xl mb-8">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-muted block mb-2 select-none">
            03 / Operational Triage
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-ink tracking-tight mb-3">
            Deterministic Business Routing &amp; SOP Heuristics
          </h2>
          <p className="text-[14px] sm:text-[15px] font-sans text-body leading-relaxed">
            Raw ML probability distributions cannot trigger operational actions by themselves. An enterprise support desk needs deterministic decision boundaries to distinguish a Sev-1 outage from a minor documentation suggestion. Our heuristic engine pairs the continuous Cardiff Twitter-RoBERTa sentiment score with discrete intent classes:
          </p>
        </div>

        <BusinessHeuristicsMatrix />
      </section>

      {/* Section 5: Hardware & Technology Stack */}
      <section>
        <TechStackGrid />
      </section>

      {/* Section 6: Next Action CTAs */}
      <section className="bg-surface-card border border-hairline rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div>
          <h3 className="font-serif text-2xl font-light text-ink tracking-tight mb-1">
            Test the Methodology Live
          </h3>
          <p className="text-[14px] text-body">
            Experience the inference engine in the interactive single comment sandbox or stream thousands of CSV rows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate("single")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-white font-sans text-[13px] font-medium hover:bg-black transition-colors"
          >
            <span>Single Comment Sandbox</span>
            <ArrowRight size={13} strokeWidth={2} />
          </button>
          <button
            onClick={() => onNavigate("batch")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-canvas-soft border border-hairline text-ink font-sans text-[13px] font-medium hover:bg-canvas transition-colors"
          >
            <span>Stream Batch CSV</span>
          </button>
        </div>
      </section>
    </div>
  );
};
