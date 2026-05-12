@echo off
setlocal enabledelayedexpansion

title Umrah Platform - First-Time Setup (No Docker)

echo ============================================================
echo   Umrah Platform - First-Time Setup
echo   Uses your LOCAL PostgreSQL 18 + Redis (no Docker needed)
echo   DB user  : postgres / password: admin
echo   Frontend : http://localhost:3005
echo   Backend  : http://localhost:8005
echo   API Docs : http://localhost:8005/api/docs
echo ============================================================
echo.

set PSQL="C:\Program Files\PostgreSQL\18\bin\psql.exe"
set PGPASSWORD=admin

REM ── 1. Create database ────────────────────────────────────────────────────────
echo [STEP 1/5] Setting up PostgreSQL database...

%PSQL% -U postgres -c "CREATE DATABASE umrah_db;" 2>nul
echo   Database umrah_db ready (already existed or just created).

%PSQL% -U postgres -d umrah_db -c "CREATE EXTENSION IF NOT EXISTS postgis;"
%PSQL% -U postgres -d umrah_db -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"
%PSQL% -U postgres -d umrah_db -c "CREATE EXTENSION IF NOT EXISTS unaccent;"

REM Verify connection
%PSQL% -U postgres -d umrah_db -c "SELECT 1;" >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] Cannot connect to PostgreSQL as postgres/admin.
    echo   Check that PostgreSQL service is running and the password is correct.
    echo   Test manually: "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres
    echo.
    pause
    exit /b 1
)
echo   Connected OK.
echo.

REM ── 2. Create .env files ─────────────────────────────────────────────────────
echo [STEP 2/5] Creating .env files...

(
    echo ENVIRONMENT=development
    echo DEBUG=true
    echo SECRET_KEY=dev-secret-key-CHANGE-IN-PROD-use-openssl-rand-hex-32
    echo DATABASE_URL=postgresql+asyncpg://postgres:admin@localhost:5432/umrah_db
    echo DATABASE_URL_SYNC=postgresql://postgres:admin@localhost:5432/umrah_db
    echo REDIS_URL=redis://localhost:6379/0
    echo CORS_ORIGINS=["http://localhost:3005"]
    echo JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
    echo JWT_REFRESH_TOKEN_EXPIRE_DAYS=30
    echo S3_BUCKET=umrah-platform
    echo S3_REGION=us-east-1
    echo S3_ACCESS_KEY=
    echo S3_SECRET_KEY=
    echo S3_ENDPOINT_URL=
    echo STRIPE_SECRET_KEY=
    echo STRIPE_WEBHOOK_SECRET=
    echo TWILIO_ACCOUNT_SID=
    echo TWILIO_AUTH_TOKEN=
    echo TWILIO_FROM_NUMBER=
    echo SENDGRID_API_KEY=
    echo FROM_EMAIL=noreply@umrahplatform.com
    echo SENTRY_DSN=
) > "backend\.env"
echo   Created backend\.env

(
    echo NEXT_PUBLIC_API_URL=http://localhost:8005/api/v1
    echo NEXT_PUBLIC_SITE_URL=http://localhost:3005
    echo NEXT_PUBLIC_GOOGLE_MAPS_KEY=
    echo NEXT_PUBLIC_SENTRY_DSN=
) > "frontend\.env.local"
echo   Created frontend\.env.local
echo.

REM ── 3. Python virtual environment + dependencies ─────────────────────────────
echo [STEP 3/5] Setting up Python virtual environment...
cd /d "%~dp0backend"

if not exist ".venv" (
    python -m venv .venv
    echo   Created .venv
)

call .venv\Scripts\activate.bat

echo   Installing Python dependencies (this takes a few minutes first time)...
pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo [ERROR] pip install failed. See error above.
    echo   Common fixes:
    echo     - Check internet connection
    echo     - Run: pip install -r requirements.txt  (manually to see the exact error)
    echo.
    pause
    exit /b 1
)
echo   Dependencies installed.
echo.

REM ── 4. Run Alembic migrations ─────────────────────────────────────────────────
echo [STEP 4/5] Running database migrations (creates all tables)...
alembic upgrade head
if errorlevel 1 (
    echo [ERROR] Migration failed. Check the output above.
    pause
    exit /b 1
)
echo   All tables created.
echo.

REM ── 5. Install frontend dependencies ─────────────────────────────────────────
echo [STEP 5/5] Installing frontend dependencies...
cd /d "%~dp0frontend"
npm install
if errorlevel 1 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
)
echo   Frontend dependencies installed.
echo.

echo ============================================================
echo   Setup complete! Starting servers...
echo ============================================================
echo.

start "Umrah Backend (port 8005)" cmd /k "cd /d %~dp0backend && call .venv\Scripts\activate.bat && uvicorn app.main:app --host 0.0.0.0 --port 8005 --reload"
timeout /t 3 /nobreak >nul
start "Umrah Frontend (port 3005)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo   Two windows are opening.
echo   Wait for both to say "ready" then open:
echo.
echo   Frontend  :  http://localhost:3005
echo   API Docs  :  http://localhost:8005/api/docs
echo   Health    :  http://localhost:8005/api/health
echo.
pause
