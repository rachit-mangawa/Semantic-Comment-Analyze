import React from "react";
import { motion, Variants } from "framer-motion";
import { Cpu, Zap, Activity, Sparkles, ShieldCheck, Database, Layout, Layers } from "lucide-react";

export const TechStackGrid = () => {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const components = [
    {
      title: "SentenceTransformer Embeddings",
      icon: Cpu,
      tech: "all-MiniLM-L6-v2 (384d)",
      desc: "Maps text into 384-dimensional dense semantic vectors using mean-pooled contextual embeddings. Fast, lightweight, and robust across diverse customer vocabularies."
    },
    {
      title: "Custom Intent Classifier Head",
      icon: Zap,
      tech: "Logistic Regression / SVM Head",
      desc: "Evaluates dense vectors against an L2-regularized linear decision hyperplane in under 150 microseconds on standard CPU hardware."
    },
    {
      title: "Twitter-RoBERTa Sentiment",
      icon: Activity,
      tech: "cardiffnlp/twitter-roberta-base",
      desc: "Transformer pipeline trained on 124M tweets providing calibrated positive, neutral, and negative confidence scores tuned for customer text."
    },
    {
      title: "Occlusion Explainability (XAI)",
      icon: Sparkles,
      tech: "Leave-One-Out Token Perturbation",
      desc: "Systematically occludes tokens and measures marginal probability drops (ΔP) to generate exact, color-coded attribution heatmaps without surrogate approximations."
    },
    {
      title: "Deterministic Business Layer",
      icon: ShieldCheck,
      tech: "evaluation.py Heuristics Engine",
      desc: "Maps predicted intent and sentiment to customer tones, urgency levels, and recommended operating actions via lookup tables."
    },
    {
      title: "Streaming CSV Batch Pipeline",
      icon: Database,
      tech: "Python Generator + Chunking (B=32)",
      desc: "Streams multi-thousand feedback files in micro-batches with constant ~45MB memory usage, preventing server OOM errors and connection timeouts."
    },
    {
      title: "FastAPI Async ASGI Server",
      icon: Layers,
      tech: "FastAPI + Uvicorn + Threadpool",
      desc: "Pre-warms all model weights at lifespan startup. Dispatches CPU-bound inferences via asyncio.to_thread to maintain non-blocking concurrency."
    },
    {
      title: "Swiss-Style Analytical Client",
      icon: Layout,
      tech: "React 18 + Vite + Tailwind + Framer",
      desc: "A responsive, single-page dashboard featuring interactive radar charts, word-level heatmaps, live batch progress meters, and documentation explorers."
    }
  ];

  return (
    <section className="mb-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[12px] font-mono uppercase tracking-wider text-muted font-semibold">
          Component Breakdown
        </span>
        <h2 className="text-3xl font-serif font-light text-ink tracking-tight mt-1">
          System Components & Technologies
        </h2>
        <p className="text-[14px] text-body mt-2">
          Modular, independently testable layers engineered for enterprise scale, low resource footprint, and zero cloud lock-in.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12"
      >
        {components.map((comp, idx) => {
          const Icon = comp.icon;
          return (
            <motion.div
              key={idx}
              variants={item}
              className="bg-surface-card p-6 rounded-2xl border border-hairline hover:border-hairline-strong transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="p-2.5 rounded-xl bg-canvas-soft border border-hairline text-ink">
                    <Icon size={18} />
                  </span>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-canvas-soft border border-hairline text-muted">
                    Active
                  </span>
                </div>
                <h3 className="text-[16px] font-serif font-medium text-ink mb-1">
                  {comp.title}
                </h3>
                <span className="text-[12px] font-mono text-muted block mb-3">
                  {comp.tech}
                </span>
                <p className="text-[13px] font-sans text-body leading-relaxed">
                  {comp.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Codebase Tree */}
      <div className="max-w-6xl mx-auto bg-surface-card rounded-2xl p-6 md:p-8 border border-hairline shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-serif font-medium text-ink">
            Repository Architecture Tree
          </h3>
          <span className="text-[11px] font-mono text-muted">
            Monorepo Layout
          </span>
        </div>
        <div className="bg-canvas-soft rounded-xl p-4 overflow-x-auto border border-hairline">
          <pre className="text-[13px] font-mono text-ink leading-[1.6]">
{`Semantic-Comment-Analyze/
├── ARCHITECTURE.md          # 🏛️ Comprehensive technical specifications and data contracts
├── README.md                # 📖 Public repository documentation & benchmarks
├── run.bat                  # ⚡ One-click Windows startup script
├── docs/API_REFERENCE.md    # 📡 Full REST API specification and curl examples
├── src/
│   ├── api/server.py        # 🌐 FastAPI gateway, lifespan warmup, static SPA mount
│   ├── engine/
│   │   ├── nlp_engine.py    # 🤖 Vectorizer, classifier head, and occlusion XAI
│   │   ├── evaluation.py    # ⚖️ Business heuristics (Urgency, Tone, SOP Actions)
│   │   ├── train_intent.py  # 🎓 Intent classifier training CLI
│   │   └── train_sentiment.py# 🔬 RoBERTa sentiment fine-tuning
│   └── data/data_handler.py # 🌊 High-throughput streaming CSV processor
└── frontend/                # 💻 Modern React 18 + Vite + Tailwind CSS SPA
    └── src/components/About/# 🏛️ Interactive Architecture & Documentation Hub`}
          </pre>
        </div>
      </div>
    </section>
  );
};
