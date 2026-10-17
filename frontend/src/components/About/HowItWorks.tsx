import React from "react";
import { Zap, Cpu, Sparkles, ShieldCheck } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "FastAPI Ingestion and Model Warmup",
      icon: Zap,
      desc: "FastAPI loads SentenceTransformer and RoBERTa weights into memory as singletons. This avoids repeated weight loading and preserves low latency on incoming requests.",
      tag: "backend/semantic_backend/router.py"
    },
    {
      num: "02",
      title: "Dense Vector Space Mapping",
      icon: Cpu,
      desc: "Text inputs are tokenized and mapped into a 384-dimensional dense semantic embedding space with all-MiniLM-L6-v2, capturing semantic meaning across vocabulary variations.",
      tag: "backend/semantic_backend/nlp_engine.py"
    },
    {
      num: "03",
      title: "Logistic Intent Classification and XAI",
      icon: Sparkles,
      desc: "Embeddings pass into an L2-regularized logistic regression head in roughly 0.15ms. An optional leave-one-out occlusion step masks individual tokens to calculate attribution heatmaps.",
      tag: "backend/semantic_backend/data/local_model_head.pkl"
    },
    {
      num: "04",
      title: "Deterministic Business Heuristics",
      icon: ShieldCheck,
      desc: "Model predictions pass through rule matrices in evaluation.py, assigning customer tone, urgency levels, and recommended standard operating actions.",
      tag: "backend/semantic_backend/evaluation.py"
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
          From model loading to streaming response: four coordinated phases handling classification, token attribution, and action routing.
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
