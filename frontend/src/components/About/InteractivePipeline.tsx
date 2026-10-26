import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  Layers, 
  Activity, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Code2, 
  Clock, 
  FileCode,
  CheckCircle2,
  Sparkles
} from "lucide-react";

interface PipelineStage {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  latency: string;
  file: string;
  badge: string;
  description: string;
  input: string;
  output: string;
  details: string[];
}

const STAGES: PipelineStage[] = [
  {
    id: "ingest",
    number: "01",
    name: "FastAPI Ingestion & Gateway",
    subtitle: "Non-blocking async request gateway",
    latency: "< 0.2ms",
    file: "backend/semantic_backend/router.py",
    badge: "Gateway",
    description: "Accepts incoming REST or multipart CSV requests under /semantic. Evaluates Pydantic schemas and offloads inference to background worker threads via asyncio.to_thread to maintain an open event loop.",
    input: "Raw JSON string or multipart/form-data CSV stream",
    output: "Validated Python request payload passed to threadpool",
    details: [
      "Models cached in memory as singletons via @lru_cache",
      "Full CORS wildcard headers for flexible client integration",
      "Low-latency response on repeated client requests",
      "Exposes /semantic/analyze, /semantic/batch, and /semantic/health"
    ]
  },
  {
    id: "embedding",
    number: "02",
    name: "SentenceTransformer Embeddings",
    subtitle: "384-dimensional dense semantic mapping",
    latency: "~ 3.2ms",
    file: "backend/semantic_backend/nlp_engine.py",
    badge: "Vector Space",
    description: "Transforms natural language text into a 384-dimensional dense vector space using all-MiniLM-L6-v2 with mean pooling over token embeddings.",
    input: "Sanitized string (truncated up to 256 tokens)",
    output: "Normalized dense float vector: shape (384,)",
    details: [
      "Cached in memory as a singleton via @lru_cache(maxsize=1)",
      "Batch-vectorized in micro-chunks of 32 for CPU efficiency",
      "Captures semantic intent across vocabulary variations",
      "Provides linearly separable representations across intent classes"
    ]
  },
  {
    id: "head",
    number: "03",
    name: "Custom Logistic Intent Head",
    subtitle: "Microsecond hyperplane classification",
    latency: "~ 0.15ms",
    file: "backend/semantic_backend/data/local_model_head.pkl",
    badge: "Classifier",
    description: "Computes multi-class softmax probabilities across intent categories using an L2-regularized Logistic Regression head evaluated against sentence embeddings.",
    input: "384-dimensional semantic embedding vector",
    output: "Softmax probability distribution across 5 core intent classes",
    details: [
      "Classifies Bug Report, Complaint, Feature Request, Praise, and Question",
      "Dynamic threshold filtering ensures only high-certainty labels are returned",
      "Auto-training fallback: automatically fits a new head if the .pkl file is absent",
      "Executes over 2,500 inferences per second per CPU core"
    ]
  },
  {
    id: "sentiment",
    number: "04",
    name: "Twitter-RoBERTa Sentiment",
    subtitle: "Fine-grained affective polarity analysis",
    latency: "~ 5.1ms",
    file: "backend/semantic_backend/nlp_engine.py",
    badge: "Affect Analysis",
    description: "Runs Cardiff NLP's Twitter-RoBERTa model for sentiment classification into POSITIVE, NEUTRAL, and NEGATIVE labels with calibrated confidence.",
    input: "Text truncated to 512 tokens",
    output: "Normalized sentiment: { label: POSITIVE|NEUTRAL|NEGATIVE, score: float }",
    details: [
      "Pre-trained on 124M tweets for realistic customer feedback understanding",
      "Calibrated probability score reflecting emotional intensity",
      "Runs locally on CPU with batch inference support",
      "Non-generative deterministic scoring"
    ]
  },
  {
    id: "occlusion",
    number: "05",
    name: "Leave-One-Out (LOO) XAI Math",
    subtitle: "Zero-surrogate marginal attribution",
    latency: "~ 14.5ms",
    file: "backend/semantic_backend/nlp_engine.py",
    badge: "Explainability",
    description: "Systematically occludes individual words from the prompt and measures the marginal drop (ΔP) in intent confidence without surrogate model approximations.",
    input: "Original text tokens + baseline top-intent probability",
    output: "Attribution array: [{ word: string, contribution: float, primary_intent: string }]",
    details: [
      "Exact mathematical formulation: ΔP = P(Intent|S) - P(Intent|S \\ {w})",
      "Zero random sampling error unlike LIME/SHAP approximations",
      "Pinpoints exact tokens driving confidence shifts",
      "Operates efficiently in SIMD CPU batches"
    ]
  },
  {
    id: "heuristics",
    number: "06",
    name: "Business Heuristics Evaluator",
    subtitle: "Deterministic enterprise decision matrix",
    latency: "< 0.05ms",
    file: "backend/semantic_backend/evaluation.py",
    badge: "Business Rules",
    description: "Translates model predictions into operational metrics (urgency, customer tone, and SOP routing) using deterministic lookup tables.",
    input: "Top Intent + Sentiment Object (label, score)",
    output: "{ tone: string, urgency: High|Medium|Low, recommended_action: string }",
    details: [
      "Urgency: maps critical bugs and severe complaints directly to High priority",
      "Tone: converts ML probabilities to human affective states (Frustrated, Excited, Curious)",
      "SOP Dispatcher: logs Jira tickets, updates FAQs, routes to support or product teams",
      "Zero-overhead execution via O(1) hash map lookups"
    ]
  },
  {
    id: "response",
    number: "07",
    name: "Response Aggregation / CSV Stream",
    subtitle: "Structured JSON or chunked streaming generator",
    latency: "< 0.1ms",
    file: "backend/semantic_backend/data_handler.py",
    badge: "Delivery",
    description: "Combines model predictions, explainability heatmaps, and business context into a clean JSON payload for single analyses, or yields chunked CSV rows in 32-sample batches for high-throughput batch jobs.",
    input: "Consolidated ML predictions & business context objects",
    output: "HTTP 200 JSON Response or Chunked text/csv Stream",
    details: [
      "Memory-invariant batch streaming: constant ~45MB RAM regardless of dataset rows",
      "Seamless integration with microservices, CRMs, or analytics pipelines",
      "Client UI visualizes results with Radar charts, Heatmaps, and progress meters"
    ]
  }
];

