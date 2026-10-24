import React from "react";
import { Zap, Cpu, Sparkles, ShieldCheck } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "Lifespan Boot & Pre-Warming",
      icon: Zap,
      desc: "FastAPI lifespan initializes singleton SentenceTransformer and RoBERTa weights into system RAM immediately on server boot. This eliminates cold starts, ensuring sub-5ms response times on the very first request.",
      tag: "src/api/server.py"
    },
    {
      num: "02",
      title: "Dense Vector Space Mapping",
      icon: Cpu,
      desc: "Text inputs are tokenized and mapped to a 384-dimensional dense semantic embedding space via all-MiniLM-L6-v2. This captures deep semantic intent without relying on slow bag-of-words or heavy LLMs.",
      tag: "src/engine/nlp_engine.py"
    },
    {
      num: "03",
      title: "Microsecond Hyperplane & XAI",
      icon: Sparkles,
      desc: "Embeddings are classified through an L2-regularized Logistic Regression head in under 150 microseconds. An optional Leave-One-Out occlusion algorithm masks individual words to produce exact attribution heatmaps.",
      tag: "data/local_model_head.pkl"
    },
    {
      num: "04",
      title: "Deterministic Business Heuristics",
      icon: ShieldCheck,
      desc: "Probabilistic predictions are fed into evaluation.py matrices, generating deterministic operational metrics: Customer Tone (Frustrated, Excited), Urgency (High/Med/Low), and Recommended SOP Actions.",
      tag: "src/engine/evaluation.py"
    }
  ];

  return (
    <section className="mb-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[12px] font-mono uppercase tracking-wider text-muted font-semibold">
          Execution Lifecycle
        </span>
        <h2 className="text-3xl font-serif font-light text-ink tracking-tight mt-1">
          How the Pipeline Operates
        </h2>
        <p className="text-[14px] text-body mt-2">
          From cold boot to streaming response: four coordinated phases ensuring microsecond speed, total explainability, and deterministic safety.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="bg-surface-card p-6 md:p-8 rounded-2xl border border-hairline hover:border-hairline-strong transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-mono font-bold text-muted">
                    {step.num}
                  </span>
                  <span className="p-2.5 rounded-xl bg-canvas-soft border border-hairline text-ink">
                    <Icon size={18} />
                  </span>
                </div>
                <h3 className="text-xl font-serif font-medium text-ink mb-3">
                  {step.title}
                </h3>
                <p className="text-[14px] font-sans text-body leading-relaxed mb-6">
                  {step.desc}
                </p>
              </div>
              <div className="pt-4 border-t border-hairline flex items-center justify-between">
                <span className="text-[11px] font-mono text-muted uppercase">Source file</span>
                <code className="text-[12px] font-mono text-ink bg-canvas-soft px-2 py-0.5 rounded border border-hairline">
                  {step.tag}
                </code>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
