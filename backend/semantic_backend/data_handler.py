import csv
import io
import os

from . import evaluation, nlp_engine

MAX_BATCH_BYTES = 10 * 1024 * 1024  # 10MB limit


class BoundedStream(io.RawIOBase):
    """Wraps an underlying binary stream to enforce a strict byte limit and prevent DoS."""

    def __init__(self, stream, max_bytes: int = MAX_BATCH_BYTES):
        self._stream = stream
        self._max_bytes = max_bytes
        self._bytes_read = 0

    def readable(self) -> bool:
        return True

    def readinto(self, b) -> int:
        chunk = self._stream.read(len(b))
        if not chunk:
            return 0
        n = len(chunk)
        self._bytes_read += n
        if self._bytes_read > self._max_bytes:
            raise ValueError(f"File exceeds maximum allowed size of {self._max_bytes} bytes")
        b[:n] = chunk
        return n


def _sanitize_csv_cell(val):
    """Sanitize CSV cells against CSV / Formula Injection (CWE-1236).

    Prepend single quote to values starting with =, +, -, @, tab, or carriage return.
    """
    if isinstance(val, str) and val.startswith(("=", "+", "-", "@", "\t", "\r")):
        return f"'{val}"
    return val


def stream_csv(file_obj, target_column="text", max_bytes: int = MAX_BATCH_BYTES):
    try:
        bounded_stream = BoundedStream(file_obj, max_bytes=max_bytes)
        decoded_file = io.TextIOWrapper(bounded_stream, encoding="utf-8", errors="replace")
        reader = csv.DictReader(decoded_file)
    except Exception as e:
        yield f"Error: Failed to decode file. {e!s}\n"
        return

    try:
        fieldnames = reader.fieldnames
    except ValueError as e:
        yield f"Error: {e!s}\n"
        return
    except Exception as e:
        yield f"Error: Failed to read CSV headers. {e!s}\n"
        return

    if not fieldnames:
        yield "Error: Invalid CSV format or empty file.\n"
        return

    target_column_upper = target_column.upper()
    fieldnames_upper = [f.upper() for f in fieldnames]
    if target_column_upper not in fieldnames_upper:
        yield f"Error: CSV must contain a '{target_column}' column. Found: {', '.join(fieldnames)}\n"
        return

    reader.fieldnames = fieldnames_upper

    output = io.StringIO()
    new_fields = fieldnames_upper + [
        "INTENT",
        "CONFIDENCE",
        "SENTIMENT",
        "SENTIMENT_SCORE",
        "TONE",
        "URGENCY",
        "RECOMMENDED_ACTION",
    ]
    writer = csv.DictWriter(output, fieldnames=new_fields, extrasaction="ignore")
    writer.writeheader()
    yield output.getvalue()

    chunk = []
    row_count = 0
    max_rows = int(os.getenv("P2_MAX_BATCH_ROWS", "10000"))

    try:
        for row in reader:
            row_count += 1
            if row_count > max_rows:
                yield f"Error: Exceeded maximum allowed rows ({max_rows}).\n"
                return
            row.pop(None, None)
            text_val = row.get(target_column_upper, "")
            if len(text_val) > 5000:
                row[target_column_upper] = text_val[:5000]
            chunk.append(row)
            if len(chunk) == 32:
                yield _process_chunk(chunk, target_column_upper, writer, output)
                chunk = []

        if chunk:
            yield _process_chunk(chunk, target_column_upper, writer, output)
    except ValueError as e:
        yield f"Error: {e!s}\n"
        return
    except Exception as e:
        yield f"Error: Failed during CSV processing. {e!s}\n"
        return


def _process_chunk(chunk, target_column, writer, output):
    texts = [row.get(target_column, "") for row in chunk]

    embeddings = nlp_engine.get_embeddings_batch(texts)
    intent_results = nlp_engine.classify_intents_batch(texts, embeddings=embeddings)
    sentiment_results = nlp_engine.analyze_sentiments_batch(texts)

    for i, row in enumerate(chunk):
        intent = intent_results[i]["top_intent"]
        sentiment = sentiment_results[i]

        ctx = evaluation.evaluate_business_context(intent, sentiment)

        row["INTENT"] = intent
        row["CONFIDENCE"] = f"{intent_results[i]['top_confidence']:.2f}"
        row["SENTIMENT"] = sentiment["label"]
        row["SENTIMENT_SCORE"] = f"{sentiment['score']:.2f}"
        row["TONE"] = ctx["tone"]
        row["URGENCY"] = ctx["urgency"]
        row["RECOMMENDED_ACTION"] = ctx["recommended_action"]

        for k, v in list(row.items()):
            row[k] = _sanitize_csv_cell(v)

    output.seek(0)
    output.truncate(0)
    writer.writerows(chunk)
    return output.getvalue()
