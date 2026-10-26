import logging
import os
import tempfile
from functools import lru_cache
from pathlib import Path

logger = logging.getLogger("sementic")

DEFAULT_INTENT_LABELS = [
    "Bug Report",
    "Complaint",
    "Feature Request",
    "Praise",
    "Question",
]


def _get_data_dir() -> Path:
    override = os.getenv("P2_DATA_DIR")
    if override and Path(override).exists():
        return Path(override)
    return Path(__file__).parent / "data"


def resolve_data_file(filename: str) -> Path:
    override = os.getenv(f"P2_{filename.upper().replace('.', '_')}")
    if override and Path(override).exists():
        return Path(override)
    return _get_data_dir() / filename


def get_intent_labels():
    mapping_path = resolve_data_file("label_mapping.txt")
    if mapping_path.exists():
        with open(mapping_path, "r", encoding="utf-8") as f:
            return [line.strip() for line in f if line.strip()]
    return DEFAULT_INTENT_LABELS


def _get_model_cache_dir():
    return os.getenv("HF_HOME") or os.getenv("P2_MODEL_CACHE_DIR")


@lru_cache(maxsize=1)
def get_embedding_model():
    from sentence_transformers import SentenceTransformer

    cache_dir = _get_model_cache_dir()
    return SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2", cache_folder=cache_dir)


def train_head_if_missing(head_path: Path):
    import pandas as pd
    from sklearn.linear_model import LogisticRegression

    data_path = resolve_data_file("training_data.csv")
    if not data_path.exists():
        raise FileNotFoundError(f"Training data not found at {data_path}")

    df = pd.read_csv(data_path)
    X = get_embeddings_batch(df["text"].tolist())
    y = df["label"].tolist()
    clf = LogisticRegression(max_iter=1000)
    clf.fit(X, y)
    import joblib

    temp_dir = Path(tempfile.gettempdir()) / "p2"
    temp_dir.mkdir(parents=True, exist_ok=True)
    temp_head = temp_dir / "local_model_head.pkl"
    joblib.dump(clf, temp_head)
    return clf


@lru_cache(maxsize=1)
def get_classifier_head():
    import joblib

    head_path = resolve_data_file("local_model_head.pkl")
    if not head_path.exists():
        return train_head_if_missing(head_path)
    return joblib.load(head_path)



@lru_cache(maxsize=1)
def get_sentiment_model():
    from transformers import pipeline

    cache_dir = _get_model_cache_dir()
    return pipeline(
        "sentiment-analysis",
        model="cardiffnlp/twitter-roberta-base-sentiment-latest",
        device=-1,
        model_kwargs={"cache_dir": cache_dir} if cache_dir else None,
    )


def get_embeddings_batch(texts: list[str]):
    model = get_embedding_model()
    safe_texts = [t if t else "" for t in texts]
    return model.encode(safe_texts, batch_size=32)


def classify_intent(text: str, threshold: float = 0.5):
    if not text or not text.strip():
        raise ValueError("Input empty")
    return classify_intents_batch([text], threshold)[0]


def classify_intents_batch(texts: list[str], threshold: float = 0.5, embeddings=None):
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

    import numpy as np

    if embeddings is not None:
        embs = np.array([embeddings[i] for i in valid_indices])
    else:
        model = get_embedding_model()
        embs = model.encode(valid_texts, batch_size=32)

    probs_batch = clf.predict_proba(embs)

    for idx, probs in zip(valid_indices, probs_batch):
        sorted_pairs = sorted(zip(labels, probs), key=lambda x: x[1], reverse=True)
        filtered = [p for p in sorted_pairs if p[1] >= threshold] or [sorted_pairs[0]]

        results[idx] = {
            "labels": [str(item[0]) for item in filtered[:3]],
            "scores": [float(item[1]) for item in filtered[:3]],
            "all_intents": {str(item[0]): float(item[1]) for item in sorted_pairs},
            "top_intent": str(filtered[0][0]),
            "top_confidence": float(filtered[0][1]),
        }
    return results


def explain_intent(text: str):
    words = text.split()
    if not words:
        return []

    orig_res = classify_intents_batch([text])[0]
    orig_intents = orig_res.get("all_intents", {})

    masked_texts = [" ".join(words[:i] + words[i + 1 :]) for i in range(len(words))]
    masked_results = classify_intents_batch(masked_texts)

    contributions = []
    for word, res in zip(words, masked_results):
        masked_intents = res.get("all_intents", {})
        best_intent, max_drop = "None", 0.0

        for intent, orig_prob in orig_intents.items():
            drop = orig_prob - masked_intents.get(intent, 0.0)
            if drop > max_drop:
                max_drop = drop
                best_intent = intent

        contributions.append(
            {
                "word": word,
                "contribution": float(max_drop),
                "primary_intent": best_intent,
            }
        )

    return contributions


def analyze_sentiment(text: str):
    if not text or not text.strip():
        return {"label": "NEUTRAL", "score": 0.0}
    return analyze_sentiments_batch([text])[0]


def analyze_sentiments_batch(texts: list[str]):
    valid_texts = [t if t and t.strip() and t != "nan" else "Neutral" for t in texts]
    model = get_sentiment_model()
    sentiments = model(valid_texts, truncation=True, max_length=512, batch_size=32)
    return [{"label": sent["label"].upper(), "score": float(sent["score"])} for sent in sentiments]


def analyze_sync(text: str, threshold: float = 0.5, include_explanation: bool = False):
    return {
        "intent": classify_intent(text, threshold),
        "sentiment": analyze_sentiment(text),
        "explainability": explain_intent(text) if include_explanation else [],
    }


async def analyze_full(text: str, threshold: float = 0.5, include_explanation: bool = False):
    return analyze_sync(text, threshold, include_explanation)


def warmup():
    """Warm up all lazy loaders and execute one dummy inference."""
    get_intent_labels()
    get_embedding_model()
    get_classifier_head()
    get_sentiment_model()
    analyze_sync("warmup", threshold=0.5, include_explanation=False)
    return True
