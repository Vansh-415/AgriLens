# ============================================================
# AgriLens Backend — Health Check Service
# ============================================================
# Business logic for the health check endpoint.
# This service has NO dependency on FastAPI.
# ============================================================

import asyncio
from app.config import settings
from app.database import get_database
from app.utils.logger import get_logger

logger = get_logger(__name__)


async def check_health() -> dict:
    """
    Check the overall health of the application.

    Verifies:
        - Application is running
        - MongoDB connection is alive (via ping)

    Returns:
        A dictionary with health status information.
    """
    database_status = "disconnected"

    try:
        db = get_database()
        # Ping MongoDB with a strict timeout to prevent endpoint hanging
        await asyncio.wait_for(db.command("ping"), timeout=2.0)
        database_status = "connected"
    except Exception as e:
        logger.warning(f"Database health check ping failed: {e}")
        database_status = "disconnected"

    return {
        "success": True,
        "message": "AgriLens API is running",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "database_status": database_status,
    }
