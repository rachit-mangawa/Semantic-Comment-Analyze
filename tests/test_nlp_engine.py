import pytest
from semantic_backend import nlp_engine


def test_classify_intent_standard(sample_comments):
    result = nlp_engine.classify_intent(sample_comments["bug"])
    assert "labels" in result
    assert "scores" in result
    assert "top_intent" in result
    assert "top_confidence" in result
    assert result["top_intent"] in nlp_engine.get_intent_labels()
    assert 0.0 <= result["top_confidence"] <= 1.0


@pytest.mark.parametrize("empty_input", ["", "   ", "\t\n\r", "   \n  "])
def test_classify_intent_empty_and_whitespace(empty_input):
    with pytest.raises(ValueError, match="Input empty"):
        nlp_engine.classify_intent(empty_input)


def test_classify_intent_very_long_text():
    # Long text stress test (repeating sentence 100 times)
    long_text = "The application freezes whenever large reports are generated. " * 100
    res = nlp_engine.classify_intent(long_text)
    assert res["top_intent"] in nlp_engine.get_intent_labels()
    assert res["top_confidence"] > 0.0


def test_classify_intent_threshold_filtering():
    text = "Could you please add support for dark mode?"
    # High threshold: only top result should pass
    res_high = nlp_engine.classify_intent(text, threshold=0.99)
    assert len(res_high["labels"]) == 1

    # Low threshold: multiple labels can pass
    res_low = nlp_engine.classify_intent(text, threshold=0.0)
    assert len(res_low["labels"]) <= 3
    assert len(res_low["labels"]) >= 1


def test_classify_intents_batch_mixed_inputs():
    batch = [
        "Login broken",
        "",  # Empty
        "   ",  # Whitespace
        "nan",  # String nan
        "Great performance",
    ]
    results = nlp_engine.classify_intents_batch(batch, threshold=0.5)
    assert len(results) == 5

    # Valid inputs should have recognized intents
    assert results[0]["top_intent"] in nlp_engine.get_intent_labels()
    assert results[4]["top_intent"] in nlp_engine.get_intent_labels()

    # Invalid inputs should have fallback labels
    assert results[1]["top_intent"] == "INVALID_INPUT"
    assert results[2]["top_intent"] == "INVALID_INPUT"
    assert results[3]["top_intent"] == "INVALID_INPUT"


def test_analyze_sentiment_polarity():
    pos = nlp_engine.analyze_sentiment("Fantastic update, brilliant UI and great speed!")
    assert pos["label"] == "POSITIVE"
    assert pos["score"] > 0.5

    neg = nlp_engine.analyze_sentiment("Horrible update, everything crashed and was lost.")
    assert neg["label"] == "NEGATIVE"
    assert neg["score"] > 0.5


@pytest.mark.parametrize("empty_text", ["", "   ", "nan"])
def test_analyze_sentiment_empty_fallback(empty_text):
    res = nlp_engine.analyze_sentiment(empty_text)
    assert res["label"] == "NEUTRAL"


def test_analyze_sentiments_batch():
    texts = [
        "Loved the experience!",
        "Hate this bug.",
        "",
    ]
    results = nlp_engine.analyze_sentiments_batch(texts)
    assert len(results) == 3
    assert results[0]["label"] == "POSITIVE"
    assert results[1]["label"] == "NEGATIVE"
    assert results[2]["label"] == "NEUTRAL"


def test_explain_intent_single_word_and_phrases():
    # Single word
    single = nlp_engine.explain_intent("crashed")
    assert len(single) == 1
    assert single[0]["word"] == "crashed"

    # Sentence
    multi = nlp_engine.explain_intent("System crashed during checkout")
    assert len(multi) == 4
    for item in multi:
        assert "word" in item
        assert "contribution" in item
        assert "primary_intent" in item

    # Empty
    assert nlp_engine.explain_intent("") == []


@pytest.mark.asyncio
async def test_analyze_full_orchestration():
    # Without explanation
    res1 = await nlp_engine.analyze_full(
        "Can we export data to CSV?", threshold=0.5, include_explanation=False
    )
    assert "intent" in res1
    assert "sentiment" in res1
    assert res1["explainability"] == []

    # With explanation
    res2 = await nlp_engine.analyze_full(
        "Can we export data to CSV?", threshold=0.5, include_explanation=True
    )
    assert len(res2["explainability"]) > 0
