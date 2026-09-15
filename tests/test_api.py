import io
import pytest


def test_docs_and_openapi(client):
    # Swagger /docs is removed/disabled per architecture specification
    res_docs = client.get("/docs")
    assert res_docs.status_code == 404

    res_openapi = client.get("/openapi.json")
    assert res_openapi.status_code == 200
    schema = res_openapi.json()
    assert "paths" in schema
    assert "/semantic/analyze" in schema["paths"]
    assert "/semantic/batch" in schema["paths"]


def test_root_serves_frontend(client):
    res = client.get("/")
    assert res.status_code == 200
    assert "text/html" in res.headers.get("content-type", "")
    assert "<!DOCTYPE html>" in res.text or '<div id="root">' in res.text


def test_semantic_analyze_standard_flow(client, sample_comments):
    payload = {
        "text": sample_comments["bug"],
        "threshold": 0.5,
        "include_explanation": False,
    }
    # Test primary endpoint
    res = client.post("/semantic/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "intent" in data
    assert "sentiment" in data
    assert "tone" in data
    assert "urgency" in data
    assert "recommended_action" in data
    assert data["intent"]["top_intent"] == "Bug Report"
    assert data["explainability"] == []

    # Test /sementic alias endpoint
    res_alias = client.post("/sementic/analyze", json=payload)
    assert res_alias.status_code == 200
    assert res_alias.json()["intent"]["top_intent"] == "Bug Report"

    # Test backward-compatible /api endpoint
    res_legacy = client.post("/api/analyze", json=payload)
    assert res_legacy.status_code == 200
    assert res_legacy.json()["intent"]["top_intent"] == "Bug Report"


def test_semantic_analyze_with_explanation(client):
    payload = {
        "text": "Stripe checkout renewal gateway error 402.",
        "threshold": 0.5,
        "include_explanation": True,
    }
    res = client.post("/semantic/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["explainability"]) > 0
    first = data["explainability"][0]
    assert "word" in first
    assert "contribution" in first
    assert "primary_intent" in first


@pytest.mark.parametrize("invalid_text", ["", "   ", "\t\r\n"])
def test_semantic_analyze_empty_and_whitespace_validation(client, invalid_text):
    payload = {"text": invalid_text, "threshold": 0.5}
    res = client.post("/semantic/analyze", json=payload)
    assert res.status_code == 400
    assert "cannot be empty" in res.json()["detail"].lower()


def test_semantic_analyze_missing_field_422(client):
    # Completely missing required "text" key
    res = client.post("/semantic/analyze", json={"threshold": 0.5})
    assert res.status_code == 422


def test_semantic_analyze_invalid_threshold_type_422(client):
    res = client.post("/semantic/analyze", json={"text": "Hello", "threshold": "not-a-number"})
    assert res.status_code == 422


def test_semantic_batch_csv_upload_success(client):
    csv_bytes = b"text,user\nApp crashed on Android,101\nLove the speed,102\n"
    files = {"file": ("comments.csv", io.BytesIO(csv_bytes), "text/csv")}
    data = {"threshold": "0.5", "targetColumn": "text"}

    res = client.post("/semantic/batch", files=files, data=data)
    assert res.status_code == 200
    assert "text/csv" in res.headers.get("content-type", "")

    content = res.text
    assert "INTENT" in content
    assert "SENTIMENT" in content
    assert "TONE" in content
    assert "URGENCY" in content
    assert "RECOMMENDED_ACTION" in content

    # Test /sementic alias endpoint
    files_alias = {"file": ("comments.csv", io.BytesIO(csv_bytes), "text/csv")}
    res_alias = client.post("/sementic/batch", files=files_alias, data=data)
    assert res_alias.status_code == 200
    assert "INTENT" in res_alias.text


def test_semantic_batch_missing_column_error(client):
    csv_bytes = b"wrong_column,data\nfoo,bar\n"
    files = {"file": ("comments.csv", io.BytesIO(csv_bytes), "text/csv")}
    data = {"threshold": "0.5", "targetColumn": "text"}

    res = client.post("/semantic/batch", files=files, data=data)
    assert res.status_code == 200
    assert "Error:" in res.text
    assert "must contain a 'text' column" in res.text


def test_semantic_batch_missing_file_422(client):
    res = client.post("/semantic/batch", data={"threshold": "0.5", "targetColumn": "text"})
    assert res.status_code == 422


def test_cors_preflight(client):
    headers = {
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
    }
    res = client.options("/semantic/analyze", headers=headers)
    assert res.status_code == 200
    assert res.headers.get("access-control-allow-origin") == "*"


def test_import_is_fast_and_creates_no_files():
    import subprocess
    import sys
    from pathlib import Path

    backend_pkg = Path(__file__).resolve().parent.parent / "backend" / "semantic_backend"
    files_before = set(backend_pkg.rglob("*"))

    code = """
import time
t0 = time.perf_counter()
import semantic_backend.router
elapsed = time.perf_counter() - t0
assert elapsed < 1.0, f"Import took {elapsed}s"
print(f"OK:{elapsed:.4f}")
"""
    result = subprocess.run(
        [sys.executable, "-c", code],
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0, f"Import failed: {result.stderr}"
    assert "OK:" in result.stdout

    files_after = set(backend_pkg.rglob("*"))
    # Filter out pycache
    new_files = [f for f in (files_after - files_before) if "__pycache__" not in str(f)]
    assert len(new_files) == 0, f"New files created at import: {new_files}"
