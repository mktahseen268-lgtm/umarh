from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from app.core.config import settings
from app.api.v1 import auth, packages, bookings, admin
import time


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: warm DB pool
    from app.core.database import engine
    async with engine.begin() as conn:
        await conn.run_sync(lambda c: None)
    yield
    # Shutdown: dispose engine
    await engine.dispose()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/api/docs" if not settings.is_production else None,
    redoc_url="/api/redoc" if not settings.is_production else None,
    openapi_url="/api/openapi.json" if not settings.is_production else None,
    lifespan=lifespan,
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request timing middleware ─────────────────────────────────────────────────
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    response.headers["X-Process-Time"] = f"{(time.perf_counter() - start) * 1000:.1f}ms"
    return response


# ── Tenant middleware: sets current_tenant_id in DB session ───────────────────
@app.middleware("http")
async def set_tenant_context(request: Request, call_next):
    # Tenant resolved from JWT claim — executed in route deps for now
    return await call_next(request)


# ── Routers ──────────────────────────────────────────────────────────────────
PREFIX = "/api/v1"
app.include_router(auth.router,     prefix=PREFIX)
app.include_router(packages.router, prefix=PREFIX)
app.include_router(bookings.router, prefix=PREFIX)
app.include_router(admin.router,    prefix=PREFIX)


# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/api/health", tags=["system"])
async def health_check() -> dict:
    return {
        "status": "ok",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


# ── Global exception handler ─────────────────────────────────────────────────
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    import structlog
    log = structlog.get_logger()
    log.exception("Unhandled exception", path=request.url.path, exc=str(exc))
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )
