import logging
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from . import data_handler, evaluation, nlp_engine

logger = logging.getLogger("sementic")

router = APIRouter()


class SingleAnalysisRequest(BaseModel):
    text: str = Field(..., max_length=5000, description="Comment text to analyze")
    threshold: float = Field(0.5, ge=0.0, le=1.0, description="Confidence threshold for intent filtering")
    include_explanation: bool = Field(False, description="Whether to include word-level explainability")


class IntentResult(BaseModel):
    labels: list[str]
    scores: list[float]
    all_intents: dict[str, float]
    top_intent: str
    top_confidence: float


class SentimentResult(BaseModel):
    label: str
    score: float


class ExplainabilityItem(BaseModel):
    word: str
    contribution: float
    primary_intent: str


class SingleAnalysisResponse(BaseModel):
    intent: IntentResult
    sentiment: SentimentResult
    explainability: list[ExplainabilityItem] = []
    tone: str
    urgency: str
    recommended_action: str


class ModelsLoadedStatus(BaseModel):
    embedding: bool
    classifier_head: bool
    sentiment: bool


class HealthResponse(BaseModel):
    status: str
    service: str
    models_loaded: ModelsLoadedStatus


@router.post("/single", response_model=SingleAnalysisResponse, summary="Analyze a single comment")
@router.post("/analyze", response_model=SingleAnalysisResponse, include_in_schema=False)
def analyze_single(request: SingleAnalysisRequest):
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        ml_results = nlp_engine.analyze_sync(
            text,
            request.threshold,
            request.include_explanation,
        )
        business_context = evaluation.evaluate_business_context(
            ml_results["intent"]["top_intent"],
            ml_results["sentiment"],
        )
        return {
            **ml_results,
            **business_context,
        }
    except Exception as e:
        logger.exception(f"Error during single analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/batch", summary="Stream process a CSV file of comments")
def process_batch(
    file: UploadFile = File(..., description="CSV file containing comments"),
    threshold: float = Form(0.5, ge=0.0, le=1.0, description="Intent confidence threshold"),
    targetColumn: str = Form("text", description="Name of the text column to analyze"),
):
    MAX_BYTES = 10 * 1024 * 1024
    if file.size and file.size > MAX_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds 10MB limit")

    try:
        generator = data_handler.stream_csv(file.file, target_column=targetColumn)
        return StreamingResponse(generator, media_type="text/csv")
    except Exception as e:
        logger.exception(f"Error during batch processing: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health", response_model=HealthResponse, summary="Check service and model readiness")
def health_check():
    loaded = {
        "embedding": nlp_engine.get_embedding_model.cache_info().currsize > 0,
        "classifier_head": nlp_engine.get_classifier_head.cache_info().currsize > 0,
        "sentiment": nlp_engine.get_sentiment_model.cache_info().currsize > 0,
    }
    return {
        "status": "healthy",
        "service": "semantic_backend",
        "models_loaded": loaded,
    }
