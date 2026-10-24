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
    name: "FastAPI Ingestion & Warmup",
    subtitle: "Non-blocking async request gateway",
    latency: "< 0.2ms",
    file: "src/api/server.py",
    badge: "Gateway",
    description: "Accepts incoming REST or multipart CSV requests. Evaluates Pydantic schemas and offloads heavy inference to background worker threads via asyncio.to_thread, guaranteeing zero event-loop lock.",
    input: "Raw JSON string or multipart/form-data CSV stream",
    output: "Validated Python request payload passed to threadpool",
    details: [
      "FastAPI lifespan context manager pre-warms all model weights at application boot",
      "Full CORS wildcard headers for seamless cross-domain integration",
      "Zero cold-start penalty for incoming client connections",
      "Mounts production React static assets directly on root /"
    ]
  },
  {
    id: "embedding",
    number: "02",
    name: "SentenceTransformer Embeddings",
    subtitle: "384-dimensional dense semantic mapping",
    latency: "~ 3.2ms",
    file: "src/engine/nlp_engine.py",
    badge: "Vector Space",
    description: "Transforms unstructured natural language text into a highly dense 384-dimensional vector space using all-MiniLM-L6-v2 with mean pooling over token embeddings.",
    input: "Sanitized string (truncated up to 256 tokens)",
    output: "Normalized dense float vector: shape (384,)",
    details: [
      "Cached in memory as a singleton via @lru_cache(maxsize=1)",
      "Batch-vectorized in micro-chunks of 32 for SIMD CPU efficiency",
      "Captures deep semantic context far beyond simple bag-of-words or TF-IDF",
      "Enables linear separability across categorical intents"
    ]
  },
  {
    id: "head",
    number: "03",
    name: "Custom Logistic Intent Head",
    subtitle: "Microsecond hyperplane classification",
    latency: "~ 0.15ms",
    file: "data/local_model_head.pkl",
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
    name: "Twitter-RoBERTa Sentiment & NER",
    subtitle: "Fine-grained affective polarity & entity extraction",
    latency: "~ 5.1ms",
    file: "src/engine/nlp_engine.py",
    badge: "Affect Analysis",
    description: "Runs Cardiff NLP's Twitter-RoBERTa model for sentiment classification alongside a Hugging Face NER pipeline to identify named entities (Organizations, People, Locations).",
    input: "Text truncated to 512 tokens",
    output: "Normalized sentiment: { label: POSITIVE|NEUTRAL|NEGATIVE, score: float }",
    details: [
      "Pre-trained on 124M tweets for realistic customer feedback understanding",
      "Calibrated probability score reflecting emotional intensity",
      "Contextual NER tagger with simple span aggregation",
      "Runs parallel to intent prediction in the background threadpool"
    ]
  },
  {
    id: "occlusion",
    number: "05",
    name: "Occlusion Explainability Engine",
    subtitle: "Leave-One-Out (LOO) token perturbation",
    latency: "~ 8.5ms",
    file: "src/engine/nlp_engine.py",
    badge: "Explainability (XAI)",
    description: "Systematically masks each token and measures the confidence drop (ΔP) to identify which words contributed to the predicted intent.",
    input: "Word-tokenized sentence array",
    output: "Token attribution list with marginal contribution scores",
    details: [
      "Marginal formula: C(w_i) = P(intent | sentence) - P(intent | sentence without w_i)",
      "Exact attribution without surrogate approximations (unlike LIME or SHAP)",
      "Directly drives the client heatmap visualization with categorical colors",
      "Optional execution: only triggered when include_explanation=true"
    ]
  },
  {
    id: "heuristics",
    number: "06",
    name: "Business Heuristics Evaluator",
    subtitle: "Deterministic enterprise decision matrix",
    latency: "< 0.05ms",
    file: "src/engine/evaluation.py",
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
    file: "src/data/data_handler.py",
    badge: "Delivery",
    description: "Combines model predictions, explainability heatmaps, and business context into a clean JSON payload for single analyses, or yields chunked CSV rows in 32-sample batches for high-throughput batch jobs.",
    input: "Consolidated ML predictions & business context objects",
    output: "HTTP 200 JSON Response or Chunked text/csv Stream",
    details: [
      "Memory-invariant batch streaming: constant ~45MB RAM regardless of dataset rows",
      "Seamless integration with enterprise microservices, CRMs, or data lakes",
      "Client UI visualizes results with Radar charts, Heatmaps, and progress meters"
    ]
  }
];

