"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  FileText,
  SlidersHorizontal,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Database
} from "lucide-react";

const SAMPLE_CSV_CONTENT = `id,text,source
1,"The application crashes every time I click export on large PDF tables!",zendesk
2,"Please add automated webhook notifications for ticket status updates.",github
3,"We were billed twice this month and support has not responded after 48 hours.",email
4,"The new interface is clean, responsive, and much easier to navigate.",twitter
5,"Where can I download past invoices and manage team seat allocations?",intercom
6,"Critical memory leak occurs when running background batch exports over 500 rows.",github
7,"Would love to see dark mode support and keyboard shortcuts for rapid triage.",forum
8,"Your refund policy was completely misleading and I demand a manager response immediately.",trustpilot`;

const INTENT_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  "Bug Report": { bg: "bg-red-500/10", text: "text-red-700", border: "border-red-500/20" },
  "Complaint": { bg: "bg-orange-500/10", text: "text-orange-700", border: "border-orange-500/20" },
  "Feature Request": { bg: "bg-purple-500/10", text: "text-purple-700", border: "border-purple-500/20" },
  "Praise": { bg: "bg-emerald-500/10", text: "text-emerald-700", border: "border-emerald-500/20" },
  "Question": { bg: "bg-blue-500/10", text: "text-blue-700", border: "border-blue-500/20" },
};

// RFC-4180 compliant CSV row parser handling quotes and embedded commas
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(cur.trim());
      cur = "";
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
}

