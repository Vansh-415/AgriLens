# ============================================================
# AgriLens Backend — User Service
# ============================================================
# Pure database operations for users. No FastAPI dependency.
# This service is called by auth_service for user CRUD.
# ============================================================

from datetime import datetime, timezone

from app.database import get_database
from app.models.user import create_user_document, COLLECTION_NAME
from app.utils.logger import get_logger

logger = get_logger(__name__)


async def get_user_by_email(email: str) -> dict | None:
    """
    Find a user by their email address.

    Args:
        email: Email to search for (case-insensitive).

    Returns:
        User document dict, or None if not found.
    """
    db = get_database()
    return await db[COLLECTION_NAME].find_one(
        {"email": email.lower().strip()}
    )


async def get_user_by_id(user_id: str) -> dict | None:
    """
    Find a user by their UUID.

    Args:
        user_id: The user's _id (UUID string).

    Returns:
        User document dict, or None if not found.
    """
    db = get_database()
    return await db[COLLECTION_NAME].find_one({"_id": user_id})


async def create_user(
    email: str,
    full_name: str,
    password_hash: str,
    role: str = "farmer",
) -> dict:
    """
    Create a new user in the database.

    Args:
        email: User's email address.
        full_name: User's display name.
        password_hash: Bcrypt-hashed password.
        role: User role ("farmer" or "admin").

    Returns:
        The inserted user document dict.
    """
    db = get_database()
    user_doc = create_user_document(email, full_name, password_hash, role)
    await db[COLLECTION_NAME].insert_one(user_doc)
    logger.info(f"Created user: {user_doc['email']} (role={role})")
    return user_doc


async def update_login_audit(user_id: str) -> None:
    """
    Update audit fields after a successful login.

    Increments login_count and sets last_login to now.

    Args:
        user_id: The user's _id (UUID string).
    """
    db = get_database()
    now = datetime.now(timezone.utc)
    await db[COLLECTION_NAME].update_one(
        {"_id": user_id},
        {
            "$set": {"last_login": now, "updated_at": now},
            "$inc": {"login_count": 1},
        },
    )
