@echo off
setlocal
title Umrah Platform - Restart Backend

echo ============================================================
echo   Restarting Backend (port 8005)
echo ============================================================
echo.

echo Killing any process on port 8005...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":8005 " ^| findstr "LISTENING"') do (
    echo   Killing PID %%p
    taskkill /PID %%p /F >nul 2>&1
)
timeout /t 1 /nobreak >nul

cd /d "%~dp0backend"
call .venv\Scripts\activate.bat

echo Running any pending migrations...
alembic upgrade head
echo.

echo Starting backend...
start "Umrah Backend (port 8005)" cmd /k "cd /d %~dp0backend && call .venv\Scripts\activate.bat && uvicorn app.main:app --host 0.0.0.0 --port 8005 --reload"

echo   Backend running at http://localhost:8005
echo   API Docs at  http://localhost:8005/api/docs
echo.
pause
