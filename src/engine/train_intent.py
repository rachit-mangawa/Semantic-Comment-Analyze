import argparse
import os
import pickle
import pandas as pd
from sklearn.linear_model import LogisticRegression

try:
    from src.engine.nlp_engine import get_embeddings_batch
except ImportError:
    from nlp_engine import get_embeddings_batch


def train_intent_model(data_path: str, output_path: str, max_iter: int = 1000):
    print(f"Loading training data from {data_path}...")
    df = pd.read_csv(data_path)

    if "text" not in df.columns or "label" not in df.columns:
        raise ValueError("CSV must contain 'text' and 'label' columns.")

    print(f"Extracting embeddings for {len(df)} samples...")
    X = get_embeddings_batch(df["text"].tolist())
    y = df["label"].tolist()

    print("Training Logistic Regression classifier head...")
    clf = LogisticRegression(max_iter=max_iter)
    clf.fit(X, y)

    print(f"Saving trained intent model to {output_path}...")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "wb") as f:
        pickle.dump(clf, f)

    print("Training complete! You can now run the server.")


if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    default_data = os.path.normpath(os.path.join(base_dir, "../../data/training_data.csv"))
    default_output = os.path.normpath(os.path.join(base_dir, "../../data/local_model_head.pkl"))

    parser = argparse.ArgumentParser(description="Train the custom intent classification head.")
    parser.add_argument("--data", default=default_data, help="Path to training CSV")
    parser.add_argument("--output", default=default_output, help="Path to save the model")

    args = parser.parse_args()
    train_intent_model(args.data, args.output)
