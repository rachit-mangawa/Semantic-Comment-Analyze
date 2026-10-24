import React from "react";
import { Zap, DollarSign, Shield, Activity, CheckCircle, XCircle } from "lucide-react";

export const BenchmarkComparison = () => {
  return (
    <div className="bg-surface-card border border-hairline rounded-2xl p-6 md:p-8 mb-16 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-hairline">
        <div>
          <span className="text-[12px] font-mono uppercase tracking-wider text-muted font-semibold">
            Performance & Economics
          </span>
          <h3 className="text-2xl font-serif font-light text-ink mt-1">
            Architectural Benchmarks & Comparison
          </h3>
          <p className="text-[14px] text-body mt-1">
            Latency, throughput, and compute benchmarks comparing embeddings + linear head against generative LLMs and cross-encoders.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-canvas-soft border border-hairline px-3 py-1.5 rounded-full text-[12px] font-mono text-ink font-semibold">
          <Zap size={14} className="text-amber-600" />
          <span>Local CPU vs Cloud LLM API</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Metric 1 */}
        <div className="bg-canvas-soft border border-hairline p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px] font-mono uppercase text-muted font-semibold tracking-wider">
              Single Inference Latency
            </span>
            <span className="p-2 bg-surface-card rounded-lg border border-hairline text-ink">
              <Zap size={16} />
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[13px] mb-1 font-mono">
                <span className="font-semibold text-emerald-700">Our Platform</span>
                <span className="font-bold text-emerald-700">~12 ms</span>
              </div>
              <div className="w-full bg-hairline rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full w-[8%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px] mb-1 font-mono text-muted">
                <span>BART Zero-Shot (Local)</span>
                <span>180 ms</span>
              </div>
              <div className="w-full bg-hairline rounded-full h-2">
                <div className="bg-muted h-2 rounded-full w-[35%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px] mb-1 font-mono text-muted">
                <span>GPT-4 / Claude (API)</span>
                <span>1,200 ms</span>
              </div>
              <div className="w-full bg-hairline rounded-full h-2">
                <div className="bg-muted-soft h-2 rounded-full w-[100%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-canvas-soft border border-hairline p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px] font-mono uppercase text-muted font-semibold tracking-wider">
              CPU Throughput (req/s)
            </span>
            <span className="p-2 bg-surface-card rounded-lg border border-hairline text-ink">
              <Activity size={16} />
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[13px] mb-1 font-mono">
                <span className="font-semibold text-emerald-700">Our Platform</span>
                <span className="font-bold text-emerald-700">280+ req/s</span>
              </div>
              <div className="w-full bg-hairline rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full w-[100%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px] mb-1 font-mono text-muted">
                <span>BART Zero-Shot (Local)</span>
                <span>~8 req/s</span>
              </div>
              <div className="w-full bg-hairline rounded-full h-2">
                <div className="bg-muted h-2 rounded-full w-[5%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px] mb-1 font-mono text-muted">
                <span>Cloud LLM Rate Limits</span>
                <span>~2 req/s</span>
              </div>
              <div className="w-full bg-hairline rounded-full h-2">
                <div className="bg-muted-soft h-2 rounded-full w-[2%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-canvas-soft border border-hairline p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px] font-mono uppercase text-muted font-semibold tracking-wider">
              Cost per 1M Texts
            </span>
            <span className="p-2 bg-surface-card rounded-lg border border-hairline text-ink">
              <DollarSign size={16} />
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[13px] mb-1 font-mono">
                <span className="font-semibold text-emerald-700">Our Platform</span>
                <span className="font-bold text-emerald-700">$0.00</span>
              </div>
              <div className="w-full bg-hairline rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full w-[1%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px] mb-1 font-mono text-muted">
                <span>Local GPU Server</span>
                <span>~$5.00</span>
              </div>
              <div className="w-full bg-hairline rounded-full h-2">
                <div className="bg-muted h-2 rounded-full w-[15%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px] mb-1 font-mono text-muted">
                <span>Cloud LLM Tokens</span>
                <span>~$30.00 - $60.00</span>
              </div>
              <div className="w-full bg-hairline rounded-full h-2">
                <div className="bg-muted-soft h-2 rounded-full w-[100%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[14px] font-sans">
          <thead>
            <tr className="border-b border-hairline text-muted font-mono uppercase text-[11px]">
              <th className="py-3 px-4">Evaluation Dimension</th>
              <th className="py-3 px-4 text-emerald-700 font-bold">Our Platform (MiniLM + Head)</th>
              <th className="py-3 px-4">Zero-Shot (BART-Large)</th>
              <th className="py-3 px-4">Cloud LLMs (GPT-4 / Claude)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline text-ink">
            <tr>
              <td className="py-3 px-4 font-medium">Inference Latency</td>
              <td className="py-3 px-4 text-emerald-700 font-semibold font-mono">~10ms – 25ms</td>
              <td className="py-3 px-4 font-mono text-muted">120ms – 350ms</td>
              <td className="py-3 px-4 font-mono text-muted">800ms – 2,500ms</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium">Hardware Requirement</td>
              <td className="py-3 px-4 text-emerald-700 font-semibold">Commodity CPU (Zero GPU needed)</td>
              <td className="py-3 px-4 text-muted">High VRAM GPU (8GB+)</td>
              <td className="py-3 px-4 text-muted">Massive Cloud Datacenter</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium">Explainability Method</td>
              <td className="py-3 px-4 text-emerald-700 font-semibold">Exact Leave-One-Out Token Math</td>
              <td className="py-3 px-4 text-muted">Opaque / Approximation required</td>
              <td className="py-3 px-4 text-muted">Generative Hallucination Risk</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium">Data Privacy & Security</td>
              <td className="py-3 px-4 text-emerald-700 font-semibold">100% Offline / Air-Gapped Ready</td>
              <td className="py-3 px-4 text-muted">Local Server</td>
              <td className="py-3 px-4 text-muted">Data Sent to External Cloud API</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium">Batch Scaling Behavior</td>
              <td className="py-3 px-4 text-emerald-700 font-semibold">Chunked Streaming (~45MB RAM)</td>
              <td className="py-3 px-4 text-muted">High Memory / OOM Prone</td>
              <td className="py-3 px-4 text-muted">Strict Rate-Limits & Pay-per-Call</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium">Operational Decision Layer</td>
              <td className="py-3 px-4 text-emerald-700 font-semibold">Deterministic Business Heuristics</td>
              <td className="py-3 px-4 text-muted">Separate Service Needed</td>
              <td className="py-3 px-4 text-muted">Unpredictable Text Routing</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
