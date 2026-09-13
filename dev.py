import os
import sys
import uvicorn
from fastapi import FastAPI

pkg_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
if os.path.exists(pkg_dir) and pkg_dir not in sys.path:
    sys.path.insert(0, pkg_dir)
elif os.path.dirname(os.path.abspath(__file__)) not in sys.path:
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from semantic_backend.router import router

app = FastAPI(title="Semantic Backend Dev Server")
app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
