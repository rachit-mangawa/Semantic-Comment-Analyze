from semantic_backend.nlp_engine import resolve_data_file, train_head_if_missing

if __name__ == "__main__":
    train_head_if_missing(resolve_data_file("local_model_head.pkl"))
