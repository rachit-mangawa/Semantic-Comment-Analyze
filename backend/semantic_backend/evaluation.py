TONE_MAP = {
    ("Bug Report", "NEGATIVE"): "Frustrated",
    ("Bug Report", "NEUTRAL"): "Concerned",
    ("Bug Report", "POSITIVE"): "Concerned",
    ("Feature Request", "POSITIVE"): "Excited",
    ("Feature Request", "NEUTRAL"): "Hopeful",
    ("Feature Request", "NEGATIVE"): "Hopeful",
    ("Praise", "POSITIVE"): "Appreciative",
    ("Praise", "NEUTRAL"): "Appreciative",
    ("Praise", "NEGATIVE"): "Appreciative",
    ("Question", "NEGATIVE"): "Confused",
    ("Question", "NEUTRAL"): "Curious",
    ("Question", "POSITIVE"): "Curious",
}

URGENCY_MAP = {
    ("Bug Report", "NEGATIVE"): "High",
    ("Bug Report", "NEUTRAL"): "Medium",
    ("Bug Report", "POSITIVE"): "Medium",
    ("Feature Request", "POSITIVE"): "Low",
    ("Feature Request", "NEUTRAL"): "Low",
    ("Feature Request", "NEGATIVE"): "Low",
}

ACTION_MAP = {
    "Bug Report": lambda urg: "Log Jira Ticket" if urg == "High" else "Monitor Issue",
    "Feature Request": lambda _: "Add to Roadmap",
    "Complaint": lambda _: "Route to Support",
    "Question": lambda _: "Update Docs/FAQ",
    "Praise": lambda _: "Share with Team",
}


def analyze_tone(intent, sentiment):
    label = sentiment.get("label", "NEUTRAL")
    score = sentiment.get("score", 0.0)
    if intent == "Complaint":
        return "Angry" if label == "NEGATIVE" and score > 0.8 else "Frustrated"
    return TONE_MAP.get((intent, label), "Neutral")


def calculate_urgency(intent, sentiment):
    label = sentiment.get("label", "NEUTRAL")
    score = sentiment.get("score", 0.0)
    if intent == "Complaint":
        return "High" if score > 0.8 and label == "NEGATIVE" else "Medium"
    return URGENCY_MAP.get((intent, label), "Low")


def recommend_action(intent, urgency, sentiment=None):
    handler = ACTION_MAP.get(intent)
    return handler(urgency) if handler else "No Action Needed"


def evaluate_business_context(intent, sentiment):
    tone = analyze_tone(intent, sentiment)
    urgency = calculate_urgency(intent, sentiment)
    return {
        "tone": tone,
        "urgency": urgency,
        "recommended_action": recommend_action(intent, urgency, sentiment),
    }
