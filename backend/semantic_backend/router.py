import logging
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from . import data_handler, evaluation, nlp_engine

logger = logging.getLogger("sementic")

router = APIRouter()


class AnalyzeRequest(BaseModel):
    text: str = Field(..., max_length=5000)
    threshold: float = Field(0.5, ge=0.0, le=1.0)
    include_explanation: bool = False


@router.post("/analyze")
def analyze_text(request: AnalyzeRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        ml_results = nlp_engine.analyze_sync(
            request.text,
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
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/batch")
def process_batch(
    file: UploadFile = File(...),
    threshold: float = Form(0.5),
    targetColumn: str = Form("text"),
):
    MAX_BYTES = 10 * 1024 * 1024
    if file.size is not None and file.size > MAX_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds 10MB limit")

    if not targetColumn or len(targetColumn) > 256:
        raise HTTPException(status_code=400, detail="Invalid targetColumn name")

    try:
        generator = data_handler.stream_csv(
            file.file, target_column=targetColumn, max_bytes=MAX_BYTES
        )
        return StreamingResponse(generator, media_type="text/csv")
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error during batch processing: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/health")
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
