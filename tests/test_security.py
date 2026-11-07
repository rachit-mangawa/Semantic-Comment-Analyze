import io
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

from backend.dev import app as dev_app
from semantic_backend import data_handler, nlp_engine


def test_security_headers_present():
    """Verify production security headers are set by the dev/server middleware."""
    with TestClient(dev_app) as client:
        res = client.get("/semantic/health")
        assert res.status_code == 200
        assert res.headers.get("X-Content-Type-Options") == "nosniff"
        assert res.headers.get("X-Frame-Options") == "DENY"
        assert res.headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
        assert res.headers.get("Cross-Origin-Opener-Policy") == "same-origin"
        assert "camera=()" in res.headers.get("Permissions-Policy", "")
        assert "default-src 'self'" in res.headers.get("Content-Security-Policy", "")


def test_csv_formula_injection_sanitization():
    """Verify CSV formula injection triggers (=, +, -, @) are sanitized with a leading quote."""
    csv_input = (
        "text,user\n"
        "=cmd|' /C calc'!A0,attacker\n"
        "@SUM(1,2),financial_user\n"
        "-10+20,math_user\n"
        "+cmd|' /C notepad'!A0,attacker2\n"
        "Normal harmless comment,good_user\n"
    )
    file_obj = io.BytesIO(csv_input.encode("utf-8"))
    stream = data_handler.stream_csv(file_obj, target_column="text")
    output = "".join(list(stream))

    # Formulas must be escaped with a single quote so spreadsheets do not execute them
    assert "'=cmd|' /C calc'!A0" in output
    assert "'@SUM(1,2)" in output
    assert "'-10+20" in output
    assert "'+cmd|' /C notepad'!A0" in output
    # Normal comment remains intact without prepended single quote
    assert "Normal harmless comment" in output
    assert "'Normal harmless comment" not in output


def test_path_traversal_prevention_in_data_resolver():
    """Verify path traversal attempts in resolve_data_file raise ValueError."""
    with pytest.raises(ValueError, match="Path traversal detected"):
        nlp_engine.resolve_data_file("../../../etc/passwd")

    with pytest.raises(ValueError, match="Path traversal detected"):
        nlp_engine.resolve_data_file("..\\..\\windows\\system32\\calc.exe")


def test_batch_oversized_stream_bounded():
    """Verify BoundedStream stops reading and yields an error if file exceeds max_bytes."""
    # Create an in-memory stream of 2 KB and test with a 1 KB limit
    csv_bytes = b"text\n" + b"Sample comment text line\n" * 100
    file_obj = io.BytesIO(csv_bytes)
    stream = data_handler.stream_csv(file_obj, target_column="text", max_bytes=500)
    output = "".join(list(stream))

    assert "Error:" in output
    assert "exceeds maximum allowed size" in output


def test_target_column_length_rejection(client):
    """Verify excessively long targetColumn names are rejected with 400 to prevent DoS."""
    csv_bytes = b"text\nhello\n"
    files = {"file": ("comments.csv", io.BytesIO(csv_bytes), "text/csv")}
    oversized_col = "a" * 300
    res = client.post("/semantic/batch", files=files, data={"targetColumn": oversized_col})
    assert res.status_code == 400
    assert "Invalid targetColumn name" in res.json()["detail"]


def test_internal_error_hiding(monkeypatch, client):
    """Verify internal exception tracebacks are NOT leaked in 500 error responses."""
    def broken_analyze(*args, **kwargs):
        raise RuntimeError("SecretDatabaseException: /var/secrets/key.pem not found")

    monkeypatch.setattr(nlp_engine, "analyze_sync", broken_analyze)

    payload = {"text": "Testing error hiding", "threshold": 0.5}
    res = client.post("/semantic/analyze", json=payload)
    assert res.status_code == 500
    # Must be generic and not leak internal details
    assert res.json()["detail"] == "Internal server error"
    assert "/var/secrets" not in res.text


def test_explain_intent_bounded_words():
    """Verify explain_intent caps the number of words processed to prevent CPU starvation."""
    # 200 words
    long_text = "word " * 200
    explanations = nlp_engine.explain_intent(long_text, max_words=50)
    assert len(explanations) == 50

