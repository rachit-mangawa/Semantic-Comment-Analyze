import React, { useState } from "react";
import { Sliders, ShieldCheck, ArrowRight, Table } from "lucide-react";

const INTENTS = ["Bug Report", "Complaint", "Feature Request", "Praise", "Question"];
const SENTIMENTS = ["NEGATIVE", "NEUTRAL", "POSITIVE"] as const;

type SentimentLabel = (typeof SENTIMENTS)[number];

const TONE_MAP: Record<string, string> = {
  "Bug Report_NEGATIVE": "Frustrated",
  "Bug Report_NEUTRAL": "Concerned",
  "Bug Report_POSITIVE": "Concerned",
  "Feature Request_POSITIVE": "Excited",
  "Feature Request_NEUTRAL": "Hopeful",
  "Feature Request_NEGATIVE": "Hopeful",
  "Praise_POSITIVE": "Appreciative",
  "Praise_NEUTRAL": "Appreciative",
  "Praise_NEGATIVE": "Appreciative",
  "Question_NEGATIVE": "Confused",
  "Question_NEUTRAL": "Curious",
  "Question_POSITIVE": "Curious",
};

const URGENCY_MAP: Record<string, "High" | "Medium" | "Low"> = {
  "Bug Report_NEGATIVE": "High",
  "Bug Report_NEUTRAL": "Medium",
  "Bug Report_POSITIVE": "Medium",
  "Feature Request_POSITIVE": "Low",
  "Feature Request_NEUTRAL": "Low",
  "Feature Request_NEGATIVE": "Low",
};

