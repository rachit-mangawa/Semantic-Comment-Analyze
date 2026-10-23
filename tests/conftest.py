import io
import os
import sys
import pytest
from fastapi.testclient import TestClient

# Ensure repo root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.api.server import app


@pytest.fixture(scope="session")
def client():
    """Shared TestClient instance across test session."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def sample_comments():
    """Representative real-world comments for each intent category."""
    return {
        "bug": "Every time I click the checkout button, the application crashes with a 500 error.",
        "complaint": "The customer support has been unresponsive for three days straight. Very frustrating.",
        "feature": "It would be fantastic if we could export the analytics charts directly to PNG or SVG.",
        "praise": "The new interface is so clean, intuitive, and blisteringly fast. Kudos to the team!",
        "question": "Where can I find my invoice history and billing receipts for last year?",
    }


@pytest.fixture
def make_csv_file():
    """Factory fixture to create in-memory CSV file objects."""
    def _create(headers, rows):
        import csv
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(headers)
        for row in rows:
            writer.writerow(row)
        return io.BytesIO(output.getvalue().encode("utf-8"))
    return _create