export const BatchProcessingView = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetColumn, setTargetColumn] = useState("text");
  const [threshold, setThreshold] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  const [headerRow, setHeaderRow] = useState<string[]>([]);
  const [processedCount, setProcessedCount] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      resetResults();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".csv")) {
        setFile(droppedFile);
        resetResults();
      } else {
        setError("Please upload a valid CSV file (.csv).");
      }
    }
  };

  const resetResults = () => {
    setDownloadUrl(null);
    setPreviewRows([]);
    setHeaderRow([]);
    setProcessedCount(0);
    setError("");
    setElapsedMs(null);
  };

  const handleLoadSample = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: "text/csv;charset=utf-8;" });
    const sampleFile = new File([blob], "sample_customer_feedback.csv", { type: "text/csv" });
    setFile(sampleFile);
    setTargetColumn("text");
    resetResults();
  };

  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample_feedback_benchmark.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleProcess = async () => {
    if (!file || loading) return;
    setLoading(true);
    resetResults();
    const t0 = performance.now();
    setStartTime(t0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("threshold", threshold.toString());
      formData.append("targetColumn", targetColumn);
      formData.append("column", targetColumn);

      const res = await fetch("/semantic/batch", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Batch streaming processing failed.");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("ReadableStream is not supported in this browser.");

      const decoder = new TextDecoder("utf-8");
      let csvAccumulator = "";
      let parsedHeader: string[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        csvAccumulator += decoder.decode(value, { stream: true });
        const rawLines = csvAccumulator.split("\n").filter((l) => l.trim().length > 0);

        if (rawLines.length > 0) {
          if (parsedHeader.length === 0) {
            parsedHeader = parseCSVRow(rawLines[0]);
            setHeaderRow(parsedHeader);
          }

          const parsedDataRows = rawLines.slice(1).map(parseCSVRow);
          setPreviewRows(parsedDataRows);
          setProcessedCount(parsedDataRows.length);
          setElapsedMs(Math.round(performance.now() - t0));
        }
      }

      csvAccumulator += decoder.decode();
      setElapsedMs(Math.round(performance.now() - t0));

      const blob = new Blob([csvAccumulator], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Batch processing failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Universal Page Header */}
      <PageHeader
        eyebrow="High-Throughput Streaming Engine"
        title="Batch CSV Processing"
        description="Stream thousands of customer comments through SentenceTransformer embeddings and Cardiff Twitter-RoBERTa sentiment models with chunked HTTP streaming."
        badge={
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono tracking-wider text-ink uppercase bg-canvas-soft border border-hairline rounded-md tabular-nums select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            32-Sample Batches
          </span>
        }
      />

      {/* Main Configuration Card */}
      <div className="bg-surface-card border border-hairline rounded-2xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
        {/* Sample dataset fast-start bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-canvas-soft border border-hairline rounded-xl">
          <div className="flex items-center gap-2.5">
            <Sparkles size={16} strokeWidth={1.75} className="text-muted shrink-0" />
            <span className="text-[13px] font-sans text-body">
              Don&apos;t have a file ready? Use our pre-built test benchmark:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSample}
              className="px-3 py-1.5 rounded-lg text-[12px] font-sans font-medium bg-surface-card border border-hairline text-ink hover:bg-canvas transition-[color,background-color,border-color,transform] duration-150 ease-out enabled:active:scale-[0.96] shadow-2xs"
            >
              Load Sample (8 Rows)
            </button>
            <button
              onClick={handleDownloadSample}
              className="px-3 py-1.5 rounded-lg text-[12px] font-sans font-medium text-body hover:text-ink hover:bg-canvas-soft transition-colors enabled:active:scale-[0.96]"
            >
              Download CSV
            </button>
          </div>
        </div>

        {/* Drag & Drop File Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-[border-color,background-color] duration-150 select-none ${
            isDragOver
              ? "border-ink bg-surface-strong"
              : file
              ? "border-emerald-600/40 bg-emerald-500/5"
              : "border-hairline-strong bg-canvas-soft/60 hover:border-muted hover:bg-canvas-soft"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {file ? (
            <div className="flex items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                <FileSpreadsheet size={24} strokeWidth={1.75} />
              </div>
              <div className="text-left">
                <p className="text-[16px] font-sans font-semibold text-ink">{file.name}</p>
                <p className="text-[12px] font-mono text-muted tabular-nums">
                  {(file.size / 1024).toFixed(1)} KB • Ready for streaming analysis
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-surface-card border border-hairline text-muted flex items-center justify-center mb-3 shadow-2xs">
                <Upload size={20} strokeWidth={1.75} />
              </div>
              <p className="text-[15px] font-sans font-medium text-ink">
                Drag and drop your customer comments CSV here
              </p>
              <p className="text-[13px] font-sans text-muted mt-1">
                or click to browse from your computer (UTF-8 formatted .csv)
              </p>
            </div>
          )}
        </div>

        {/* Parameter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Target Column Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-sans font-medium text-ink">
                Target Text Column
              </label>
              <span className="text-[11px] font-mono text-muted">Column header name</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={targetColumn}
                onChange={(e) => setTargetColumn(e.target.value)}
                placeholder="e.g. text, feedback, comment"
                className="w-full bg-canvas-soft rounded-lg px-3.5 py-2.5 text-[14px] font-mono text-ink border border-hairline focus:border-ink focus:bg-white focus:outline-none transition-[border-color,background-color] duration-150"
              />
            </div>
            <p className="text-[12px] text-muted">
              Specify which column contains the natural language feedback to analyze.
            </p>
          </div>

          {/* Confidence Threshold Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-sans font-medium text-ink">
                Confidence Threshold
              </label>
              <span className="text-[13px] font-mono font-bold text-ink tabular-nums">
                {threshold.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.90"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full accent-ink cursor-pointer mt-2"
            />
            <p className="text-[12px] text-muted">
              Minimum probability required for multi-class intent assignment.
            </p>
          </div>
        </div>

        {/* Action Button & Live Progress Telemetry */}
        <div className="pt-4 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleProcess}
              disabled={!file || loading}
              className="flex items-center justify-center gap-2 pl-5 pr-6 py-2.5 rounded-xl font-sans text-[14px] font-medium bg-ink text-white hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-[background-color,transform,opacity] duration-150 ease-out enabled:active:scale-[0.96] shadow-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Streaming Analysis...</span>
                </>
              ) : (
                <>
                  <Play size={15} strokeWidth={2} />
                  <span>Start Batch Processing</span>
                </>
              )}
            </button>

            {file && !loading && (
              <button
                onClick={() => {
                  setFile(null);
                  resetResults();
                }}
                className="p-2.5 rounded-xl border border-hairline text-muted hover:text-ink hover:bg-canvas-soft transition-colors enabled:active:scale-[0.96]"
                title="Reset batch configuration"
              >
                <RotateCcw size={15} strokeWidth={1.75} />
              </button>
            )}
          </div>

          {/* Streaming throughput counters */}
          {loading && (
            <div className="flex items-center gap-3 text-[12px] font-mono text-muted bg-canvas-soft border border-hairline px-3.5 py-2 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>
                Processed <strong className="text-ink tabular-nums">{processedCount}</strong> rows
              </span>
              {elapsedMs && (
                <>
                  <span>•</span>
                  <span className="tabular-nums">{(elapsedMs / 1000).toFixed(1)}s</span>
                </>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-center gap-2.5">
            <AlertCircle size={16} strokeWidth={1.75} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results Live Stream Preview Table */}
      <AnimatePresence>
        {previewRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-hairline">
              <div className="flex items-baseline gap-3">
                <h3 className="text-2xl font-serif font-light text-ink">
                  Processed Results
                </h3>
                <span className="text-[12px] font-mono text-muted tabular-nums">
                  {processedCount} rows streaming • {elapsedMs ? `${elapsedMs}ms total` : ""}
                </span>
              </div>

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={`analyzed_${file?.name || "batch_results.csv"}`}
                  className="inline-flex items-center gap-2 pl-3.5 pr-4 py-2 rounded-xl text-[13px] font-sans font-medium bg-ink text-white hover:bg-black transition-[background-color,transform] duration-150 ease-out enabled:active:scale-[0.96] shadow-sm self-start sm:self-auto"
                >
                  <Download size={14} strokeWidth={2} />
                  <span>Download Full CSV Output</span>
                </a>
              )}
            </div>

            {/* Scrollable Data Table with Sticky Header */}
            <div className="bg-surface-card border border-hairline rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-[13px] font-sans whitespace-nowrap">
                  <thead className="sticky top-0 z-10 bg-surface-strong/95 backdrop-blur-xs border-b border-hairline text-ink select-none">
                    <tr>
                      {headerRow.map((header, i) => (
                        <th
                          key={i}
                          className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider font-semibold text-muted"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {previewRows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="hover:bg-canvas-soft/80 transition-colors"
                      >
                        {row.map((cell, colIdx) => {
                          const colName = (headerRow[colIdx] || "").toUpperCase();

                          // Intent Column Badging
                          if (colName === "INTENT") {
                            const badge = INTENT_BADGES[cell] || {
                              bg: "bg-surface-strong",
                              text: "text-ink",
                              border: "border-hairline",
                            };
                            return (
                              <td key={colIdx} className="px-4 py-3">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium border ${badge.bg} ${badge.text} ${badge.border}`}
                                >
                                  {cell}
                                </span>
                              </td>
                            );
                          }

                          // Sentiment Column Badging
                          if (colName === "SENTIMENT") {
                            const isPos = cell === "POSITIVE";
                            const isNeg = cell === "NEGATIVE";
                            return (
                              <td key={colIdx} className="px-4 py-3">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                                    isPos
                                      ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                                      : isNeg
                                      ? "text-red-700 bg-red-50 border border-red-200"
                                      : "text-muted bg-canvas-soft border border-hairline"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      isPos
                                        ? "bg-emerald-600"
                                        : isNeg
                                        ? "bg-red-600"
                                        : "bg-muted"
                                    }`}
                                  />
                                  {cell}
                                </span>
                              </td>
                            );
                          }

                          // Numerical Confidence Score
                          if (colName === "CONFIDENCE" || colName === "SENTIMENT_SCORE") {
                            const num = parseFloat(cell);
                            return (
                              <td
                                key={colIdx}
                                className="px-4 py-3 font-mono text-[12px] tabular-nums text-ink"
                              >
                                {!isNaN(num) ? `${(num * 100).toFixed(1)}%` : cell}
                              </td>
                            );
                          }

                          // Urgency Column
                          if (colName === "URGENCY") {
                            return (
                              <td key={colIdx} className="px-4 py-3">
                                <span
                                  className={`inline-flex items-center gap-1.5 text-[12px] font-mono font-medium ${
                                    cell === "High"
                                      ? "text-red-700"
                                      : cell === "Medium"
                                      ? "text-orange-700"
                                      : "text-emerald-700"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      cell === "High"
                                        ? "bg-red-600"
                                        : cell === "Medium"
                                        ? "bg-orange-500"
                                        : "bg-emerald-600"
                                    }`}
                                  />
                                  {cell}
                                </span>
                              </td>
                            );
                          }

                          // Action Route Column
                          if (colName === "RECOMMENDED_ACTION") {
                            return (
                              <td key={colIdx} className="px-4 py-3 font-sans text-ink">
                                <span className="inline-flex items-center gap-1 text-[12px] font-medium bg-canvas-soft border border-hairline px-2 py-0.5 rounded">
                                  <ArrowRight size={11} className="text-muted" />
                                  <span>{cell}</span>
                                </span>
                              </td>
                            );
                          }

                          // Default Text Content
                          return (
                            <td
                              key={colIdx}
                              className="px-4 py-3 text-body max-w-xs truncate"
                              title={cell}
                            >
                              {cell}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
