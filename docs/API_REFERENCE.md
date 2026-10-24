# REST API Reference & Specification

Complete API reference for the Semantic Comment Analysis platform. All endpoints are hosted locally via FastAPI with OpenAPI 3.1 documentation available interactively at `/docs`.

---

## Base URL

```http
http://127.0.0.1:8000
```

---

## Endpoints Summary

| Method | Endpoint | Description | Content-Type | Response Type |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/semantic/analyze` | Single comment semantic analysis & explainability | `application/json` | `application/json` |
| `POST` | `/semantic/batch` | High-throughput streaming CSV processor | `multipart/form-data` | `text/csv` (Chunked) |
| `GET` | `/` | Web Application Static Mount (React SPA) | — | `text/html` |
| `GET` | `/docs` | Interactive Swagger API documentation | — | `text/html` |

> **Note on Aliases & Backward Compatibility:**
> - `/sementic/analyze` and `/sementic/batch` are directly supported aliases.
> - Legacy `/api/analyze` and `/api/batch` paths remain supported for backward compatibility.

---

## 1. Single Text Analysis (`POST /semantic/analyze`)

Executes intent classification, sentiment analysis, entity extraction, optional token occlusion explainability, and deterministic business context evaluation.

### Request Headers
```http
Content-Type: application/json
```

### Request Parameters

| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `text` | `string` | **Yes** | — | Raw feedback, customer comment, or support ticket. Must not be empty or whitespace. |
| `threshold` | `float` | No | `0.5` | Confidence cutoff threshold $[0.0, 1.0]$. Intents below this score are filtered out. |
| `include_explanation` | `boolean` | No | `false` | When `true`, runs the leave-one-out Occlusion Algorithm to generate token-level attribution. |

### Example Request (`curl`)
```bash
curl -X POST "http://127.0.0.1:8000/semantic/analyze" \
     -H "Content-Type: application/json" \
     -d '{
       "text": "The app freezes completely whenever I try to export reports to PDF format.",
       "threshold": 0.5,
       "include_explanation": true
     }'
```

### Response Schema (`200 OK`)

```json
{
  "text": "The app freezes completely whenever I try to export reports to PDF format.",
  "intent": {
    "top_intent": "Bug Report",
    "top_confidence": 0.9412,
    "labels": ["Bug Report", "Complaint", "Question"],
    "scores": [0.9412, 0.0418, 0.0121],
    "all_intents": {
      "Bug Report": 0.9412,
      "Complaint": 0.0418,
      "Feature Request": 0.0031,
      "Praise": 0.0018,
      "Question": 0.0121
    }
  },
  "sentiment": {
    "label": "NEGATIVE",
    "score": 0.9654
  },
  "entities": [],
  "explainability": [
    { "word": "freezes", "contribution": 0.412, "primary_intent": "Bug Report" },
    { "word": "completely", "contribution": 0.128, "primary_intent": "Bug Report" },
    { "word": "export", "contribution": 0.084, "primary_intent": "Bug Report" },
    { "word": "PDF", "contribution": 0.041, "primary_intent": "Bug Report" }
  ],
  "tone": "Frustrated",
  "urgency": "High",
  "recommended_action": "Log Jira Ticket"
}
```

### Error Responses

#### `400 Bad Request` (Empty input)
```json
{
  "detail": "Text cannot be empty"
}
```

#### `422 Unprocessable Entity` (Schema validation failure)
```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "text"],
      "msg": "Field required"
    }
  ]
}
```

---

## 2. Streaming Batch CSV Processing (`POST /semantic/batch`)

Processes multi-thousand-row CSV feedback files using a generator-based chunking pipeline. Streams annotated CSV rows back in real time over HTTP without loading the complete dataset into server RAM.

### Request Headers
```http
Content-Type: multipart/form-data
```

### Form Parameters

| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `file` | `binary` (file) | **Yes** | — | Uploaded `.csv` file. Must contain a text header column. |
| `targetColumn` | `string` | No | `"text"` | Name of the column containing feedback text. Case-insensitive matching. |
| `threshold` | `float` | No | `0.5` | Confidence cutoff threshold $[0.0, 1.0]$. |

### Example Request (`curl`)
```bash
curl -X POST "http://127.0.0.1:8000/semantic/batch" \
     -F "file=@customer_feedback.csv" \
     -F "targetColumn=feedback" \
     -F "threshold=0.5" \
     --output analyzed_feedback.csv
```

### Streaming Behavior & Appended Headers

The response stream immediately yields the CSV header followed by 32-sample micro-batches. The following metadata columns are appended:

```csv
ORIGINAL_COLS...,INTENT,CONFIDENCE,SENTIMENT,SENTIMENT_SCORE,TONE,URGENCY,RECOMMENDED_ACTION
"Your service was phenomenal today!",Praise,0.98,POSITIVE,0.99,Appreciative,Low,Share with Team
"Where can I find the billing invoices?",Question,0.91,NEUTRAL,0.85,Curious,Low,Update Docs/FAQ
"Billing charged me twice and system error 500!",Bug Report,0.95,NEGATIVE,0.97,Frustrated,High,Log Jira Ticket
```

---

## 3. Python SDK / Client Example

```python
import requests

API_URL = "http://127.0.0.1:8000/semantic/analyze"

payload = {
    "text": "The analytics exports are clean and much faster to navigate now.",
    "threshold": 0.5,
    "include_explanation": True
}

response = requests.post(API_URL, json=payload)
data = response.json()

print(f"Top Intent: {data['intent']['top_intent']} ({data['intent']['top_confidence'] * 100:.1f}%)")
print(f"Sentiment:  {data['sentiment']['label']} ({data['sentiment']['score'] * 100:.1f}%)")
print(f"Tone:       {data['tone']}")
print(f"Urgency:    {data['urgency']}")
print(f"Action:     {data['recommended_action']}")
```

---

## 4. TypeScript / React Client Example

```typescript
interface AnalysisResponse {
  intent: {
    top_intent: string;
    top_confidence: number;
    all_intents: Record<string, number>;
  };
  sentiment: {
    label: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
    score: number;
  };
  explainability: Array<{
    word: string;
    contribution: number;
    primary_intent: string;
  }>;
  tone: string;
  urgency: "High" | "Medium" | "Low";
  recommended_action: string;
}

export async function analyzeFeedback(text: string): Promise<AnalysisResponse> {
  const res = await fetch("/semantic/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      threshold: 0.5,
      include_explanation: true,
    }),
  });

  if (!res.ok) {
    throw new Error(`API Error: ${await res.text()}`);
  }

  return res.json();
}
```
