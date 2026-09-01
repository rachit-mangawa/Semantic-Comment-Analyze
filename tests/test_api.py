import io
import pytest


def test_docs_and_openapi(client):
    res_docs = client.get("/docs")
    assert res_docs.status_code == 200

    res_openapi = client.get("/openapi.json")
    assert res_openapi.status_code == 200
    schema = res_openapi.json()
    assert "paths" in schema
    assert "/api/analyze" in schema["paths"]
    assert "/api/batch" in schema["paths"]


def test_root_serves_frontend(client):
    res = client.get("/")
    assert res.status_code == 200
    assert "text/html" in res.headers.get("content-type", "")
    assert "<!DOCTYPE html>" in res.text or "<div id=\"root\">" in res.text


def test_api_analyze_standard_flow(client, sample_comments):
    payload = {
        "text": sample_comments["bug"],
        "threshold": 0.5,
        "include_explanation": False,
    }
    res = client.post("/api/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "intent" in data
    assert "sentiment" in data
    assert "tone" in data
    assert "urgency" in data
    assert "recommended_action" in data
    assert data["intent"]["top_intent"] == "Bug Report"
    assert data["explainability"] == []


def test_api_analyze_with_explanation(client):
    payload = {
        "text": "Stripe checkout renewal gateway error 402.",
        "threshold": 0.5,
        "include_explanation": True,
    }
    res = client.post("/api/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["explainability"]) > 0
    first = data["explainability"][0]
    assert "word" in first
    assert "contribution" in first
    assert "primary_intent" in first


@pytest.mark.parametrize("invalid_text", ["", "   ", "\t\r\n"])
def test_api_analyze_empty_and_whitespace_validation(client, invalid_text):
    payload = {"text": invalid_text, "threshold": 0.5}
    res = client.post("/api/analyze", json=payload)
    assert res.status_code == 400
    assert "cannot be empty" in res.json()["detail"].lower()


def test_api_analyze_missing_field_422(client):
    # Completely missing required "text" key
    res = client.post("/api/analyze", json={"threshold": 0.5})
    assert res.status_code == 422


def test_api_analyze_invalid_threshold_type_422(client):
    res = client.post("/api/analyze", json={"text": "Hello", "threshold": "not-a-number"})
    assert res.status_code == 422


def test_api_batch_csv_upload_success(client):
    csv_bytes = b"text,user\nApp crashed on Android,101\nLove the speed,102\n"
    files = {"file": ("comments.csv", io.BytesIO(csv_bytes), "text/csv")}
    data = {"threshold": "0.5", "targetColumn": "text"}

    res = client.post("/api/batch", files=files, data=data)
    assert res.status_code == 200
    assert "text/csv" in res.headers.get("content-type", "")

    content = res.text
    assert "INTENT" in content
    assert "SENTIMENT" in content
    assert "TONE" in content
    assert "URGENCY" in content
    assert "RECOMMENDED_ACTION" in content


def test_api_batch_missing_column_error(client):
    csv_bytes = b"wrong_column,data\nfoo,bar\n"
    files = {"file": ("comments.csv", io.BytesIO(csv_bytes), "text/csv")}
    data = {"threshold": "0.5", "targetColumn": "text"}

    res = client.post("/api/batch", files=files, data=data)
    assert res.status_code == 200
    assert "Error:" in res.text
    assert "must contain a 'text' column" in res.text


def test_api_batch_missing_file_422(client):
    res = client.post("/api/batch", data={"threshold": "0.5", "targetColumn": "text"})
    assert res.status_code == 422


def test_cors_preflight(client):
    headers = {
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
    }
    res = client.options("/api/analyze", headers=headers)
    assert res.status_code == 200
    assert res.headers.get("access-control-allow-origin") == "*"
