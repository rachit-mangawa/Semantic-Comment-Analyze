import pytest
from src.engine import evaluation


@pytest.mark.parametrize(
    "intent,sentiment,expected_tone",
    [
        ("Bug Report", {"label": "NEGATIVE", "score": 0.9}, "Frustrated"),
        ("Bug Report", {"label": "NEUTRAL", "score": 0.5}, "Concerned"),
        ("Bug Report", {"label": "POSITIVE", "score": 0.8}, "Concerned"),
        ("Feature Request", {"label": "POSITIVE", "score": 0.9}, "Excited"),
        ("Feature Request", {"label": "NEUTRAL", "score": 0.5}, "Hopeful"),
        ("Feature Request", {"label": "NEGATIVE", "score": 0.7}, "Hopeful"),
        ("Complaint", {"label": "NEGATIVE", "score": 0.85}, "Angry"),
        ("Complaint", {"label": "NEGATIVE", "score": 0.80}, "Frustrated"),  # Boundary <= 0.8
        ("Complaint", {"label": "NEGATIVE", "score": 0.79}, "Frustrated"),
        ("Complaint", {"label": "NEUTRAL", "score": 0.5}, "Frustrated"),
        ("Praise", {"label": "POSITIVE", "score": 0.95}, "Appreciative"),
        ("Praise", {"label": "NEUTRAL", "score": 0.5}, "Appreciative"),
        ("Question", {"label": "NEGATIVE", "score": 0.7}, "Confused"),
        ("Question", {"label": "POSITIVE", "score": 0.7}, "Curious"),
        ("Question", {"label": "NEUTRAL", "score": 0.5}, "Curious"),
        ("UnknownIntent", {"label": "POSITIVE", "score": 0.9}, "Neutral"),
        ("Bug Report", {}, "Concerned"),  # Missing keys default to NEUTRAL
    ],
)
def test_analyze_tone_all_matrix(intent, sentiment, expected_tone):
    assert evaluation.analyze_tone(intent, sentiment) == expected_tone


@pytest.mark.parametrize(
    "intent,sentiment,expected_urgency",
    [
        ("Bug Report", {"label": "NEGATIVE", "score": 0.9}, "High"),
        ("Bug Report", {"label": "NEUTRAL", "score": 0.5}, "Medium"),
        ("Bug Report", {"label": "POSITIVE", "score": 0.8}, "Medium"),
        ("Complaint", {"label": "NEGATIVE", "score": 0.85}, "High"),
        ("Complaint", {"label": "NEGATIVE", "score": 0.80}, "Medium"),  # Boundary <= 0.8
        ("Complaint", {"label": "NEUTRAL", "score": 0.5}, "Medium"),
        ("Feature Request", {"label": "POSITIVE", "score": 0.9}, "Low"),
        ("Feature Request", {"label": "NEGATIVE", "score": 0.9}, "Low"),
        ("Praise", {"label": "POSITIVE", "score": 0.9}, "Low"),
        ("Question", {"label": "NEGATIVE", "score": 0.9}, "Low"),
        ("CustomIntent", {"label": "NEGATIVE", "score": 0.9}, "Low"),
        ("Bug Report", {}, "Medium"),  # Missing label defaults to NEUTRAL
    ],
)
def test_calculate_urgency_matrix(intent, sentiment, expected_urgency):
    assert evaluation.calculate_urgency(intent, sentiment) == expected_urgency


@pytest.mark.parametrize(
    "intent,urgency,expected_action",
    [
        ("Bug Report", "High", "Log Jira Ticket"),
        ("Bug Report", "Medium", "Monitor Issue"),
        ("Bug Report", "Low", "Monitor Issue"),
        ("Feature Request", "Low", "Add to Roadmap"),
        ("Feature Request", "High", "Add to Roadmap"),
        ("Complaint", "High", "Route to Support"),
        ("Complaint", "Medium", "Route to Support"),
        ("Question", "Low", "Update Docs/FAQ"),
        ("Praise", "Low", "Share with Team"),
        ("NonExistent", "High", "No Action Needed"),
        ("", "Low", "No Action Needed"),
    ],
)
def test_recommend_action_matrix(intent, urgency, expected_action):
    assert evaluation.recommend_action(intent, urgency) == expected_action


def test_evaluate_business_context_comprehensive():
    ctx = evaluation.evaluate_business_context(
        "Bug Report", {"label": "NEGATIVE", "score": 0.99}
    )
    assert ctx == {
        "tone": "Frustrated",
        "urgency": "High",
        "recommended_action": "Log Jira Ticket",
    }

    # Edge case: empty sentiment dictionary
    ctx_empty = evaluation.evaluate_business_context("Praise", {})
    assert ctx_empty["tone"] == "Appreciative"
    assert ctx_empty["urgency"] == "Low"
    assert ctx_empty["recommended_action"] == "Share with Team"