export const InteractivePipeline = () => {
  const [selectedStage, setSelectedStage] = useState<PipelineStage>(STAGES[1]);

  return (
    <div className="bg-surface-card border border-hairline rounded-2xl p-6 md:p-8 mb-16 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-hairline">
        <div>
          <span className="text-[12px] font-mono uppercase tracking-wider text-muted font-semibold">
            Interactive Deep Dive
          </span>
          <h3 className="text-2xl font-serif font-light text-ink mt-1">
            End-to-End Inference Pipeline
          </h3>
          <p className="text-[14px] text-body mt-1">
            Click any processing stage to inspect its mathematical role, latency footprint, and source implementation.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-canvas-soft border border-hairline px-3 py-1.5 rounded-full text-[12px] font-mono text-muted self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Local In-Memory Execution</span>
        </div>
      </div>

      {/* Pipeline Stage Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-8">
        {STAGES.map((stage) => {
          const isSelected = selectedStage.id === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage)}
              className={`p-3 rounded-xl border text-left transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out enabled:active:scale-[0.96] relative overflow-hidden flex flex-col justify-between h-28 ${
                isSelected
                  ? "bg-surface-strong border-ink text-ink shadow-xs"
                  : "bg-canvas-soft border-hairline text-body hover:border-hairline-strong hover:bg-canvas"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[11px] font-mono font-semibold tabular-nums ${isSelected ? "text-ink" : "text-muted"}`}>
                  {stage.number}
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded tabular-nums select-none ${isSelected ? "bg-ink text-white" : "bg-hairline text-muted"}`}>
                  {stage.latency}
                </span>
              </div>
              <div>
                <p className={`text-[13px] font-medium leading-tight line-clamp-2 ${isSelected ? "text-ink font-semibold" : "text-ink"}`}>
                  {stage.name.split(" ")[0]} {stage.name.split(" ")[1]}
                </p>
                <span className="text-[11px] text-muted block mt-1 truncate">
                  {stage.badge}
                </span>
              </div>
              {isSelected && (
                <motion.div
                  layoutId="stage-indicator"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-ink"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Stage Detail Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedStage.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="bg-canvas-soft rounded-2xl border border-hairline p-6 md:p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl font-mono font-bold text-muted">
                  {selectedStage.number}
                </span>
                <h4 className="text-2xl font-serif font-medium text-ink">
                  {selectedStage.name}
                </h4>
                <span className="text-[12px] font-sans font-medium px-2.5 py-1 rounded-full bg-surface-card border border-hairline text-body">
                  {selectedStage.badge}
                </span>
              </div>
              <p className="text-[15px] text-muted font-sans font-medium">
                {selectedStage.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-surface-card border border-hairline px-3 py-1.5 rounded-lg text-[13px] font-mono text-ink">
                <Clock size={15} className="text-muted" />
                <span>Execution: {selectedStage.latency}</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-card border border-hairline px-3 py-1.5 rounded-lg text-[13px] font-mono text-ink">
                <FileCode size={15} className="text-muted" />
                <span>{selectedStage.file}</span>
              </div>
            </div>
          </div>

          <p className="text-[16px] text-body leading-relaxed mb-6 font-sans">
            {selectedStage.description}
          </p>

          {/* I/O Schemas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-surface-card p-4 rounded-xl border border-hairline">
              <span className="text-[11px] font-mono uppercase text-muted tracking-wider block mb-1">
                Input Data
              </span>
              <code className="text-[13px] font-mono text-ink font-medium block">
                {selectedStage.input}
              </code>
            </div>
            <div className="bg-surface-card p-4 rounded-xl border border-hairline">
              <span className="text-[11px] font-mono uppercase text-muted tracking-wider block mb-1">
                Output Representation
              </span>
              <code className="text-[13px] font-mono text-ink font-medium block">
                {selectedStage.output}
              </code>
            </div>
          </div>

          {/* Engineering Highlights */}
          <div>
            <span className="text-[12px] font-mono uppercase tracking-wider text-muted font-semibold block mb-3">
              Key Engineering Guarantees
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {selectedStage.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-[14px] text-body">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
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
