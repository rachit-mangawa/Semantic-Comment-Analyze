import csv
import io
import pytest
from semantic_backend import data_handler


def test_stream_csv_valid_single_chunk():
    csv_data = "text\nCheckout crashed on Safari.\nLove the new design!\n"
    file_obj = io.BytesIO(csv_data.encode("utf-8"))

    stream = data_handler.stream_csv(file_obj, target_column="text")
    output = "".join(list(stream))

    reader = csv.DictReader(io.StringIO(output))
    rows = list(reader)

    assert len(rows) == 2
    for row in rows:
        assert "TEXT" in row
        assert "INTENT" in row
        assert "CONFIDENCE" in row
        assert "SENTIMENT" in row
        assert "SENTIMENT_SCORE" in row
        assert "TONE" in row
        assert "URGENCY" in row
        assert "RECOMMENDED_ACTION" in row


def test_stream_csv_multi_chunk_pagination():
    # Generate 70 rows to verify chunking (>32 items per chunk)
    header = "comment_body,author\n"
    rows_text = "\n".join(
        [f"Sample comment number {i} with feedback,user_{i}" for i in range(70)]
    )
    full_csv = header + rows_text + "\n"
    file_obj = io.BytesIO(full_csv.encode("utf-8"))

    stream = data_handler.stream_csv(file_obj, target_column="comment_body")
    output = "".join(list(stream))

    reader = csv.DictReader(io.StringIO(output))
    rows = list(reader)

    assert len(rows) == 70
    assert rows[0]["COMMENT_BODY"] == "Sample comment number 0 with feedback"
    assert rows[69]["COMMENT_BODY"] == "Sample comment number 69 with feedback"
    assert "INTENT" in rows[69]


def test_stream_csv_case_insensitive_target_column():
    csv_data = "FEEDBACK\nNeed export button\n"
    file_obj = io.BytesIO(csv_data.encode("utf-8"))

    # Caller passes lowercase "feedback", file has uppercase "FEEDBACK"
    stream = data_handler.stream_csv(file_obj, target_column="feedback")
    output = "".join(list(stream))

    reader = csv.DictReader(io.StringIO(output))
    rows = list(reader)

    assert len(rows) == 1
    assert "INTENT" in rows[0]


def test_stream_csv_unquoted_commas_and_extra_fields():
    # Unquoted commas create extra unmapped columns in CSV
    csv_data = "text\nGreat update, love it, highly recommend!\n"
    file_obj = io.BytesIO(csv_data.encode("utf-8"))

    stream = data_handler.stream_csv(file_obj, target_column="text")
    output = "".join(list(stream))

    reader = csv.DictReader(io.StringIO(output))
    rows = list(reader)

    assert len(rows) == 1
    assert "INTENT" in rows[0]


def test_stream_csv_unicode_and_emojis():
    csv_data = "text\nApp keeps crashing! 💥🔥🔥\nTrès bon travail, merci beaucoup 🎉\n"
    file_obj = io.BytesIO(csv_data.encode("utf-8"))

    stream = data_handler.stream_csv(file_obj, target_column="text")
    output = "".join(list(stream))

    reader = csv.DictReader(io.StringIO(output))
    rows = list(reader)

    assert len(rows) == 2
    assert "INTENT" in rows[0]
    assert "INTENT" in rows[1]


def test_stream_csv_missing_column_error():
    csv_data = "author,date\nAlice,2026-10-23\n"
    file_obj = io.BytesIO(csv_data.encode("utf-8"))

    stream = data_handler.stream_csv(file_obj, target_column="nonexistent")
    output = "".join(list(stream))

    assert output.startswith("Error:")
    assert "nonexistent" in output


def test_stream_csv_empty_file():
    file_obj = io.BytesIO(b"")
    stream = data_handler.stream_csv(file_obj)
    output = "".join(list(stream))

    assert output.startswith("Error:")
