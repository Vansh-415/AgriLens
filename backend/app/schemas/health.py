# ============================================================
# AgriLens Backend — Health Check Schema
# ============================================================
# Pydantic response model for the health check endpoint.
# ============================================================

from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Response schema for GET /api/v1/health."""

    success: bool
    message: str
    app_name: str
    version: str
    database_status: str
