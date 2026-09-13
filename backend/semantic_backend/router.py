import logging
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from . import data_handler, evaluation, nlp_engine

logger = logging.getLogger("semantic_backend")

router = APIRouter()


class AnalyzeRequest(BaseModel):
    text: str
    threshold: float = 0.5
    include_explanation: bool = False


@router.post("/analyze")
@router.post("/semantic/analyze", include_in_schema=False)
@router.post("/sementic/analyze", include_in_schema=False)
@router.post("/api/analyze", include_in_schema=False)
async def analyze_text(request: AnalyzeRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        ml_results = await nlp_engine.analyze_full(
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
    except Exception as e:
        logger.exception(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/batch")
@router.post("/semantic/batch", include_in_schema=False)
@router.post("/sementic/batch", include_in_schema=False)
@router.post("/api/batch", include_in_schema=False)
def process_batch(
    file: UploadFile = File(...),
    threshold: float = Form(0.5),
    targetColumn: str = Form("text"),
):
    try:
        generator = data_handler.stream_csv(file.file, target_column=targetColumn)
        return StreamingResponse(generator, media_type="text/csv")
    except Exception as e:
        logger.exception(f"Error during batch processing: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
def health_check():
    return {"status": "healthy", "service": "semantic_backend"}
