@echo off
setlocal

title Umrah Platform - Local Dev

echo ============================================================
echo   Local Dev Mode (Python + Node directly, no Docker)
echo   Frontend : http://localhost:3005
echo   Backend  : http://localhost:8005
echo   Requires : Python 3.12, Node 20, running Postgres+Redis
echo ============================================================
echo.

echo Starting PostgreSQL and Redis via Docker...
docker compose up -d db redis
timeout /t 5 /nobreak >nul

echo Starting FastAPI backend in new window (port 8005)...
start "Umrah Backend" cmd /k "cd /d %~dp0backend && (if not exist .venv python -m venv .venv) && .venv\Scripts\activate && pip install -r requirements.txt -q && alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8005 --reload"

echo Starting Next.js frontend in new window (port 3005)...
start "Umrah Frontend" cmd /k "cd /d %~dp0frontend && npm install --prefer-offline && npm run dev"

echo.
echo ============================================================
echo   Both services starting in separate windows.
echo   Frontend  :  http://localhost:3005
echo   Backend   :  http://localhost:8005/api/health
echo   API Docs  :  http://localhost:8005/api/docs
echo ============================================================
echo.
pause
