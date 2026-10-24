import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Terminal, Code2, Server } from "lucide-react";

export const ApiReferenceView = () => {
  const [activeEndpoint, setActiveEndpoint] = useState<"analyze" | "batch">("analyze");
  const [activeLang, setActiveLang] = useState<"curl" | "python" | "typescript">("curl");
  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCodeSnippet = () => {
    if (activeEndpoint === "analyze") {
      switch (activeLang) {
        case "curl":
          return `curl -X POST "http://127.0.0.1:8000/semantic/analyze" \\
     -H "Content-Type: application/json" \\
     -d '{
       "text": "The app freezes completely whenever I click export on large PDF tables!",
       "threshold": 0.5,
       "include_explanation": true
     }'`;
        case "python":
          return `import requests

url = "http://127.0.0.1:8000/semantic/analyze"
payload = {
    "text": "The app freezes completely whenever I click export on large PDF tables!",
    "threshold": 0.5,
    "include_explanation": True
}

response = requests.post(url, json=payload)
data = response.json()

print(f"Top Intent: {data['intent']['top_intent']} ({data['intent']['top_confidence'] * 100:.1f}%)")
print(f"Sentiment:  {data['sentiment']['label']} ({data['sentiment']['score'] * 100:.1f}%)")
print(f"Tone:       {data['tone']}")
print(f"Urgency:    {data['urgency']}")
print(f"Action:     {data['recommended_action']}")`;
        case "typescript":
          return `const res = await fetch("/semantic/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: "The app freezes completely whenever I click export on large PDF tables!",
    threshold: 0.5,
    include_explanation: true,
  }),
});

const data = await res.json();
console.log("Analysis Result:", data);`;
      }
    } else {
      switch (activeLang) {
        case "curl":
          return `curl -X POST "http://127.0.0.1:8000/semantic/batch" \\
     -F "file=@customer_tickets.csv" \\
     -F "targetColumn=feedback" \\
     -F "threshold=0.5" \\
     --output analyzed_results.csv`;
        case "python":
          return `import requests

url = "http://127.0.0.1:8000/semantic/batch"

with open("customer_tickets.csv", "rb") as f:
    files = {"file": f}
    data = {"targetColumn": "feedback", "threshold": 0.5}
    response = requests.post(url, files=files, data=data, stream=True)
    
    with open("analyzed_results.csv", "wb") as out:
        for chunk in response.iter_content(chunk_size=4096):
            out.write(chunk)

print("Batch streaming processing complete.")`;
        case "typescript":
          return `const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("targetColumn", "feedback");
formData.append("threshold", "0.5");

const res = await fetch("/semantic/batch", {
  method: "POST",
  body: formData,
});

const reader = res.body?.getReader();
// Stream processed CSV chunks in real time...`;
      }
    }
  };

  const sampleJsonResponse = `{
  "intent": {
    "labels": ["Bug Report"],
    "scores": [0.962],
    "all_intents": {
      "Bug Report": 0.962,
      "Complaint": 0.024,
      "Feature Request": 0.007,
      "Question": 0.004,
      "Praise": 0.003
    },
    "top_intent": "Bug Report",
    "top_confidence": 0.962
  },
  "sentiment": {
    "label": "NEGATIVE",
    "score": 0.941
  },
  "explainability": [
    { "word": "freezes", "contribution": 0.482, "primary_intent": "Bug Report" },
    { "word": "export", "contribution": 0.045, "primary_intent": "Bug Report" }
  ],
  "tone": "Frustrated",
  "urgency": "High",
  "recommended_action": "Log Jira Ticket"
}`;

  return (
    <div className="bg-surface-card border border-hairline rounded-2xl p-6 md:p-8 mb-16 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-hairline">
        <div>
          <span className="text-[12px] font-mono uppercase tracking-wider text-muted font-semibold">
            API Documentation
          </span>
          <h3 className="text-2xl font-serif font-light text-ink mt-1">
            REST API & Integration Specifications
          </h3>
          <p className="text-[14px] text-body mt-1">
            Directly connect your microservices, CRM pipelines, or ETL jobs to the Semantic Comment Analysis API.
          </p>
        </div>

        {/* Endpoint Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveEndpoint("analyze")}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-mono transition-[color,background-color,border-color,transform] duration-150 ease-out enabled:active:scale-[0.96] ${
              activeEndpoint === "analyze"
                ? "bg-ink text-white font-semibold shadow-xs"
                : "bg-canvas-soft border border-hairline text-body hover:bg-canvas"
            }`}
          >
            POST /semantic/analyze
          </button>
          <button
            onClick={() => setActiveEndpoint("batch")}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-mono transition-[color,background-color,border-color,transform] duration-150 ease-out enabled:active:scale-[0.96] ${
              activeEndpoint === "batch"
                ? "bg-ink text-white font-semibold shadow-xs"
                : "bg-canvas-soft border border-hairline text-body hover:bg-canvas"
            }`}
          >
            POST /semantic/batch
          </button>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="bg-canvas-soft border border-hairline rounded-2xl overflow-hidden mb-8 shadow-xs">
        <div className="flex items-center justify-between px-4 py-3 border-b border-hairline bg-surface-card">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveLang("curl")}
              className={`px-2.5 py-1 rounded text-[12px] font-mono font-medium transition-[color,background-color,transform] duration-150 ease-out enabled:active:scale-[0.96] ${
                activeLang === "curl" ? "bg-ink text-white" : "text-muted hover:text-ink"
              }`}
            >
              cURL
            </button>
            <button
              onClick={() => setActiveLang("python")}
              className={`px-2.5 py-1 rounded text-[12px] font-mono font-medium transition-[color,background-color,transform] duration-150 ease-out enabled:active:scale-[0.96] ${
                activeLang === "python" ? "bg-ink text-white" : "text-muted hover:text-ink"
              }`}
            >
              Python
            </button>
            <button
              onClick={() => setActiveLang("typescript")}
              className={`px-2.5 py-1 rounded text-[12px] font-mono font-medium transition-[color,background-color,transform] duration-150 ease-out enabled:active:scale-[0.96] ${
                activeLang === "typescript" ? "bg-ink text-white" : "text-muted hover:text-ink"
              }`}
            >
              TypeScript
            </button>
          </div>

          <button
            onClick={() => copyToClipboard(getCodeSnippet())}
            className="flex items-center gap-1.5 pl-2.5 pr-3 py-1 rounded-md border border-hairline bg-canvas-soft text-[12px] font-mono text-body hover:text-ink hover:bg-canvas transition-[color,background-color,border-color,transform] duration-150 ease-out enabled:active:scale-[0.96]"
            title="Copy snippet to clipboard"
          >
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0.25, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                className="flex items-center gap-1.5 text-emerald-700"
              >
                <Check size={13} strokeWidth={2} />
                <span>Copied</span>
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0.25, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                className="flex items-center gap-1.5"
              >
                <Copy size={13} strokeWidth={1.75} />
                <span>Copy</span>
              </motion.span>
            )}
          </button>
        </div>

        <div className="p-4 overflow-x-auto">
          <pre className="text-[13px] font-mono text-ink leading-relaxed">
            <code>{getCodeSnippet()}</code>
          </pre>
        </div>
      </div>

      {/* Schemas breakdown */}
      {activeEndpoint === "analyze" ? (
        <div>
          <h4 className="text-[14px] font-mono uppercase text-muted tracking-wider font-semibold mb-3">
            Expected JSON Response Schema
          </h4>
          <div className="bg-canvas-soft border border-hairline rounded-2xl p-4 overflow-x-auto">
            <pre className="text-[13px] font-mono text-ink leading-relaxed">
              <code>{sampleJsonResponse}</code>
            </pre>
          </div>
        </div>
      ) : (
        <div>
          <h4 className="text-[14px] font-mono uppercase text-muted tracking-wider font-semibold mb-3">
            Streaming CSV Output Schema
          </h4>
          <div className="bg-canvas-soft border border-hairline rounded-2xl p-4 overflow-x-auto">
            <pre className="text-[13px] font-mono text-ink leading-relaxed">
              <code>{`ORIGINAL_COLUMNS...,INTENT,CONFIDENCE,SENTIMENT,SENTIMENT_SCORE,TONE,URGENCY,RECOMMENDED_ACTION
"Your application crashed when exporting to PDF",Bug Report,0.96,NEGATIVE,0.94,Frustrated,High,Log Jira Ticket
"Can we add automated weekly exports?",Feature Request,0.91,POSITIVE,0.85,Excited,Low,Add to Roadmap
"Billing charged me twice and no reply from support",Complaint,0.95,NEGATIVE,0.92,Angry,High,Route to Support`}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
