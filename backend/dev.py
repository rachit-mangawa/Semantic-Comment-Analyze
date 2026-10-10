import os
import sys
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from semantic_backend.router import router

app = FastAPI(title="Semantic Backend Dev Server", docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/sementic")

frontend_dist = os.path.abspath(os.path.join(backend_dir, "..", "frontend", "dist"))


@app.exception_handler(StarletteHTTPException)
async def spa_fallback_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 404:
        path = request.url.path
        if not path.startswith(("/sementic", "/docs", "/redoc", "/openapi.json")):
            index_path = os.path.join(frontend_dist, "index.html")
            if os.path.exists(index_path):
                return FileResponse(index_path)
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="127.0.0.1", port=port)
