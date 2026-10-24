import asyncio
import io
import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from starlette.exceptions import HTTPException as StarletteHTTPException

from src.data import data_handler
from src.engine import evaluation, nlp_engine

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    nlp_engine.get_embedding_model()
    nlp_engine.get_classifier_head()
    nlp_engine.get_sentiment_model()
    yield

app = FastAPI(title="Semantic NLP Platform API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    text: str
    threshold: float = 0.5
    include_explanation: bool = False


@app.post("/semantic/analyze", tags=["Semantic Analysis"], summary="Analyze Single Feedback Comment")
@app.post("/sementic/analyze", tags=["Semantic Analysis"], include_in_schema=False)
@app.post("/api/analyze", tags=["Semantic Analysis"], deprecated=True, include_in_schema=False)
async def analyze_text(request: AnalyzeRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    try:
        ml_results = await nlp_engine.analyze_full(
            request.text, 
            request.threshold, 
            request.include_explanation
        )

        # Ponytail Ultra features
        business_context = evaluation.evaluate_business_context(
            ml_results["intent"]["top_intent"], 
            ml_results["sentiment"]
        )

        return {
            **ml_results,
            **business_context,
        }
    except Exception as e:
        logger.exception("Error during analysis")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/semantic/batch", tags=["Batch Processing"], summary="Stream Feedback Comments CSV")
@app.post("/sementic/batch", tags=["Batch Processing"], include_in_schema=False)
@app.post("/api/batch", tags=["Batch Processing"], deprecated=True, include_in_schema=False)
def process_batch(
    file: UploadFile = File(...),  # noqa: B008
    threshold: float = Form(0.5),
    targetColumn: str = Form("text"),
):
    try:
        generator = data_handler.stream_csv(file.file, target_column=targetColumn)
        return StreamingResponse(generator, media_type="text/csv")
    except Exception as e:
        logger.exception("Error during batch processing")
        raise HTTPException(status_code=500, detail=str(e))

# Mount frontend
frontend_dist = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "../../frontend/dist"
)


@app.exception_handler(StarletteHTTPException)
async def spa_fallback_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 404:
        path = request.url.path
        if (
            not path.startswith("/semantic")
            and not path.startswith("/sementic")
            and not path.startswith("/api")
            and not path.startswith("/docs")
            and not path.startswith("/openapi.json")
        ):
            index_path = os.path.join(frontend_dist, "index.html")
            if os.path.exists(index_path):
                return FileResponse(index_path)
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")
else:
    logger.warning("Frontend dist not found. Please build the frontend.")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("src.api.server:app", host="127.0.0.1", port=8000, reload=True)
