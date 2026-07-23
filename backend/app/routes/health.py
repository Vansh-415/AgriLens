# ============================================================
# AgriLens Backend — Health Check Route
# ============================================================
# GET /api/v1/health
# Provides a quick status check for the API and database.
# ============================================================

from fastapi import APIRouter

from app.schemas.health import HealthResponse
from app.services.health_service import check_health

# Create router with tags for OpenAPI documentation grouping
router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health Check",
    description="Check if the AgriLens API and database are running.",
)
async def health_check():
    """
    Returns the current health status of the API.

    - Confirms the API is responsive
    - Pings MongoDB to verify database connectivity
    """
    result = await check_health()
    return result
