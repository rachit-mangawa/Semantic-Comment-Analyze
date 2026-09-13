import csv
import io
import os
from typing import Generator

from . import evaluation, nlp_engine

TEMP_DIR = os.getenv("P2_TEMP_DIR", "/tmp/p2")
os.makedirs(TEMP_DIR, exist_ok=True)


def stream_csv(file_obj, target_column="text") -> Generator[str, None, None]:
    try:
        decoded_file = io.TextIOWrapper(file_obj, encoding="utf-8", errors="replace")
        reader = csv.DictReader(decoded_file)
    except Exception as e:
        yield f"Error: Failed to decode file. {e!s}\n"
        return

    if not reader.fieldnames:
        yield "Error: Invalid CSV format or empty file.\n"
        return

    target_column_upper = target_column.upper()
    fieldnames_upper = [f.upper() for f in reader.fieldnames]
    if target_column_upper not in fieldnames_upper:
        yield f"Error: CSV must contain a '{target_column}' column. Found: {', '.join(reader.fieldnames)}\n"
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
    for row in reader:
        row.pop(None, None)
        chunk.append(row)
        if len(chunk) == 32:
            yield _process_chunk(chunk, target_column_upper, writer, output)
            chunk = []

    if chunk:
        yield _process_chunk(chunk, target_column_upper, writer, output)


def _process_chunk(chunk: list[dict], target_column: str, writer: csv.DictWriter, output: io.StringIO) -> str:
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

    output.seek(0)
    output.truncate(0)
    writer.writerows(chunk)
    return output.getvalue()
