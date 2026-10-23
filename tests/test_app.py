"""Convenience entry point to run pytest directly via `python tests/test_app.py`."""
import sys
import pytest

if __name__ == "__main__":
    sys.exit(pytest.main(["-v", "tests"]))
