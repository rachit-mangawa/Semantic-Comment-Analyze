import React, { useState } from "react";
import { Sliders, ShieldCheck, ArrowRight, Table, CheckCircle2 } from "lucide-react";

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
    <div className="bg-surface-card border border-hairline rounded-2xl p-6 md:p-8 mb-16 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-hairline">
        <div>
          <span className="text-[12px] font-mono uppercase tracking-wider text-muted font-semibold">
            Deterministic Decision Engine
          </span>
          <h3 className="text-2xl font-serif font-light text-ink mt-1">
            Business Heuristics & SOP Matrix
          </h3>
          <p className="text-[14px] text-body mt-1">
            Test how probabilistic ML predictions are translated into deterministic operational decisions (<code className="text-xs font-mono bg-canvas-soft px-1.5 py-0.5 rounded">src/engine/evaluation.py</code>).
          </p>
        </div>

        <button
          onClick={() => setShowTable(!showTable)}
          className="flex items-center gap-2 pl-3 pr-3.5 py-1.5 rounded-lg border border-hairline bg-canvas-soft text-[13px] font-medium text-ink hover:bg-canvas transition-[color,background-color,transform] duration-150 ease-out enabled:active:scale-[0.96] self-start md:self-auto"
        >
          <Table size={15} strokeWidth={1.75} />
          <span>{showTable ? "Hide Reference Table" : "View Full Rule Table"}</span>
        </button>
      </div>

      {/* Interactive Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Intent selector */}
          <div>
            <label className="text-[12px] font-mono uppercase text-muted tracking-wider block mb-2 font-semibold">
              1. Simulated ML Intent Output:
            </label>
            <div className="flex flex-wrap gap-2">
              {INTENTS.map((intent) => (
                <button
                  key={intent}
                  onClick={() => setSelectedIntent(intent)}
                  className={`px-3 py-2 rounded-xl text-[13px] font-medium transition-[color,background-color,border-color,transform] duration-150 ease-out enabled:active:scale-[0.96] ${
                    selectedIntent === intent
                      ? "bg-ink text-white shadow-xs font-semibold"
                      : "bg-canvas-soft border border-hairline text-body hover:bg-canvas"
                  }`}
                >
                  {intent}
                </button>
              ))}
            </div>
          </div>

          {/* Sentiment selector */}
          <div>
            <label className="text-[12px] font-mono uppercase text-muted tracking-wider block mb-2 font-semibold">
              2. Simulated Sentiment Label:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SENTIMENTS.map((sent) => (
                <button
                  key={sent}
                  onClick={() => setSelectedSentiment(sent)}
                  className={`py-2 px-3 rounded-xl text-[13px] font-medium text-center transition-[color,background-color,border-color,transform] duration-150 ease-out enabled:active:scale-[0.96] ${
                    selectedSentiment === sent
                      ? "bg-ink text-white shadow-xs font-semibold"
                      : "bg-canvas-soft border border-hairline text-body hover:bg-canvas"
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
              <label className="text-[12px] font-mono uppercase text-muted tracking-wider font-semibold">
                3. Sentiment Confidence Score:
              </label>
              <span className="text-[13px] font-mono font-bold text-ink">
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
              className="w-full accent-ink cursor-pointer"
            />
            <span className="text-[11px] text-muted block mt-1">
              {selectedIntent === "Complaint"
                ? "Note: For Complaints, score > 80% with NEGATIVE sentiment triggers 'Angry' tone and 'High' urgency."
                : "Continuous score calibration"}
            </span>
          </div>
        </div>

        {/* Live Output Column */}
        <div className="lg:col-span-5 bg-canvas-soft border border-hairline rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={18} className="text-ink" />
              <span className="text-[12px] font-mono uppercase text-muted tracking-wider font-semibold">
                Deterministic Output Context
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-surface-card p-4 rounded-xl border border-hairline">
                <span className="text-[11px] font-mono uppercase text-muted block mb-1">
                  Synthesized Tone
                </span>
                <span className="text-xl font-serif font-medium text-ink">
                  {tone}
                </span>
              </div>

              <div className="bg-surface-card p-4 rounded-xl border border-hairline">
                <span className="text-[11px] font-mono uppercase text-muted block mb-1">
                  Evaluated Urgency
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      urgency === "High"
                        ? "bg-red-500 animate-pulse"
                        : urgency === "Medium"
                        ? "bg-orange-500"
                        : "bg-emerald-500"
                    }`}
                  />
                  <span className="text-xl font-serif font-medium text-ink">
                    {urgency} Priority
                  </span>
                </div>
              </div>

              <div className="bg-surface-card p-4 rounded-xl border border-hairline">
                <span className="text-[11px] font-mono uppercase text-muted block mb-1">
                  Recommended SOP Action
                </span>
                <div className="flex items-center gap-2 text-ink">
                  <ArrowRight size={16} className="text-muted shrink-0" />
                  <span className="text-lg font-sans font-semibold text-ink">
                    {action}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-hairline text-[11px] font-mono text-muted">
            Execution time: &lt; 0.05ms (O(1) Hash Map)
          </div>
        </div>
      </div>

      {/* Full Reference Table (Collapsible) */}
      {showTable && (
        <div className="pt-6 border-t border-hairline overflow-x-auto">
          <h4 className="text-[14px] font-mono uppercase text-muted tracking-wider font-semibold mb-4">
            Complete Business Rule Matrix
          </h4>
          <table className="w-full text-left border-collapse text-[13px] font-sans">
            <thead>
              <tr className="border-b border-hairline text-muted font-mono uppercase text-[11px]">
                <th className="py-2.5 px-3">Top Intent</th>
                <th className="py-2.5 px-3">Sentiment</th>
                <th className="py-2.5 px-3">Condition</th>
                <th className="py-2.5 px-3">Tone</th>
                <th className="py-2.5 px-3">Urgency</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline text-ink">
              <tr>
                <td className="py-2 px-3 font-medium">Bug Report</td>
                <td className="py-2 px-3 text-red-600 font-mono">NEGATIVE</td>
                <td className="py-2 px-3 text-muted">Any score</td>
                <td className="py-2 px-3 font-semibold">Frustrated</td>
                <td className="py-2 px-3 font-bold text-red-600">High</td>
                <td className="py-2 px-3">Log Jira Ticket</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">Bug Report</td>
                <td className="py-2 px-3 text-muted font-mono">NEUTRAL / POS</td>
                <td className="py-2 px-3 text-muted">Any score</td>
                <td className="py-2 px-3 font-semibold">Concerned</td>
                <td className="py-2 px-3 text-orange-600">Medium</td>
                <td className="py-2 px-3">Monitor Issue</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">Complaint</td>
                <td className="py-2 px-3 text-red-600 font-mono">NEGATIVE</td>
                <td className="py-2 px-3 text-muted">Score &gt; 80%</td>
                <td className="py-2 px-3 font-semibold text-red-700">Angry</td>
                <td className="py-2 px-3 font-bold text-red-600">High</td>
                <td className="py-2 px-3">Route to Support</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">Complaint</td>
                <td className="py-2 px-3 text-muted font-mono">NEUTRAL / LOW</td>
                <td className="py-2 px-3 text-muted">Score &le; 80%</td>
                <td className="py-2 px-3 font-semibold">Frustrated</td>
                <td className="py-2 px-3 text-orange-600">Medium</td>
                <td className="py-2 px-3">Route to Support</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">Feature Request</td>
                <td className="py-2 px-3 text-emerald-600 font-mono">POSITIVE</td>
                <td className="py-2 px-3 text-muted">Any score</td>
                <td className="py-2 px-3 font-semibold">Excited</td>
                <td className="py-2 px-3 text-emerald-600">Low</td>
                <td className="py-2 px-3">Add to Roadmap</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">Praise</td>
                <td className="py-2 px-3 text-emerald-600 font-mono">ANY</td>
                <td className="py-2 px-3 text-muted">Any score</td>
                <td className="py-2 px-3 font-semibold">Appreciative</td>
                <td className="py-2 px-3 text-emerald-600">Low</td>
                <td className="py-2 px-3">Share with Team</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium">Question</td>
                <td className="py-2 px-3 text-blue-600 font-mono">ANY</td>
                <td className="py-2 px-3 text-muted">Any score</td>
                <td className="py-2 px-3 font-semibold">Curious / Confused</td>
                <td className="py-2 px-3 text-emerald-600">Low</td>
                <td className="py-2 px-3">Update Docs/FAQ</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
