@echo off
setlocal enabledelayedexpansion

echo ==============================================
echo   Semantic NLP Platform - Local Offline Runner
echo ==============================================

:: Ensure frontend dependencies are installed
if not exist frontend\node_modules (
    echo [INFO] Installing frontend npm packages...
    cd frontend && call npm install && cd ..
)

:: Check if backend is already listening on port 8000
netstat -ano | findstr 127.0.0.1:8000 | findstr LISTENING >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [INFO] Local backend is already active on port 8000.
) else (
    echo [INFO] Starting local backend on http://127.0.0.1:8000 ...
    where uv >nul 2>nul
    if !ERRORLEVEL! equ 0 (
        start "Semantic Backend (Port 8000)" uv run python backend\dev.py
    ) else (
        if not exist .venv (
            echo [INFO] Creating Python virtual environment...
            python -m venv .venv
            call .venv\Scripts\activate.bat
            pip install -r requirements.txt
        )
        start "Semantic Backend (Port 8000)" cmd /k "call .venv\Scripts\activate.bat && python backend\dev.py"
    )
    echo [INFO] Waiting for backend to initialize...
    timeout /t 3 /nobreak >nul
)

:: Launch browser pointing to local frontend
echo [INFO] Opening browser at http://localhost:3000 ...
start http://localhost:3000

:: Start Vite dev server
echo [INFO] Starting Vite frontend server...
cd frontend
call npm run dev
