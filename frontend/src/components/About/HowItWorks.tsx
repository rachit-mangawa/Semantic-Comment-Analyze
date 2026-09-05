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
    <div className="surface-card-base w-full">
      <div className="mb-8 pb-6 border-b border-hairline-light">
        <span className="eyebrow-cap">
          Execution Lifecycle
        </span>
        <h3 className="section-heading mt-1">
          How the Pipeline Operates
        </h3>
        <p className="text-[14px] text-shade-60 mt-1 font-sans">
          From cold boot to streaming response: four coordinated phases ensuring microsecond speed, total explainability, and deterministic safety.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="bg-canvas-cream/60 p-6 sm:p-7 rounded-xl border border-hairline-light hover:border-black/30 transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-mono font-bold text-shade-40">
                    {step.num}
                  </span>
                  <span className="p-2.5 rounded-pill bg-white border border-hairline-light text-ink shadow-xs">
                    <Icon size={18} />
                  </span>
                </div>
                <h4 className="text-xl font-display font-[330] text-ink mb-2.5">
                  {step.title}
                </h4>
                <p className="text-[14px] font-sans text-shade-60 leading-relaxed mb-6">
                  {step.desc}
                </p>
              </div>
              <div className="pt-4 border-t border-hairline-light flex items-center justify-between text-[12px] font-mono text-shade-50">
                <span className="uppercase tracking-wider">Source file</span>
                <code className="text-ink bg-white px-2 py-0.5 rounded border border-hairline-light shadow-2xs">
                  {step.tag}
                </code>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
