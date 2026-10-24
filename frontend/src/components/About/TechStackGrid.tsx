import React from "react";
import { 
  Cpu, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Database, 
  Zap, 
  Workflow, 
  Layout, 
  Server
} from "lucide-react";
import { motion } from "framer-motion";

export const TechStackGrid = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } }
  };

  const components = [
    {
      title: "Dense Semantic Vectorizer",
      icon: Cpu,
      tech: "all-MiniLM-L6-v2 (384d)",
      desc: "Singleton CPU embedding engine producing continuous semantic vectors. Computes cosine embeddings in ~3.2ms without external network latency."
    },
    {
      title: "Logistic Intent Head",
      icon: Sparkles,
      tech: "Scikit-Learn Head (L2 Regularized)",
      desc: "Calibrated multi-class classification head trained across enterprise feedback categories. Evaluates probabilities in under 150 microseconds."
    },
    {
      title: "Twitter-RoBERTa Sentiment",
      icon: Zap,
      tech: "Cardiff NLP Twitter-RoBERTa",
      desc: "Deep 3-class sentiment polarity analysis (Positive, Neutral, Negative) fine-tuned on real customer conversations to gauge user emotion and satisfaction."
    },
    {
      title: "Deterministic Heuristic Matrix",
      icon: ShieldCheck,
      tech: "Pure Python Matrix (Zero LLM)",
      desc: "Maps probabilistic intent and sentiment into deterministic business rules: Priority (High/Med/Low), Tone (Frustrated, Excited), and SOP Actions."
    },
    {
      title: "Leave-One-Out (LOO) Occlusion XAI",
      icon: Workflow,
      tech: "Mathematical Perturbation Engine",
      desc: "Computes exact word-level contribution attribution by measuring marginal probability delta across masked token permutations without LIME/SHAP."
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
      title: "Design System Analytical Client",
      icon: Layout,
      tech: "React SPA + Vite + Tailwind + Framer",
      desc: "A responsive, single-page dashboard featuring interactive radar charts, word-level heatmaps, live batch progress meters, and documentation explorers."
    }
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="surface-card-base">
        <div className="mb-8 pb-6 border-b border-hairline-light">
          <span className="eyebrow-cap">
            Component Breakdown
          </span>
          <h3 className="section-heading mt-1">
            System Components &amp; Technologies
          </h3>
          <p className="text-[14px] text-shade-60 mt-1 font-sans">
            Modular, independently testable layers engineered for enterprise scale, low resource footprint, and zero cloud lock-in.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {components.map((comp, idx) => {
            const Icon = comp.icon;
            return (
              <motion.div
                key={idx}
                variants={item}
                className="bg-canvas-cream/60 p-5 rounded-xl border border-hairline-light hover:border-black/30 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 rounded-pill bg-white border border-hairline-light text-ink shadow-xs">
                      <Icon size={16} />
                    </span>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-pill bg-white border border-hairline-light text-shade-60">
                      Active
                    </span>
                  </div>
                  <h4 className="text-[15px] font-sans font-semibold text-ink mb-1">
                    {comp.title}
                  </h4>
                  <span className="text-[12px] font-mono text-shade-50 block mb-2.5">
                    {comp.tech}
                  </span>
                  <p className="text-[13px] font-sans text-shade-60 leading-relaxed">
                    {comp.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Codebase Tree */}
      <div className="surface-card-base">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-hairline-light">
          <div>
            <span className="eyebrow-cap">Monorepo Layout</span>
            <h4 className="text-xl font-display font-[330] text-ink">
              Repository Architecture Tree
            </h4>
          </div>
          <span className="text-[11px] font-mono text-shade-50 px-2.5 py-1 rounded-pill bg-canvas-cream border border-hairline-light">
            Clean Architecture
          </span>
        </div>
        <div className="bg-canvas-cream rounded-xl p-5 overflow-x-auto border border-hairline-light shadow-inner">
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
└── frontend/                # 💻 Modern React + Vite + Tailwind CSS SPA
    └── src/components/About/# 🏛️ Interactive Architecture & Documentation Hub`}
          </pre>
        </div>
      </div>
    </div>
  );
};