export const BusinessHeuristicsMatrix = () => {
  const [selectedIntent, setSelectedIntent] = useState<string>("Bug Report");
  const [selectedSentiment, setSelectedSentiment] = useState<SentimentLabel>("NEGATIVE");
  const [sentimentScore, setSentimentScore] = useState<number>(0.92);
  const [showTable, setShowTable] = useState<boolean>(false);

  // Compute live deterministic context mimicking evaluation.py
  const calculateTone = (intent: string, sentiment: SentimentLabel, score: number): string => {
    if (intent === "Complaint") {
      return score > 0.8 && sentiment === "NEGATIVE" ? "Angry" : "Frustrated";
    }
    return TONE_MAP[`${intent}_${sentiment}`] || "Neutral";
  };

  const calculateUrgency = (intent: string, sentiment: SentimentLabel, score: number): "High" | "Medium" | "Low" => {
    if (intent === "Complaint") {
      return score > 0.8 && sentiment === "NEGATIVE" ? "High" : "Medium";
    }
    return URGENCY_MAP[`${intent}_${sentiment}`] || "Low";
  };

  const recommendAction = (intent: string, urgency: "High" | "Medium" | "Low"): string => {
    switch (intent) {
      case "Bug Report":
        return urgency === "High" ? "Log Jira Ticket" : "Monitor Issue";
      case "Feature Request":
        return "Add to Roadmap";
      case "Complaint":
        return "Route to Support";
      case "Question":
        return "Update Docs/FAQ";
      case "Praise":
        return "Share with Team";
      default:
        return "No Action Needed";
    }
  };

  const tone = calculateTone(selectedIntent, selectedSentiment, sentimentScore);
  const urgency = calculateUrgency(selectedIntent, selectedSentiment, sentimentScore);
  const action = recommendAction(selectedIntent, urgency);

  return (
    <div className="surface-card-base w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-hairline-light">
        <div>
          <span className="eyebrow-cap">
            Deterministic Decision Engine
          </span>
          <h3 className="section-heading mt-1">
            Business Heuristics &amp; SOP Matrix
          </h3>
          <p className="text-[14px] text-shade-60 mt-1 font-sans">
            Test how probabilistic ML predictions are translated into deterministic operational decisions (<code className="text-xs font-mono bg-canvas-cream px-1.5 py-0.5 rounded border border-hairline-light text-ink">backend/semantic_backend/evaluation.py</code>).
          </p>
        </div>

        <button
          onClick={() => setShowTable(!showTable)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-pill border border-hairline-light bg-canvas-cream text-[12px] font-sans font-medium text-ink hover:bg-white transition-all active:scale-95 shadow-xs self-start md:self-auto select-none"
        >
          <Table size={14} strokeWidth={1.75} />
          <span>{showTable ? "Hide Reference Table" : "View Full Rule Table"}</span>
        </button>
      </div>

      {/* Interactive Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Intent selector */}
          <div>
            <label className="text-[11px] font-sans uppercase text-shade-50 tracking-[0.72px] block mb-2 font-semibold">
              1. Simulated ML Intent Output:
            </label>
            <div className="flex flex-wrap gap-2">
              {INTENTS.map((intent) => (
                <button
                  key={intent}
                  onClick={() => setSelectedIntent(intent)}
                  className={`px-3.5 py-1.5 rounded-pill text-[13px] font-sans font-medium transition-all duration-150 ease-out active:scale-[0.97] select-none ${
                    selectedIntent === intent
                      ? "bg-black text-white shadow-xs font-semibold"
                      : "bg-canvas-cream border border-hairline-light text-shade-60 hover:text-ink hover:bg-white"
                  }`}
                >
                  {intent}
                </button>
              ))}
            </div>
          </div>

          {/* Sentiment selector */}
          <div>
            <label className="text-[11px] font-sans uppercase text-shade-50 tracking-[0.72px] block mb-2 font-semibold">
              2. Simulated Sentiment Label:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SENTIMENTS.map((sent) => (
                <button
                  key={sent}
                  onClick={() => setSelectedSentiment(sent)}
                  className={`py-1.5 px-3 rounded-pill text-[12px] font-mono font-medium text-center transition-all duration-150 ease-out active:scale-[0.97] select-none ${
                    selectedSentiment === sent
                      ? "bg-black text-white shadow-xs font-semibold"
                      : "bg-canvas-cream border border-hairline-light text-shade-60 hover:text-ink hover:bg-white"
                  }`}
                >
                  {sent}
                </button>
              ))}
            </div>
          </div>

          {/* Sentiment Score Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-sans uppercase text-shade-50 tracking-[0.72px] font-semibold">
                3. Sentiment Confidence Score:
              </label>
              <span className="text-[12px] font-mono font-bold text-ink px-2 py-0.5 rounded bg-canvas-cream border border-hairline-light">
                {(sentimentScore * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.10"
              max="1.00"
              step="0.01"
              value={sentimentScore}
              onChange={(e) => setSentimentScore(parseFloat(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
            <span className="text-[11px] text-shade-50 block mt-1.5 font-sans">
              {selectedIntent === "Complaint"
                ? "Note: For Complaints, score > 80% with NEGATIVE sentiment triggers 'Angry' tone and 'High' urgency."
                : "Continuous score calibration against decision boundaries"}
            </span>
          </div>
        </div>

        {/* Live Output Column */}
        <div className="lg:col-span-5 bg-canvas-cream border border-hairline-light rounded-xl p-6 flex flex-col justify-between shadow-inner">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={16} className="text-emerald-700" />
              <span className="text-[11px] font-sans uppercase text-shade-50 tracking-[0.72px] font-semibold">
                Deterministic Output Context
              </span>
            </div>

            <div className="space-y-3.5">
              <div className="bg-white p-4 rounded-lg border border-hairline-light shadow-xs">
                <span className="text-[11px] font-sans uppercase text-shade-50 tracking-[0.72px] block mb-1">
                  Synthesized Tone
                </span>
                <span className="text-xl font-display font-[330] text-ink">
                  {tone}
                </span>
              </div>

              <div className="bg-white p-4 rounded-lg border border-hairline-light shadow-xs">
                <span className="text-[11px] font-sans uppercase text-shade-50 tracking-[0.72px] block mb-1">
                  Evaluated Urgency
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      urgency === "High"
                        ? "bg-rose-600 animate-pulse"
                        : urgency === "Medium"
                        ? "bg-amber-500"
                        : "bg-emerald-600"
                    }`}
                  />
                  <span className="text-xl font-display font-[330] text-ink">
                    {urgency} Priority
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-hairline-light shadow-xs">
                <span className="text-[11px] font-sans uppercase text-shade-50 tracking-[0.72px] block mb-1">
                  Recommended SOP Action
                </span>
                <div className="flex items-center gap-2 text-ink">
                  <ArrowRight size={15} className="text-shade-40 shrink-0" />
                  <span className="text-base font-sans font-semibold text-ink">
                    {action}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-hairline-light text-[11px] font-mono text-shade-50">
            Execution latency: &lt; 0.05ms (O(1) Hash Map)
          </div>
        </div>
      </div>

      {/* Full Reference Table (Collapsible) */}
      {showTable && (
        <div className="pt-6 border-t border-hairline-light">
          <span className="eyebrow-cap mb-3">
            Complete Business Rule Matrix
          </span>
          <div className="border border-hairline-light rounded-xl overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px] sm:text-[13px] font-sans whitespace-nowrap min-w-[550px]">
              <thead>
                <tr className="border-b border-hairline-light bg-canvas-cream/60 text-shade-50 font-mono uppercase text-[11px]">
                  <th className="py-2.5 px-3">Top Intent</th>
                  <th className="py-2.5 px-3">Sentiment</th>
                  <th className="py-2.5 px-3">Condition</th>
                  <th className="py-2.5 px-3">Tone</th>
                  <th className="py-2.5 px-3">Urgency</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline-light text-ink">
                <tr className="hover:bg-canvas-cream/40 transition-colors">
                  <td className="py-2 px-3 font-medium">Bug Report</td>
                  <td className="py-2 px-3 text-rose-600 font-mono">NEGATIVE</td>
                  <td className="py-2 px-3 text-shade-50">Any score</td>
                  <td className="py-2 px-3 font-semibold">Frustrated</td>
                  <td className="py-2 px-3 font-bold text-rose-600">High</td>
                  <td className="py-2 px-3">Log Jira Ticket</td>
                </tr>
                <tr className="hover:bg-canvas-cream/40 transition-colors">
                  <td className="py-2 px-3 font-medium">Bug Report</td>
                  <td className="py-2 px-3 text-shade-50 font-mono">NEUTRAL / POS</td>
                  <td className="py-2 px-3 text-shade-50">Any score</td>
                  <td className="py-2 px-3 font-semibold">Concerned</td>
                  <td className="py-2 px-3 text-amber-600">Medium</td>
                  <td className="py-2 px-3">Monitor Issue</td>
                </tr>
                <tr className="hover:bg-canvas-cream/40 transition-colors">
                  <td className="py-2 px-3 font-medium">Complaint</td>
                  <td className="py-2 px-3 text-rose-600 font-mono">NEGATIVE</td>
                  <td className="py-2 px-3 text-shade-50">Score &gt; 80%</td>
                  <td className="py-2 px-3 font-semibold text-rose-700">Angry</td>
                  <td className="py-2 px-3 font-bold text-rose-600">High</td>
                  <td className="py-2 px-3">Route to Support</td>
                </tr>
                <tr className="hover:bg-canvas-cream/40 transition-colors">
                  <td className="py-2 px-3 font-medium">Complaint</td>
                  <td className="py-2 px-3 text-shade-50 font-mono">NEUTRAL / LOW</td>
                  <td className="py-2 px-3 text-shade-50">Score &le; 80%</td>
                  <td className="py-2 px-3 font-semibold">Frustrated</td>
                  <td className="py-2 px-3 text-amber-600">Medium</td>
                  <td className="py-2 px-3">Route to Support</td>
                </tr>
                <tr className="hover:bg-canvas-cream/40 transition-colors">
                  <td className="py-2 px-3 font-medium">Feature Request</td>
                  <td className="py-2 px-3 text-emerald-600 font-mono">POSITIVE</td>
                  <td className="py-2 px-3 text-shade-50">Any score</td>
                  <td className="py-2 px-3 font-semibold">Excited</td>
                  <td className="py-2 px-3 text-emerald-600">Low</td>
                  <td className="py-2 px-3">Add to Roadmap</td>
                </tr>
                <tr className="hover:bg-canvas-cream/40 transition-colors">
                  <td className="py-2 px-3 font-medium">Praise</td>
                  <td className="py-2 px-3 text-emerald-600 font-mono">ANY</td>
                  <td className="py-2 px-3 text-shade-50">Any score</td>
                  <td className="py-2 px-3 font-semibold">Appreciative</td>
                  <td className="py-2 px-3 text-emerald-600">Low</td>
                  <td className="py-2 px-3">Share with Team</td>
                </tr>
                <tr className="hover:bg-canvas-cream/40 transition-colors">
                  <td className="py-2 px-3 font-medium">Question</td>
                  <td className="py-2 px-3 text-blue-600 font-mono">ANY</td>
                  <td className="py-2 px-3 text-shade-50">Any score</td>
                  <td className="py-2 px-3 font-semibold">Curious / Confused</td>
                  <td className="py-2 px-3 text-emerald-600">Low</td>
                  <td className="py-2 px-3">Update Docs/FAQ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
