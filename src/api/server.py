import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException

from semantic_backend.router import router

app = FastAPI(title="Semantic NLP Platform API", docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/semantic")
app.include_router(router, prefix="/sementic")

_current_dir = os.path.dirname(os.path.abspath(__file__))
frontend_dist = os.path.abspath(
    os.path.join(_current_dir, "..", "..", "frontend", "dist")
)


@app.exception_handler(StarletteHTTPException)
async def spa_fallback_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 404:
        path = request.url.path
        if not path.startswith(("/semantic", "/sementic", "/api", "/docs", "/redoc", "/openapi.json")):
            index_path = os.path.join(frontend_dist, "index.html")
            if os.path.exists(index_path):
                return FileResponse(index_path)
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("src.api.server:app", host="127.0.0.1", port=8000, reload=True)
