# ============================================================
# AgriLens Backend — Auth Service
# ============================================================
# Handles all authentication business logic:
#   - Register (with email uniqueness + password validation)
#   - Login (with credential verification + audit tracking)
#   - Refresh (validate hashed refresh token, issue new access)
#   - Logout (revoke refresh token in DB)
#   - Current user profile
#
# This service has NO FastAPI dependency.
# It calls user_service for user CRUD operations.
# ============================================================

from datetime import datetime, timedelta, timezone

from app.config import settings
from app.database import get_database
from app.models.refresh_token import (
    create_refresh_token_document,
    COLLECTION_NAME as REFRESH_TOKENS_COLLECTION,
)
from app.services.user_service import (
    get_user_by_email,
    get_user_by_id,
    create_user,
    update_login_audit,
)
from app.utils.exceptions import BadRequestException, UnauthorizedException
from app.utils.logger import get_logger
from app.utils.security import (
    create_access_token,
    create_refresh_token,
    decode_access_token,
    hash_password,
    hash_token,
    verify_password,
)

logger = get_logger(__name__)


# ============================================================
# Public API — called by routes
# ============================================================

async def register_user(email: str, full_name: str, password: str) -> dict:
    """
    Register a new user account.

    Steps:
        1. Check if email already exists
        2. Hash the password with bcrypt
        3. Create user document in MongoDB
        4. Generate access + refresh tokens
        5. Store hashed refresh token in DB

    Args:
        email: User's email address.
        full_name: User's display name.
        password: Plain-text password (min 8 characters).

    Returns:
        Dict with "user" and "tokens" keys.

    Raises:
        BadRequestException: If email is already registered.
    """
    # Check email uniqueness
    existing_user = await get_user_by_email(email)
    if existing_user:
        raise BadRequestException("A user with this email already exists")

    # Hash password and create user
    password_hash = hash_password(password)
    user = await create_user(email, full_name, password_hash, role="farmer")

    # Generate tokens
    tokens = await _generate_and_store_tokens(user["_id"], user["role"])

    logger.info(f"New user registered: {user['email']}")

    return {
        "user": _format_user_data(user),
        "tokens": tokens,
    }


async def login_user(email: str, password: str) -> dict:
    """
    Authenticate a user with email and password.

    Steps:
        1. Find user by email
        2. Verify password against bcrypt hash
        3. Check account is active
        4. Update login audit fields
        5. Generate access + refresh tokens
        6. Store hashed refresh token in DB

    Args:
        email: User's email address.
        password: Plain-text password.

    Returns:
        Dict with "user" and "tokens" keys.

    Raises:
        UnauthorizedException: If credentials are invalid or account inactive.
    """
    # Find user
    user = await get_user_by_email(email)
    if not user:
        raise UnauthorizedException("Invalid email or password")

    # Verify password
    if not verify_password(password, user["password_hash"]):
        raise UnauthorizedException("Invalid email or password")

    # Check account status
    if user.get("account_status") != "active":
        raise UnauthorizedException("Account is inactive. Please contact support.")

    # Update audit fields (last_login, login_count)
    await update_login_audit(user["_id"])

    # Generate tokens
    tokens = await _generate_and_store_tokens(user["_id"], user["role"])

    # Re-fetch user to get updated audit fields
    user = await get_user_by_id(user["_id"])

    logger.info(f"User logged in: {user['email']}")

    return {
        "user": _format_user_data(user),
        "tokens": tokens,
    }


async def refresh_access_token(refresh_token_str: str) -> dict:
    """
    Exchange a valid refresh token for a new access token.

    Steps:
        1. Decode the refresh token JWT
        2. Verify it's a refresh token (type=refresh)
        3. Hash the token and look it up in DB
        4. Check it's not revoked
        5. Verify the user still exists and is active
        6. Generate a new access token

    Args:
        refresh_token_str: The raw refresh token JWT string.

    Returns:
        Dict with "access_token" and "token_type".

    Raises:
        UnauthorizedException: If the refresh token is invalid, expired, or revoked.
    """
    # Decode JWT
    payload = decode_access_token(refresh_token_str)
    if not payload:
        raise UnauthorizedException("Invalid or expired refresh token")

    # Must be a refresh token
    if payload.get("type") != "refresh":
        raise UnauthorizedException("Invalid token type — expected refresh token")

    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Invalid refresh token payload")

    # Check the hashed token exists in DB and is not revoked
    db = get_database()
    token_hash = hash_token(refresh_token_str)
    stored_token = await db[REFRESH_TOKENS_COLLECTION].find_one({
        "token_hash": token_hash,
        "is_revoked": False,
    })

    if not stored_token:
        raise UnauthorizedException("Refresh token is invalid or has been revoked")

    # Verify user still exists and is active
    user = await get_user_by_id(user_id)
    if not user:
        raise UnauthorizedException("User not found")
    if user.get("account_status") != "active":
        raise UnauthorizedException("Account is inactive")

    # Generate a new access token only (refresh token stays the same)
    access_token = create_access_token(
        {"sub": user_id, "role": user["role"], "type": "access"}
    )

    logger.info(f"Access token refreshed for user: {user['email']}")

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


async def logout_user(refresh_token_str: str) -> None:
    """
    Revoke a refresh token (mark as revoked in DB).

    This is idempotent — calling logout with an already-revoked or
    non-existent token will not raise an error.

    Args:
        refresh_token_str: The raw refresh token JWT string.
    """
    db = get_database()
    token_hash = hash_token(refresh_token_str)

    await db[REFRESH_TOKENS_COLLECTION].update_one(
        {"token_hash": token_hash, "is_revoked": False},
        {"$set": {"is_revoked": True}},
    )

    logger.info("Refresh token revoked (logout)")


async def get_current_user_data(user_id: str) -> dict:
    """
    Get the current user's profile data (without password_hash).

    Args:
        user_id: The user's _id (UUID string).

    Returns:
        Formatted user data dict.

    Raises:
        UnauthorizedException: If the user doesn't exist.
    """
    user = await get_user_by_id(user_id)
    if not user:
        raise UnauthorizedException("User not found")
    return _format_user_data(user)


# ============================================================
# Private Helpers
# ============================================================

async def _generate_and_store_tokens(user_id: str, role: str) -> dict:
    """
    Generate an access + refresh token pair and store the hashed
    refresh token in MongoDB.

    Args:
        user_id: The user's _id.
        role: The user's role (for JWT payload).

    Returns:
        Dict with access_token, refresh_token, and token_type.
    """
    # Create tokens with role in payload for authorization checks
    access_token = create_access_token(
        {"sub": user_id, "role": role, "type": "access"}
    )
    refresh_token = create_refresh_token(
        {"sub": user_id, "role": role}
    )

    # Store hashed refresh token in DB for revocation support
    db = get_database()
    token_hash = hash_token(refresh_token)
    expires_at = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )

    token_doc = create_refresh_token_document(
        user_id=user_id,
        token_hash=token_hash,
        expires_at=expires_at,
    )
    await db[REFRESH_TOKENS_COLLECTION].insert_one(token_doc)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


def _format_user_data(user: dict) -> dict:
    """
    Format a raw MongoDB user document into an API-safe dict.
    Strips password_hash and renames _id to id.

    Args:
        user: Raw user document from MongoDB.

    Returns:
        Clean user data dict suitable for API responses.
    """
    return {
        "id": user["_id"],
        "email": user["email"],
        "full_name": user["full_name"],
        "role": user["role"],
        "account_status": user.get("account_status", "active"),
        "last_login": user.get("last_login"),
        "login_count": user.get("login_count", 0),
        "created_at": user["created_at"],
    }
