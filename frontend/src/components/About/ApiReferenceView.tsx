import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Terminal, Code2 } from "lucide-react";
import { API_BASE } from "@/config";

export const ApiReferenceView = () => {
  const [activeEndpoint, setActiveEndpoint] = useState<"analyze" | "batch" | "health">("analyze");
  const [activeLang, setActiveLang] = useState<"curl" | "python" | "typescript">("curl");
  const [copied, setCopied] = useState<boolean>(false);

  const baseEndpoint = API_BASE;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCodeSnippet = () => {
    if (activeEndpoint === "analyze") {
      switch (activeLang) {
        case "curl":
          return `curl -X POST "${baseEndpoint}/semantic/analyze" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "The app freezes completely whenever I click export on large PDF tables!",
    "threshold": 0.5,
    "include_explanation": true
  }'`;
        case "python":
          return `import requests

url = "${baseEndpoint}/semantic/analyze"
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
          return `const res = await fetch(\`\${API_BASE}/semantic/analyze\`, {
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
    } else if (activeEndpoint === "batch") {
      switch (activeLang) {
        case "curl":
          return `curl -X POST "${baseEndpoint}/semantic/batch" \\
  -F "file=@customer_tickets.csv" \\
  -F "targetColumn=feedback" \\
  -F "threshold=0.5" \\
  --output analyzed_results.csv`;
        case "python":
          return `import requests

url = "${baseEndpoint}/semantic/batch"

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

const res = await fetch(\`\${API_BASE}/semantic/batch\`, {
  method: "POST",
  body: formData,
});

const reader = res.body?.getReader();
// Stream processed CSV chunks in real time...`;
      }
    } else {
      switch (activeLang) {
        case "curl":
          return `curl -X GET "${baseEndpoint}/semantic/health"`;
        case "python":
          return `import requests

url = "${baseEndpoint}/semantic/health"
response = requests.get(url)
print(response.json())`;
        case "typescript":
          return `const res = await fetch(\`\${API_BASE}/semantic/health\`);
const data = await res.json();
console.log("Health Status:", data);`;
      }
    }
  };

  const sampleJsonResponse = `{
  "intent": {
    "top_intent": "Bug Report",
    "top_confidence": 0.962,
    "labels": ["Bug Report", "Complaint", "Feature Request", "Praise", "Question"],
    "scores": [0.962, 0.021, 0.010, 0.004, 0.003],
    "all_intents": {
      "Bug Report": 0.962,
      "Complaint": 0.021,
      "Feature Request": 0.010,
      "Praise": 0.004,
      "Question": 0.003
    }
  },
  "sentiment": {
    "label": "NEGATIVE",
    "score": 0.941
  },
  "explainability": [
    { "word": "application", "contribution": 0.045, "primary_intent": "Bug Report" },
    { "word": "crashes", "contribution": 0.482, "primary_intent": "Bug Report" },
    { "word": "export", "contribution": 0.065, "primary_intent": "Bug Report" }
  ],
  "tone": "Frustrated",
  "urgency": "High",
  "recommended_action": "Log Jira Ticket"
}`;

  return (
    <div className="surface-card-base w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-hairline-light">
        <div>
          <span className="eyebrow-cap">
            API Documentation
          </span>
          <h3 className="section-heading mt-1">
            REST API &amp; Integration Specifications
          </h3>
          <p className="text-[14px] text-shade-60 mt-1 font-sans">
            Directly connect your microservices, CRM pipelines, or ETL jobs to the Semantic Comment Analysis API.
          </p>
        </div>

        {/* Endpoint Selector Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveEndpoint("analyze")}
            className={`px-3.5 py-1.5 rounded-pill text-[12px] font-mono transition-all duration-150 ease-out active:scale-[0.97] select-none ${
              activeEndpoint === "analyze"
                ? "bg-black text-white font-semibold shadow-xs"
                : "bg-canvas-cream border border-hairline-light text-shade-60 hover:text-ink hover:bg-white"
            }`}
          >
            POST /semantic/analyze
          </button>
          <button
            onClick={() => setActiveEndpoint("batch")}
            className={`px-3.5 py-1.5 rounded-pill text-[12px] font-mono transition-all duration-150 ease-out active:scale-[0.97] select-none ${
              activeEndpoint === "batch"
                ? "bg-black text-white font-semibold shadow-xs"
                : "bg-canvas-cream border border-hairline-light text-shade-60 hover:text-ink hover:bg-white"
            }`}
          >
            POST /semantic/batch
          </button>
          <button
            onClick={() => setActiveEndpoint("health")}
            className={`px-3.5 py-1.5 rounded-pill text-[12px] font-mono transition-all duration-150 ease-out active:scale-[0.97] select-none ${
              activeEndpoint === "health"
                ? "bg-black text-white font-semibold shadow-xs"
                : "bg-canvas-cream border border-hairline-light text-shade-60 hover:text-ink hover:bg-white"
            }`}
          >
            GET /semantic/health
          </button>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="bg-canvas-cream border border-hairline-light rounded-xl overflow-hidden shadow-inner">
        <div className="flex items-center justify-between px-4 py-3 border-b border-hairline-light bg-white">
          <div className="flex items-center gap-1.5">
            {(["curl", "python", "typescript"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-1 rounded-pill text-[11px] font-mono transition-all active:scale-95 select-none ${
                  activeLang === lang
                    ? "bg-black text-white font-semibold shadow-xs"
                    : "text-shade-60 hover:text-ink hover:bg-canvas-cream"
                }`}
              >
                {lang === "curl" ? "cURL" : lang === "python" ? "Python" : "TypeScript"}
              </button>
            ))}
          </div>

          <button
            onClick={() => copyToClipboard(getCodeSnippet())}
            className="flex items-center gap-1.5 px-3 py-1 rounded-pill border border-hairline-light bg-canvas-cream text-[11px] font-mono text-shade-60 hover:text-ink hover:bg-white transition-all active:scale-95 shadow-xs"
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
                <Check size={12} strokeWidth={2} />
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
                <Copy size={12} strokeWidth={1.75} />
                <span>Copy</span>
              </motion.span>
            )}
          </button>
        </div>

        <div className="p-5 overflow-x-auto">
          <pre className="text-[13px] font-mono text-ink leading-relaxed">
            <code>{getCodeSnippet()}</code>
          </pre>
        </div>
      </div>

      {/* Schemas breakdown */}
      {activeEndpoint === "analyze" ? (
        <div className="pt-2">
          <span className="eyebrow-cap mb-3">
            Expected JSON Response Schema
          </span>
          <div className="bg-canvas-cream border border-hairline-light rounded-xl p-5 overflow-x-auto shadow-inner">
            <pre className="text-[12px] font-mono text-ink leading-relaxed">
              <code>{sampleJsonResponse}</code>
            </pre>
          </div>
        </div>
      ) : activeEndpoint === "batch" ? (
        <div className="pt-2">
          <span className="eyebrow-cap mb-3">
            Streaming CSV Output Schema
          </span>
          <div className="bg-canvas-cream border border-hairline-light rounded-xl p-5 overflow-x-auto shadow-inner">
            <pre className="text-[12px] font-mono text-ink leading-relaxed">
              <code>{`ORIGINAL_COLUMNS...,INTENT,CONFIDENCE,SENTIMENT,SENTIMENT_SCORE,TONE,URGENCY,RECOMMENDED_ACTION
"Your application crashed when exporting to PDF",Bug Report,0.96,NEGATIVE,0.94,Frustrated,High,Log Jira Ticket
"Can we add automated weekly exports?",Feature Request,0.91,POSITIVE,0.85,Excited,Low,Add to Roadmap
"Billing charged me twice and no reply from support",Complaint,0.95,NEGATIVE,0.92,Angry,High,Route to Support`}</code>
            </pre>
          </div>
        </div>
      ) : (
        <div className="pt-2">
          <span className="eyebrow-cap mb-3">
            Health Check Response Schema
          </span>
          <div className="bg-canvas-cream border border-hairline-light rounded-xl p-5 overflow-x-auto shadow-inner">
            <pre className="text-[12px] font-mono text-ink leading-relaxed">
              <code>{`{
  "status": "healthy",
  "service": "semantic_backend",
  "models_loaded": {
    "embedding": true,
    "classifier_head": true,
    "sentiment": true
  }
}`}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
