@echo off
setlocal
echo ==============================================
echo Semantic NLP Platform - Local Runner
echo ==============================================

:: Build frontend once if dist does not exist
if not exist frontend\dist (
    echo [INFO] Building frontend UI...
    cd frontend && call npm install && call npm run build && cd ..
)

:: Launch backend (uv if available, else local venv)
where uv >nul 2>nul
if %ERRORLEVEL% equ 0 (
    uv run python backend\dev.py
) else (
    if not exist .venv (
        echo [INFO] Setting up virtual environment...
        python -m venv .venv
        call .venv\Scripts\activate.bat
        pip install -r requirements.txt
    ) else (
        call .venv\Scripts\activate.bat
    )
    python backend\dev.py
)
