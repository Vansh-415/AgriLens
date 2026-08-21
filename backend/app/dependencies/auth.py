# ============================================================
# AgriLens Backend — Auth Dependencies
# ============================================================
# FastAPI dependency injection for authentication & authorization.
#
# Supports two auth methods:
#   1. Authorization: Bearer <access_token>  (header)
#   2. HttpOnly cookie named "access_token"  (cookie)
#
# Reusable dependencies:
#   get_current_user          — extracts + validates JWT, returns user dict
#   get_optional_current_user — optional auth (returns user dict or None)
#   require_admin             — ensures user.role == "admin"
# ============================================================

from typing import Optional
from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.services.user_service import get_user_by_id
from app.utils.exceptions import ForbiddenException, UnauthorizedException
from app.utils.security import decode_access_token

# HTTPBearer with auto_error=False so we can fall back to cookies
_bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
) -> dict:
    """
    Extract and validate JWT from either the Authorization header
    or an HttpOnly cookie. Returns the full user document from MongoDB.
    """
    token = None

    # 1. Try Authorization header
    if credentials:
        token = credentials.credentials

    # 2. Fall back to HttpOnly cookie
    if not token:
        token = request.cookies.get("access_token")

    if not token:
        raise UnauthorizedException("Authentication required. Provide a Bearer token or cookie.")

    # Decode JWT
    payload = decode_access_token(token)
    if not payload:
        raise UnauthorizedException("Invalid or expired access token")

    # Block refresh tokens from being used as access tokens
    if payload.get("type") == "refresh":
        raise UnauthorizedException("Cannot use a refresh token for authentication")

    # Extract user ID from token payload
    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Invalid token payload — missing user ID")

    # Fetch user from database
    user = await get_user_by_id(user_id)
    if not user:
        raise UnauthorizedException("User not found — account may have been deleted")

    # Check account is active
    if user.get("account_status") != "active":
        raise UnauthorizedException("Account is inactive. Please contact support.")

    return user


async def get_optional_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
) -> Optional[dict]:
    """
    Optional authentication dependency.
    Returns user dict if valid JWT is present, or None if unauthenticated.
    Allows guest users to perform predictions without blocking.
    """
    try:
        return await get_current_user(request, credentials)
    except Exception:
        return None


async def require_admin(
    user: dict = Depends(get_current_user),
) -> dict:
    """
    Ensure the authenticated user has the 'admin' role.
    """
    if user.get("role") != "admin":
        raise ForbiddenException("Admin access required")
    return user
