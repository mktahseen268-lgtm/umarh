@echo off
setlocal
title Umrah Platform - Restart Frontend

echo ============================================================
echo   Restarting Frontend (port 3005)
echo ============================================================
echo.

echo Killing any process on port 3005...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":3005 " ^| findstr "LISTENING"') do (
    echo   Killing PID %%p
    taskkill /PID %%p /F >nul 2>&1
)
timeout /t 1 /nobreak >nul

echo Starting frontend...
start "Umrah Frontend (port 3005)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo   Frontend starting at http://localhost:3005
echo   (Wait ~15 seconds for Next.js to compile)
echo.
pause
