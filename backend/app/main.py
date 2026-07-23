# ============================================================
# AgriLens Backend — FastAPI Application Entry Point
# ============================================================
# This is the main application file. It:
#   1. Creates the FastAPI app with lifespan (DB connect/disconnect)
#   2. Registers RateLimit & CORS middleware
#   3. Registers custom exception handlers
#   4. Includes API route routers
#
# Run with:
#   uvicorn app.main:app --reload
# ============================================================

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import connect_db, disconnect_db
from app.middleware.rate_limit import RateLimitMiddleware
from app.routes.auth import router as auth_router
from app.routes.crops import router as crops_router
from app.routes.diseases import router as diseases_router
from app.routes.health import router as health_router
from app.routes.scans import router as scans_router
from app.routes.treatments import router as treatments_router
from app.utils.exceptions import (
    AgriLensException,
    agrilens_exception_handler,
    generic_exception_handler,
)
from app.utils.logger import get_logger

logger = get_logger(__name__)


# ============================================================
# Lifespan — runs on startup and shutdown
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage application lifecycle events.
    - Startup: Connect to MongoDB
    - Shutdown: Disconnect from MongoDB
    """
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    await connect_db()
    logger.info("Application startup complete")

    yield  # App is running and serving requests

    logger.info("Shutting down application...")
    await disconnect_db()
    logger.info("Application shutdown complete")


# ============================================================
# Create FastAPI App
# ============================================================

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-Powered Cotton Disease Detection & Advisory System",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)


# ============================================================
# Middleware
# ============================================================

app.add_middleware(RateLimitMiddleware, max_requests=20, window_seconds=60)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Exception Handlers
# ============================================================

app.add_exception_handler(AgriLensException, agrilens_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)


# ============================================================
# API Routes
# ============================================================

app.include_router(health_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(crops_router, prefix="/api/v1")
app.include_router(diseases_router, prefix="/api/v1")
app.include_router(treatments_router, prefix="/api/v1")
app.include_router(scans_router, prefix="/api/v1")


# ============================================================
# Root Endpoint
# ============================================================

@app.get("/", tags=["Root"])
async def root():
    """Root endpoint — confirms the API is reachable."""
    return {
        "success": True,
        "message": f"Welcome to {settings.APP_NAME} API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
    }
