# REST API reference and specification

This document specifies the HTTP endpoints for the Semantic Comment Analysis backend. You can access the API locally or via the hosted Hugging Face Space.

## Base URLs

- Local development: `http://127.0.0.1:8000`
- Hosted deployment: `https://idkhowtocodefr-hf-backend.hf.space`

Interactive OpenAPI documentation runs at `/docs` when the server is started locally.

## Endpoints overview

| Method | Endpoint | Request format | Response format | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/semantic/analyze` | `application/json` | `application/json` | Analyzes single feedback text with optional token attribution |
| `POST` | `/semantic/batch` | `multipart/form-data` | `text/csv` (streamed) | Streams processed CSV rows in 32-sample micro-batches |
| `GET` | `/semantic/health` | None | `application/json` | Returns service health and in-memory model status |

## 1. Single comment analysis (`POST /semantic/analyze`)

Evaluates input text for intent, sentiment, token attribution (explainability), and business action rules.

### Headers

```http
Content-Type: application/json
```

### Request body

| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `text` | string | Yes | None | Feedback or comment string, up to 5,000 characters. Must not be empty. |
| `threshold` | float | No | `0.5` | Minimum confidence score (0.0 to 1.0) required to include a label in top predictions. |
| `include_explanation` | boolean | No | `false` | When true, runs token-level leave-one-out occlusion to compute word attribution. |

### Example request

```bash
curl -X POST "http://127.0.0.1:8000/semantic/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The app freezes completely whenever I click export on large PDF tables.",
    "threshold": 0.5,
    "include_explanation": true
  }'
```

### Success response (`200 OK`)

```json
{
  "text": "The app freezes completely whenever I click export on large PDF tables.",
  "intent": {
    "top_intent": "Bug Report",
    "top_confidence": 0.9412,
    "labels": ["Bug Report", "Complaint"],
    "scores": [0.9412, 0.0418],
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
  "explainability": [
    {
      "word": "freezes",
      "contribution": 0.412,
      "primary_intent": "Bug Report"
    },
    {
      "word": "completely",
      "contribution": 0.128,
      "primary_intent": "Bug Report"
    },
    {
      "word": "export",
      "contribution": 0.084,
      "primary_intent": "Bug Report"
    }
  ],
  "tone": "Frustrated",
  "urgency": "High",
  "recommended_action": "Log Jira Ticket"
}
```

### Error responses

#### `400 Bad Request`

Returned when the text input is missing or consists only of whitespace.

```json
{
  "detail": "Text cannot be empty"
}
```

#### `422 Unprocessable Entity`

Returned when payload validation fails (for example, missing body or incorrect field types).

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

## 2. Streaming batch processing (`POST /semantic/batch`)

Processes CSV files using Python generators. It streams annotated rows back to the client in 32-sample micro-batches rather than accumulating the entire dataset in RAM.

### Headers

```http
Content-Type: multipart/form-data
```

### Form fields

| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `file` | file | Yes | None | CSV file upload (maximum 10 MB). Must contain a header row. |
| `targetColumn` | string | No | `"text"` | Name of the column containing the text to evaluate (case-insensitive). |
| `threshold` | float | No | `0.5` | Minimum confidence cutoff (0.0 to 1.0). |

### Example request

```bash
curl -X POST "http://127.0.0.1:8000/semantic/batch" \
  -F "file=@customer_tickets.csv" \
  -F "targetColumn=feedback" \
  -F "threshold=0.5" \
  --output analyzed_results.csv
```

### Output format

The response stream writes the original CSV headers followed by seven computed columns:

```csv
ORIGINAL_COLS...,INTENT,CONFIDENCE,SENTIMENT,SENTIMENT_SCORE,TONE,URGENCY,RECOMMENDED_ACTION
"The export button drops connection on big tables",Bug Report,0.96,NEGATIVE,0.94,Frustrated,High,Log Jira Ticket
"Can we add automated weekly exports?",Feature Request,0.91,POSITIVE,0.85,Excited,Low,Add to Roadmap
"Billing charged me twice and no reply from support",Complaint,0.95,NEGATIVE,0.92,Angry,High,Route to Support
```

## 3. Service health check (`GET /semantic/health`)

Checks if the FastAPI service is running and confirms whether PyTorch and scikit-learn models are loaded in memory.

### Example request

```bash
curl -X GET "http://127.0.0.1:8000/semantic/health"
```

### Success response (`200 OK`)

```json
{
  "status": "healthy",
  "service": "semantic_backend",
  "models_loaded": {
    "embedding": true,
    "classifier_head": true,
    "sentiment": true
  }
}
```

## 4. Code integration examples

### Python

```python
import requests

API_URL = "http://127.0.0.1:8000/semantic/analyze"

payload = {
    "text": "The app freezes completely whenever I click export on large PDF tables.",
    "threshold": 0.5,
    "include_explanation": True,
}

response = requests.post(API_URL, json=payload, timeout=30)
response.raise_for_status()
data = response.json()

print(f"Top Intent: {data['intent']['top_intent']} ({data['intent']['top_confidence'] * 100:.1f}%)")
print(f"Sentiment:  {data['sentiment']['label']} ({data['sentiment']['score'] * 100:.1f}%)")
print(f"Action:     {data['recommended_action']}")
```

### TypeScript / Browser

```typescript
const API_BASE = "http://127.0.0.1:8000";

export async function analyzeFeedback(text: string) {
  const response = await fetch(`${API_BASE}/semantic/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      threshold: 0.5,
      include_explanation: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${await response.text()}`);
  }

  return response.json();
}
```
