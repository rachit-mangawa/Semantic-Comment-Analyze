import io
import os
import sys
import pytest
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.testclient import TestClient

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from semantic_backend.router import router

app = FastAPI(docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/semantic")

frontend_dist = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
)
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")


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
