# ============================================================
# AgriLens Backend — MongoDB Database Connection
# ============================================================
# Uses Motor (async MongoDB driver) for non-blocking DB access.
# Connection lifecycle is managed via FastAPI's lifespan in main.py.
# ============================================================

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import certifi

from app.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

# ----- Module-level state -----
# These are set during app startup and cleared on shutdown.
_client: AsyncIOMotorClient | None = None
_database: AsyncIOMotorDatabase | None = None


async def connect_db() -> None:
    """
    Establish connection to MongoDB Atlas.
    Called once during FastAPI lifespan startup.
    """
    global _client, _database

    logger.info(f"Connecting to MongoDB database: {settings.DATABASE_NAME}")

    _client = AsyncIOMotorClient(settings.MONGODB_URL)
    _database = _client[settings.DATABASE_NAME]

    # Verify the connection is alive by pinging the server
    try:
        await _client.admin.command("ping")
        logger.info("[OK] MongoDB connection established successfully")
    except Exception as e:
        logger.error(f"[ERROR] MongoDB connection failed: {e}")
        raise


async def disconnect_db() -> None:
    """
    Close the MongoDB connection gracefully.
    Called once during FastAPI lifespan shutdown.
    """
    global _client, _database

    if _client:
        _client.close()
        _client = None
        _database = None
        logger.info("MongoDB connection closed")


def get_database() -> AsyncIOMotorDatabase:
    """
    Return the active database instance.

    Returns:
        The AsyncIOMotorDatabase instance for the configured database.

    Raises:
        RuntimeError: If called before connect_db() has been called.
    """
    if _database is None:
        raise RuntimeError(
            "Database is not connected. Ensure connect_db() is called during app startup."
        )
    return _database
