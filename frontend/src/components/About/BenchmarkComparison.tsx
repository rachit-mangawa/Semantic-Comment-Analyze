import React from "react";
import { Zap, DollarSign, Activity, CheckCircle2 } from "lucide-react";

export const BenchmarkComparison = () => {
  return (
    <div className="surface-card-base w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-hairline-light">
        <div>
          <span className="eyebrow-cap">
            Performance &amp; Economics
          </span>
          <h3 className="section-heading mt-1">
            Architectural Benchmarks &amp; Comparison
          </h3>
          <p className="text-[14px] text-shade-60 mt-1 font-sans">
            Latency, throughput, and compute benchmarks comparing embeddings + linear head against generative LLMs and cross-encoders.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-canvas-cream border border-hairline-light px-3 py-1.5 rounded-pill text-[12px] font-mono text-ink font-semibold select-none shadow-xs self-start md:self-auto">
          <Zap size={14} className="text-amber-600" />
          <span>Local CPU vs Cloud LLM API</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Latency */}
        <div className="bg-canvas-cream/60 border border-hairline-light p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-sans uppercase text-shade-50 font-semibold tracking-wider">
              Single Inference Latency
            </span>
            <span className="p-2 bg-white rounded-pill border border-hairline-light text-ink shadow-xs">
              <Zap size={15} />
            </span>
          </div>
          <div className="space-y-3 font-mono">
            <div>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="font-semibold text-emerald-700">Our Platform</span>
                <span className="font-bold text-emerald-700">~12 ms</span>
              </div>
              <div className="w-full bg-hairline-light rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full w-[8%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[12px] mb-1 text-shade-50">
                <span>BART Zero-Shot (Local)</span>
                <span>180 ms</span>
              </div>
              <div className="w-full bg-hairline-light rounded-full h-1.5 overflow-hidden">
                <div className="bg-shade-40 h-full rounded-full w-[35%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[12px] mb-1 text-shade-50">
                <span>GPT-4 / Claude (API)</span>
                <span>1,200 ms</span>
              </div>
              <div className="w-full bg-hairline-light rounded-full h-1.5 overflow-hidden">
                <div className="bg-shade-30 h-full rounded-full w-[100%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2: Throughput */}
        <div className="bg-canvas-cream/60 border border-hairline-light p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-sans uppercase text-shade-50 font-semibold tracking-wider">
              CPU Throughput (req/s)
            </span>
            <span className="p-2 bg-white rounded-pill border border-hairline-light text-ink shadow-xs">
              <Activity size={15} />
            </span>
          </div>
          <div className="space-y-3 font-mono">
            <div>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="font-semibold text-emerald-700">Our Platform</span>
                <span className="font-bold text-emerald-700">280+ req/s</span>
              </div>
              <div className="w-full bg-hairline-light rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full w-[100%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[12px] mb-1 text-shade-50">
                <span>BART Zero-Shot (Local)</span>
                <span>~8 req/s</span>
              </div>
              <div className="w-full bg-hairline-light rounded-full h-1.5 overflow-hidden">
                <div className="bg-shade-40 h-full rounded-full w-[5%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[12px] mb-1 text-shade-50">
                <span>Cloud LLM Rate Limits</span>
                <span>~2 req/s</span>
              </div>
              <div className="w-full bg-hairline-light rounded-full h-1.5 overflow-hidden">
                <div className="bg-shade-30 h-full rounded-full w-[2%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Metric 3: Cost */}
        <div className="bg-canvas-cream/60 border border-hairline-light p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-sans uppercase text-shade-50 font-semibold tracking-wider">
              Cost per 1M Texts
            </span>
            <span className="p-2 bg-white rounded-pill border border-hairline-light text-ink shadow-xs">
              <DollarSign size={15} />
            </span>
          </div>
          <div className="space-y-3 font-mono">
            <div>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="font-semibold text-emerald-700">Our Platform</span>
                <span className="font-bold text-emerald-700">$0.00</span>
              </div>
              <div className="w-full bg-hairline-light rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full w-[1%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[12px] mb-1 text-shade-50">
                <span>Local GPU Server</span>
                <span>~$5.00</span>
              </div>
              <div className="w-full bg-hairline-light rounded-full h-1.5 overflow-hidden">
                <div className="bg-shade-40 h-full rounded-full w-[15%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[12px] mb-1 text-shade-50">
                <span>Cloud LLM Tokens</span>
                <span>~$30.00 - $60.00</span>
              </div>
              <div className="w-full bg-hairline-light rounded-full h-1.5 overflow-hidden">
                <div className="bg-shade-30 h-full rounded-full w-[100%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Matrix Table */}
      <div className="overflow-x-auto border border-hairline-light rounded-xl">
        <table className="w-full text-left border-collapse text-[13px] font-sans">
          <thead>
            <tr className="border-b border-hairline-light bg-canvas-cream/60 text-shade-50 font-mono uppercase text-[11px]">
              <th className="py-3 px-4">Evaluation Dimension</th>
              <th className="py-3 px-4 text-emerald-800 font-bold">Our Platform (MiniLM + Head)</th>
              <th className="py-3 px-4">Zero-Shot (BART-Large)</th>
              <th className="py-3 px-4">Cloud LLMs (GPT-4 / Claude)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-light text-ink">
            <tr className="hover:bg-canvas-cream/40 transition-colors">
              <td className="py-3 px-4 font-medium">Inference Latency</td>
              <td className="py-3 px-4 text-emerald-700 font-semibold font-mono">~10ms – 25ms</td>
              <td className="py-3 px-4 font-mono text-shade-50">120ms – 350ms</td>
              <td className="py-3 px-4 font-mono text-shade-50">800ms – 2,500ms</td>
            </tr>
            <tr className="hover:bg-canvas-cream/40 transition-colors">
              <td className="py-3 px-4 font-medium">Hardware Requirement</td>
              <td className="py-3 px-4 text-emerald-700 font-semibold">Commodity CPU (Zero GPU needed)</td>
              <td className="py-3 px-4 text-shade-50">High VRAM GPU (8GB+)</td>
              <td className="py-3 px-4 text-shade-50">Massive Cloud Datacenter</td>
            </tr>
            <tr className="hover:bg-canvas-cream/40 transition-colors">
              <td className="py-3 px-4 font-medium">Explainability Method</td>
              <td className="py-3 px-4 text-emerald-700 font-semibold">Exact Leave-One-Out Token Math</td>
              <td className="py-3 px-4 text-shade-50">Opaque / Approximation required</td>
              <td className="py-3 px-4 text-shade-50">Generative Hallucination Risk</td>
            </tr>
            <tr className="hover:bg-canvas-cream/40 transition-colors">
              <td className="py-3 px-4 font-medium">Data Privacy &amp; Security</td>
              <td className="py-3 px-4 text-emerald-700 font-semibold">100% Offline / Air-Gapped Ready</td>
              <td className="py-3 px-4 text-shade-50">Local Server</td>
              <td className="py-3 px-4 text-shade-50">Data Sent to External Cloud API</td>
            </tr>
            <tr className="hover:bg-canvas-cream/40 transition-colors">
              <td className="py-3 px-4 font-medium">Batch Scaling Behavior</td>
              <td className="py-3 px-4 text-emerald-700 font-semibold">Chunked Streaming (~45MB RAM)</td>
              <td className="py-3 px-4 text-shade-50">High Memory / OOM Prone</td>
              <td className="py-3 px-4 text-shade-50">Strict Rate-Limits &amp; Pay-per-Call</td>
            </tr>
            <tr className="hover:bg-canvas-cream/40 transition-colors">
              <td className="py-3 px-4 font-medium">Operational Decision Layer</td>
              <td className="py-3 px-4 text-emerald-700 font-semibold">Deterministic Business Heuristics</td>
              <td className="py-3 px-4 text-shade-50">Separate Service Needed</td>
              <td className="py-3 px-4 text-shade-50">Unpredictable Text Routing</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