export const InteractivePipeline = () => {
  const [selectedStage, setSelectedStage] = useState<PipelineStage>(STAGES[1]);

  return (
    <div className="surface-card-base w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-hairline-light">
        <div>
          <span className="eyebrow-cap">
            Interactive Deep Dive
          </span>
          <h3 className="section-heading mt-1">
            End-to-End Inference Pipeline
          </h3>
          <p className="text-[14px] text-shade-60 mt-1 font-sans">
            Click any processing stage to inspect its mathematical role, latency footprint, and source implementation.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-canvas-cream border border-hairline-light px-3 py-1.5 rounded-pill text-[12px] font-mono text-shade-60 self-start md:self-auto select-none shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Local In-Memory Execution</span>
        </div>
      </div>

      {/* Pipeline Stage Buttons */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 sm:grid sm:grid-cols-4 lg:grid-cols-7">
        {STAGES.map((stage) => {
          const isSelected = selectedStage.id === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage)}
              className={`p-3 rounded-xl border text-left transition-all duration-150 ease-out active:scale-[0.97] relative overflow-hidden flex flex-col justify-between h-28 select-none shrink-0 w-36 sm:w-auto ${
                isSelected
                  ? "bg-black text-white border-black shadow-sm"
                  : "bg-canvas-cream border-hairline-light text-shade-60 hover:text-ink hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[11px] font-mono font-semibold tabular-nums ${isSelected ? "text-white/80" : "text-shade-50"}`}>
                  {stage.number}
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-pill tabular-nums select-none ${isSelected ? "bg-white/20 text-white" : "bg-white border border-hairline-light text-shade-60"}`}>
                  {stage.latency}
                </span>
              </div>
              <div>
                <p className={`text-[13px] font-sans font-medium leading-tight line-clamp-2 ${isSelected ? "text-white font-semibold" : "text-ink"}`}>
                  {stage.name.split(" ")[0]} {stage.name.split(" ")[1]}
                </p>
                <span className={`text-[11px] block mt-1 truncate ${isSelected ? "text-white/70" : "text-shade-50"}`}>
                  {stage.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Detail Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedStage.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="bg-canvas-cream border border-hairline-light rounded-xl p-5 sm:p-7 shadow-inner"
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 sm:gap-5 mb-5 pb-5 border-b border-hairline-light">
            <div>
              <div className="flex items-center gap-2 sm:gap-2.5 mb-1.5 flex-wrap">
                <span className="text-base sm:text-lg font-mono font-bold text-shade-40">
                  {selectedStage.number}
                </span>
                <h4 className="text-xl sm:text-2xl font-display font-[330] text-ink">
                  {selectedStage.name}
                </h4>
                <span className="text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-pill bg-white border border-hairline-light text-shade-70 shadow-xs">
                  {selectedStage.badge}
                </span>
              </div>
              <p className="text-[13px] sm:text-[14px] text-shade-60 font-sans">
                {selectedStage.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-[12px] font-mono">
              <div className="flex items-center gap-1.5 bg-white border border-hairline-light px-3 py-1 rounded-pill text-ink shadow-xs">
                <Clock size={13} className="text-shade-40" />
                <span>Latency: {selectedStage.latency}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-hairline-light px-3 py-1 rounded-pill text-ink shadow-xs max-w-full">
                <FileCode size={13} className="text-shade-40 shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-none">{selectedStage.file}</span>
              </div>
            </div>
          </div>

          <p className="text-[15px] text-shade-70 leading-relaxed mb-6 font-sans">
            {selectedStage.description}
          </p>

          {/* I/O Schemas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-hairline-light shadow-xs">
              <span className="text-[11px] font-sans uppercase text-shade-50 tracking-[0.72px] font-medium block mb-1">
                Input Data
              </span>
              <code className="text-[12px] font-mono text-ink font-medium block">
                {selectedStage.input}
              </code>
            </div>
            <div className="bg-white p-4 rounded-lg border border-hairline-light shadow-xs">
              <span className="text-[11px] font-sans uppercase text-shade-50 tracking-[0.72px] font-medium block mb-1">
                Output Representation
              </span>
              <code className="text-[12px] font-mono text-ink font-medium block">
                {selectedStage.output}
              </code>
            </div>
          </div>

          {/* Engineering Highlights */}
          <div>
            <span className="text-[11px] font-sans uppercase tracking-[0.72px] text-shade-50 font-semibold block mb-3">
              Key Engineering Guarantees
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {selectedStage.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[13px] font-sans text-shade-60">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
