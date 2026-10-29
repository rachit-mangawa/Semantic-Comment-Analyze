"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
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
  ArrowRight,
  Database,
  Clock,
} from "lucide-react";
import { API_BASE } from "@/config";

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
  "Bug Report": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  "Complaint": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "Feature Request": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  "Praise": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Question": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
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
  const [loadingSeconds, setLoadingSeconds] = useState(0);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  const [headerRow, setHeaderRow] = useState<string[]>([]);
  const [processedCount, setProcessedCount] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [downloadUrl]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (loading) {
      setLoadingSeconds(0);
      interval = setInterval(() => {
        setLoadingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setLoadingSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

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
    setDownloadUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
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

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
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

      const res = await fetch(`${API_BASE}/semantic/batch`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorText = await res.text();
        let message = `HTTP ${res.status}: Batch processing failed`;
        if (errorText && !errorText.trim().startsWith("<")) {
          try {
            const data = JSON.parse(errorText);
            message = data.detail ? `HTTP ${res.status}: ${data.detail}` : `HTTP ${res.status}: ${errorText}`;
          } catch {
            message = `HTTP ${res.status}: ${errorText}`;
          }
        } else if (res.status === 405) {
          message = "HTTP 405 Method Not Allowed: Check endpoint routing.";
        } else if (res.status === 502 || res.status === 503 || res.status === 504) {
          message = `HTTP ${res.status}: Waking up the server, first request can take a minute. Please retry shortly.`;
        }
        throw new Error(message);
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

          const dataLines = rawLines.slice(1);
          setProcessedCount(dataLines.length);

          const previewParsed = dataLines.slice(0, 100).map((l) => parseCSVRow(l));
          setPreviewRows(previewParsed);
        }
      }

      setElapsedMs(Math.round(performance.now() - t0));
      const finalBlob = new Blob([csvAccumulator], { type: "text/csv;charset=utf-8;" });
      setDownloadUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(finalBlob);
      });
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "AbortError") {
        return;
      }
      if (e instanceof TypeError && e.message.toLowerCase().includes("fetch")) {
        setError(
          `Network / CORS Error: Failed to reach backend at ${API_BASE}/semantic/batch. The server may be waking up, offline, or cross-origin headers may be missing.`
        );
      } else {
        setError(e instanceof Error ? e.message : "Batch streaming execution encountered an error.");
      }
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="page-container">
      {/* Transactional Page Header */}
      <PageHeader
        eyebrow="Constant-Memory Architecture"
        title="Batch Processing Pipeline"
        description="Stream large customer feedback CSV archives through chunked 32-sample embedding batches without exceeding ~45MB of RAM."
        badge={
          <span className="pill-tag-mint select-none">
            <Database size={13} strokeWidth={2} />
            <span>Chunked HTTP Generator</span>
          </span>
        }
      />

      {/* Main Upload & Configuration Surface Card (Level 3 Elevation) */}
      <div className="surface-card-base flex flex-col gap-6">
        {/* Sample Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-hairline-light">
          <div>
            <span className="text-[12px] font-sans uppercase tracking-[0.72px] font-medium text-shade-50 block mb-1">
              Sample Feedback Dataset
            </span>
            <p className="text-[14px] text-shade-60">
              Test with our curated 8-row benchmark dataset covering all 5 intent classes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline-light"
              size="sm"
              onClick={handleLoadSample}
              icon={<FileText size={14} />}
            >
              Load Sample CSV
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadSample}
              className="text-shade-60 hover:text-black"
              icon={<Download size={14} />}
            >
              Download Sample
            </Button>
          </div>
        </div>

        {/* Drag & Drop File Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 sm:p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-150 select-none overflow-hidden ${
            isDragOver
              ? "border-black bg-white"
              : file
              ? "border-emerald-600/40 bg-emerald-50/30"
              : "border-hairline-strong bg-canvas-cream hover:border-black/40 hover:bg-white"
          }`}
        >
          <label htmlFor="batch-file-input" className="sr-only">
            Upload CSV File
          </label>
          <input
            id="batch-file-input"
            name="csvFile"
            aria-label="Upload CSV File"
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {file ? (
            <div className="flex items-center gap-3 sm:gap-4 max-w-full min-w-0 px-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-pill bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs">
                <FileSpreadsheet size={20} strokeWidth={1.75} className="sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-[14px] sm:text-[16px] font-sans font-semibold text-ink truncate max-w-full" title={file.name}>
                  {file.name}
                </p>
                <p className="text-[11px] sm:text-[12px] font-mono text-shade-50 tabular-nums leading-tight mt-0.5 truncate max-w-full">
                  {(file.size / 1024).toFixed(1)} KB <span className="text-shade-30">•</span> <span className="text-emerald-700 font-medium">Ready for streaming analysis</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-pill bg-white border border-hairline-light text-shade-50 flex items-center justify-center mb-3 shadow-sm">
                <Upload size={20} strokeWidth={1.75} />
              </div>
              <p className="text-[15px] font-sans font-medium text-ink">
                Drag and drop your customer comments CSV here
              </p>
              <p className="text-[13px] font-sans text-shade-50 mt-1">
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
              <label htmlFor="target-column-input" className="text-[13px] font-sans font-medium text-ink">
                Target Text Column
              </label>
              <span className="text-[11px] font-mono text-shade-50">Column header name</span>
            </div>
            <div className="relative">
              <input
                id="target-column-input"
                name="targetColumn"
                aria-label="Target Text Column"
                type="text"
                value={targetColumn}
                onChange={(e) => setTargetColumn(e.target.value)}
                placeholder="e.g. text, feedback, comment"
                className="w-full bg-canvas-cream rounded-md px-3.5 py-2.5 text-[14px] font-mono text-ink border border-hairline-light focus:border-black focus:bg-white focus:outline-none transition-colors duration-150"
              />
            </div>
            <p className="text-[12px] text-shade-50 font-sans">
              Specify which column contains the natural language feedback to analyze.
            </p>
          </div>

          {/* Confidence Threshold Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="batch-threshold-slider" className="text-[13px] font-sans font-medium text-ink flex items-center gap-2">
                <span>Confidence Threshold</span>
              </label>
              <span className="text-[12px] font-mono font-bold text-ink tabular-nums px-2 py-0.5 rounded bg-white border border-hairline-light shadow-xs">
                {threshold.toFixed(2)}
              </span>
            </div>
            <input
              id="batch-threshold-slider"
              name="threshold"
              aria-label="Confidence Threshold"
              type="range"
              min="0.10"
              max="0.90"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full accent-black cursor-pointer mt-1"
            />
            {/* Quick Presets */}
            <div className="flex items-center justify-between gap-1.5 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { label: "Permissive", val: 0.35 },
                  { label: "Balanced", val: 0.50 },
                  { label: "Strict", val: 0.75 },
                ].map((p) => {
                  const isCurrent = Math.abs(threshold - p.val) < 0.02;
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setThreshold(p.val)}
                      className={`px-2 py-0.5 rounded-pill text-[11px] font-sans transition-all active:scale-95 ${
                        isCurrent
                          ? "bg-black text-white font-semibold shadow-xs"
                          : "bg-white border border-hairline-light text-shade-60 hover:text-black hover:border-shade-40"
                      }`}
                    >
                      {p.label} ({p.val})
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="text-[11px] text-shade-50 font-sans mt-0.5">
              Minimum calibrated confidence required for deterministic intent routing.
            </p>
          </div>
        </div>

        {/* Action Button & Processing Progress */}
        <div className="pt-5 border-t border-hairline-light flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              onClick={handleProcess}
              disabled={!file || loading}
              className="w-full sm:w-auto"
              icon={
                loading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <Play size={15} strokeWidth={2} />
                )
              }
            >
              {loading
                ? loadingSeconds >= 5
                  ? `Waking Space (${loadingSeconds}s)...`
                  : `Streaming (${loadingSeconds}s)...`
                : "Start Batch Processing"}
            </Button>

            {file && !loading && (
              <button
                onClick={() => {
                  setFile(null);
                  resetResults();
                }}
                className="p-2.5 rounded-pill border border-hairline-light text-shade-60 hover:text-ink hover:bg-canvas-cream transition-colors active:scale-95 shrink-0"
                title="Reset batch configuration"
              >
                <RotateCcw size={15} />
              </button>
            )}
          </div>

          {/* Streaming throughput counters */}
          {loading && (
            <div className="flex items-center gap-3 text-[12px] font-mono text-shade-60 bg-canvas-cream border border-hairline-light px-4 py-2 rounded-pill">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>
                Processed <strong className="text-ink tabular-nums">{processedCount}</strong> rows
              </span>
              <span>•</span>
              <span className="tabular-nums">{loadingSeconds}s elapsed</span>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-[13px] flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={18} className="shrink-0 text-rose-600 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-950 mb-0.5">Batch Processing Failed</p>
                <p className="leading-relaxed text-rose-800">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError("")}
              className="text-[12px] font-mono text-rose-600 hover:text-rose-900 underline ml-2 shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Results Live Stream Preview Table or Streaming Skeleton */}
      <AnimatePresence mode="wait">
        {loading && previewRows.length === 0 ? (
          <motion.div
            key="batch-loading-skeleton"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col gap-4"
          >
            <div className="surface-card-base p-6 flex flex-col gap-5 border border-hairline-light shadow-level-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-hairline-light">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
                  </span>
                  <span className="text-[13px] font-mono font-semibold text-ink uppercase tracking-wider">
                    Streaming CSV Analysis (32-Sample Chunks)
                  </span>
                </div>
                <div className="text-[11px] font-mono text-shade-60">
                  Constant RAM Bound: ~45MB
                </div>
              </div>

              {/* Cold start reassurance banner for 60-180s Hugging Face Space boots */}
              {loadingSeconds >= 5 && (
                <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-lg flex items-center justify-between text-[12px] text-amber-900 font-sans shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <Clock size={15} className="text-amber-700 animate-spin shrink-0" />
                    <span>
                      Waking up the server, first request can take a minute (~60–180s on initial wake). Streaming chunks will initiate as soon as the container is ready...
                    </span>
                  </div>
                  <span className="font-mono font-bold tabular-nums px-2.5 py-1 bg-amber-100 rounded border border-amber-300 shrink-0 ml-3">
                    {loadingSeconds}s elapsed
                  </span>
                </div>
              )}

              {/* Shimmering Table Headers & Rows Skeleton */}
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-3 pb-2 border-b border-hairline-light">
                  <div className="h-4 rounded bg-canvas-cream shimmer-mask" />
                  <div className="h-4 rounded bg-canvas-cream shimmer-mask" />
                  <div className="h-4 rounded bg-canvas-cream shimmer-mask" />
                  <div className="h-4 rounded bg-canvas-cream shimmer-mask" />
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="grid grid-cols-4 gap-3 py-2 border-b border-hairline-light/50">
                    <div className="h-5 rounded bg-canvas-cream/80 shimmer-mask col-span-2" />
                    <div className="h-5 w-24 rounded-pill bg-canvas-cream shimmer-mask" />
                    <div className="h-5 w-16 rounded bg-canvas-cream shimmer-mask" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : previewRows.length > 0 ? (
          <motion.div
            key="batch-results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-hairline-light">
              <div className="flex items-baseline gap-3">
                <h3 className="text-2xl font-display font-[330] text-ink">
                  Processed Results
                </h3>
                <span className="text-[12px] font-mono text-shade-50 tabular-nums">
                  {processedCount} rows streaming • {elapsedMs ? `${elapsedMs}ms total` : ""}
                </span>
              </div>

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={`analyzed_${file?.name || "batch_results.csv"}`}
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-pill text-[12px] sm:text-[13px] font-sans font-semibold bg-aloe-10 text-ink hover:bg-[#aef5c5] transition-all duration-150 active:scale-95 shadow-sm w-full sm:w-auto self-start sm:self-auto"
                >
                  <Download size={14} strokeWidth={2} />
                  <span>Download Full CSV Output</span>
                </a>
              )}
            </div>

            {/* Scrollable Data Table with Level 3 Elevation */}
            <div className="bg-white border border-hairline-light rounded-xl overflow-hidden shadow-level-3">
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-[12px] sm:text-[13px] font-sans whitespace-nowrap min-w-[500px]">
                  <thead className="sticky top-0 z-10 bg-canvas-cream/95 backdrop-blur-xs border-b border-hairline-light text-ink select-none">
                    <tr>
                      {headerRow.map((header, i) => (
                        <th
                          key={i}
                          className="px-4 py-3 font-sans text-[12px] uppercase tracking-[0.72px] font-semibold text-shade-50"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-light">
                    {previewRows.map((row, rowIdx) => (
                      <motion.tr
                        key={rowIdx}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15, delay: Math.min(rowIdx * 0.015, 0.25) }}
                        className="hover:bg-canvas-cream/80 transition-colors"
                      >
                        {row.map((cell, colIdx) => {
                          const colName = (headerRow[colIdx] || "").toUpperCase();

                          // Intent Column Badging
                          if (colName === "INTENT") {
                            const badge = INTENT_BADGES[cell] || {
                              bg: "bg-canvas-cream",
                              text: "text-ink",
                              border: "border-hairline-light",
                            };
                            return (
                              <td key={colIdx} className="px-4 py-3">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-pill text-[12px] font-sans font-medium border ${badge.bg} ${badge.text} ${badge.border}`}
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
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-[12px] font-mono font-medium ${
                                    isPos
                                      ? "text-emerald-800 bg-emerald-50 border border-emerald-200"
                                      : isNeg
                                      ? "text-rose-800 bg-rose-50 border border-rose-200"
                                      : "text-shade-60 bg-canvas-cream border border-hairline-light"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      isPos
                                        ? "bg-emerald-600"
                                        : isNeg
                                        ? "bg-rose-600"
                                        : "bg-shade-40"
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
                                      ? "text-rose-700 font-semibold"
                                      : cell === "Medium"
                                      ? "text-amber-700"
                                      : "text-emerald-700"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      cell === "High"
                                        ? "bg-rose-600"
                                        : cell === "Medium"
                                        ? "bg-amber-500"
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
                                <span className="inline-flex items-center gap-1 text-[12px] font-medium bg-canvas-cream border border-hairline-light px-2.5 py-0.5 rounded-pill">
                                  <ArrowRight size={11} className="text-shade-40" />
                                  <span>{cell}</span>
                                </span>
                              </td>
                            );
                          }

                          // Default Text Content
                          return (
                            <td
                              key={colIdx}
                              className="px-4 py-3 text-shade-60 max-w-xs truncate"
                              title={cell}
                            >
                              {cell}
                            </td>
                          );
                        })}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
