import asyncio
import os
from functools import lru_cache
from typing import Any

import joblib
import numpy as np

DEFAULT_INTENT_LABELS = [
    "Bug Report",
    "Complaint",
    "Feature Request",
    "Praise",
    "Question",
]


def resolve_data_file(filename: str) -> str:
    env_override = os.getenv(f"P2_{filename.upper().replace('.', '_')}")
    if env_override and os.path.exists(env_override):
        return env_override

    pkg_dir = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.join(pkg_dir, "data", filename),
        os.path.join(pkg_dir, "..", "..", "data", filename),
        os.path.join(pkg_dir, filename),
        os.path.join("/tmp/p2", filename),
    ]
    for c in candidates:
        if os.path.exists(c):
            return os.path.abspath(c)
    return os.path.abspath(candidates[0])


def get_intent_labels() -> list[str]:
    mapping_path = resolve_data_file("label_mapping.txt")
    if os.path.exists(mapping_path):
        with open(mapping_path, "r", encoding="utf-8") as f:
            return [line.strip() for line in f if line.strip()]
    return DEFAULT_INTENT_LABELS


@lru_cache(maxsize=1)
def get_embedding_model():
    from sentence_transformers import SentenceTransformer

    cache_dir = os.getenv("P2_MODEL_CACHE_DIR", None)
    return SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2", cache_folder=cache_dir)


def train_head_if_missing(head_path: str):
    import pandas as pd
    from sklearn.linear_model import LogisticRegression

    data_path = resolve_data_file("training_data.csv")
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Training data not found at {data_path}")

    df = pd.read_csv(data_path)
    X = get_embeddings_batch(df["text"].tolist())
    y = df["label"].tolist()
    clf = LogisticRegression(max_iter=1000)
    clf.fit(X, y)
    os.makedirs(os.path.dirname(head_path), exist_ok=True)
    joblib.dump(clf, head_path)
    return clf


@lru_cache(maxsize=1)
def get_classifier_head():
    head_path = resolve_data_file("local_model_head.pkl")
    if not os.path.exists(head_path):
        return train_head_if_missing(head_path)
    return joblib.load(head_path)


@lru_cache(maxsize=1)
def get_ner_model():
    from transformers import pipeline

    model_dir = os.getenv("P2_MODEL_CACHE_DIR", None)
    return pipeline(
        "ner",
        aggregation_strategy="simple",
        device=-1,
        model_kwargs={"cache_dir": model_dir} if model_dir else None,
    )


@lru_cache(maxsize=1)
def get_sentiment_model():
    from transformers import pipeline

    model_dir = os.getenv("P2_MODEL_CACHE_DIR", None)
    return pipeline(
        "sentiment-analysis",
        model="cardiffnlp/twitter-roberta-base-sentiment-latest",
        device=-1,
        model_kwargs={"cache_dir": model_dir} if model_dir else None,
    )


def get_embeddings_batch(texts: list[str]) -> np.ndarray:
    model = get_embedding_model()
    safe_texts = [t if t else "" for t in texts]
    return model.encode(safe_texts, batch_size=32)


def classify_intent(text: str, threshold: float = 0.5) -> dict[str, Any]:
    if not text or not text.strip():
        raise ValueError("Input empty")
    return classify_intents_batch([text], threshold)[0]


def classify_intents_batch(texts: list[str], threshold: float = 0.5, embeddings=None) -> list[dict[str, Any]]:
    valid_texts, valid_indices = [], []
    for i, t in enumerate(texts):
        if t and t.strip() and t != "nan":
            valid_texts.append(t)
            valid_indices.append(i)

    results = [
        {
            "labels": ["INVALID_INPUT"],
            "scores": [0.0],
            "all_intents": {},
            "top_intent": "INVALID_INPUT",
            "top_confidence": 0.0,
        }
        for _ in texts
    ]
    if not valid_texts:
        return results

    clf = get_classifier_head()
    labels = clf.classes_

    if embeddings is not None:
        embs = np.array([embeddings[i] for i in valid_indices])
    else:
        model = get_embedding_model()
        embs = model.encode(valid_texts, batch_size=32)

    probs_batch = clf.predict_proba(embs)

    for idx, probs in zip(valid_indices, probs_batch):
        sorted_pairs = sorted(zip(labels, probs), key=lambda x: x[1], reverse=True)
        filtered = [p for p in sorted_pairs if p[1] >= threshold]
        if not filtered:
            filtered = [sorted_pairs[0]]

        results[idx] = {
            "labels": [str(item[0]) for item in filtered[:3]],
            "scores": [float(item[1]) for item in filtered[:3]],
            "all_intents": {str(item[0]): float(item[1]) for item in sorted_pairs},
            "top_intent": str(filtered[0][0]),
            "top_confidence": float(filtered[0][1]),
        }
    return results


def explain_intent(text: str) -> list[dict[str, Any]]:
    words = text.split()
    if not words:
        return []

    orig_res = classify_intents_batch([text])[0]
    orig_intents = orig_res.get("all_intents", {})

    masked_texts = []
    for i in range(len(words)):
        masked = words[:i] + words[i + 1 :]
        masked_texts.append(" ".join(masked))

    masked_results = classify_intents_batch(masked_texts)

    contributions = []
    for i, res in enumerate(masked_results):
        masked_intents = res.get("all_intents", {})

        best_intent = None
        max_drop = 0.0

        for intent, orig_prob in orig_intents.items():
            masked_prob = masked_intents.get(intent, 0.0)
            drop = orig_prob - masked_prob
            if drop > max_drop:
                max_drop = drop
                best_intent = intent

        contributions.append(
            {
                "word": words[i],
                "contribution": float(max_drop),
                "primary_intent": best_intent if best_intent else "None",
            }
        )

    return contributions


def analyze_sentiment(text: str) -> dict[str, Any]:
    if not text or not text.strip():
        return {"label": "NEUTRAL", "score": 0.0}
    return analyze_sentiments_batch([text])[0]


def analyze_sentiments_batch(texts: list[str]) -> list[dict[str, Any]]:
    valid_texts = [t if t and t.strip() and t != "nan" else "Neutral" for t in texts]
    model = get_sentiment_model()
    sentiments = model(valid_texts, truncation=True, max_length=512, batch_size=32)
    return [{"label": sent["label"].upper(), "score": float(sent["score"])} for sent in sentiments]


def extract_entities(text: str) -> list[dict[str, Any]]:
    if not text or not text.strip():
        return []
    return get_ner_model()(text[:2000])


def extract_entities_batch(texts: list[str]) -> list[list[dict[str, Any]]]:
    valid_texts = [t[:2000] if t and t.strip() and t != "nan" else "" for t in texts]
    ner = get_ner_model()
    return ner([t[:2000] for t in valid_texts], batch_size=32)


async def analyze_full(text: str, threshold: float = 0.5, include_explanation: bool = False) -> dict[str, Any]:
    intent = await asyncio.to_thread(classify_intent, text, threshold)
    sentiment = await asyncio.to_thread(analyze_sentiment, text)

    explainability = []
    if include_explanation:
        explainability = await asyncio.to_thread(explain_intent, text)

    return {
        "intent": intent,
        "sentiment": sentiment,
        "explainability": explainability,
    }
