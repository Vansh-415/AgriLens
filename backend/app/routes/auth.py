# ============================================================
# AgriLens Backend — Authentication Routes
# ============================================================
# All auth endpoints under /api/v1/auth.
# Routes are thin controllers — all logic lives in auth_service.
#
# Endpoints:
#   POST /register  — Create a new farmer account
#   POST /login     — Authenticate and get tokens
#   POST /refresh   — Exchange refresh token for new access token
#   POST /logout    — Revoke refresh token (requires auth)
#   GET  /me        — Get current user profile (requires auth)
# ============================================================

from fastapi import APIRouter, Depends, Response

from app.config import settings
from app.dependencies.auth import get_current_user, require_admin
from app.schemas.user import (
    RefreshTokenRequest,
    UserLoginRequest,
    UserRegisterRequest,
)
from app.services.auth_service import (
    get_current_user_data,
    login_user,
    logout_user,
    refresh_access_token,
    register_user,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ============================================================
# POST /register
# ============================================================

@router.post(
    "/register",
    summary="Register a new account",
    description="Create a new farmer account with email and password.",
)
async def register(request: UserRegisterRequest, response: Response):
    """
    Register a new user.
    - Validates email format and password strength (min 8 chars)
    - Checks email uniqueness
    - Returns access + refresh tokens and user profile
    - Sets HttpOnly cookies for web clients
    """
    result = await register_user(
        email=request.email,
        full_name=request.full_name,
        password=request.password,
    )

    # Set HttpOnly cookies for web clients
    _set_auth_cookies(response, result["tokens"])

    return {
        "success": True,
        "message": "Registration successful",
        "data": result,
    }


# ============================================================
# POST /login
# ============================================================

@router.post(
    "/login",
    summary="Login",
    description="Authenticate with email and password to receive tokens.",
)
async def login(request: UserLoginRequest, response: Response):
    """
    Login with email and password.
    - Verifies credentials against bcrypt hash
    - Updates login audit fields (last_login, login_count)
    - Returns access + refresh tokens and user profile
    - Sets HttpOnly cookies for web clients
    """
    result = await login_user(
        email=request.email,
        password=request.password,
    )

    # Set HttpOnly cookies for web clients
    _set_auth_cookies(response, result["tokens"])

    return {
        "success": True,
        "message": "Login successful",
        "data": result,
    }


# ============================================================
# POST /refresh
# ============================================================

@router.post(
    "/refresh",
    summary="Refresh access token",
    description="Exchange a valid refresh token for a new access token.",
)
async def refresh(request: RefreshTokenRequest):
    """
    Get a new access token using a refresh token.
    - Validates the refresh token JWT signature and expiry
    - Checks the hashed token exists in DB and is not revoked
    - Returns a new short-lived access token
    """
    result = await refresh_access_token(
        refresh_token_str=request.refresh_token,
    )

    return {
        "success": True,
        "message": "Token refreshed successfully",
        "data": result,
    }


# ============================================================
# POST /logout
# ============================================================

@router.post(
    "/logout",
    summary="Logout",
    description="Revoke the refresh token and clear auth cookies. Requires authentication.",
)
async def logout(
    request: RefreshTokenRequest,
    response: Response,
    user: dict = Depends(get_current_user),
):
    """
    Logout the current user.
    - Revokes the refresh token in the database
    - Clears HttpOnly auth cookies
    - Requires a valid access token (Bearer or cookie)
    """
    await logout_user(refresh_token_str=request.refresh_token)

    # Clear HttpOnly cookies
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")

    return {
        "success": True,
        "message": "Logout successful",
        "data": None,
    }


# ============================================================
# GET /me
# ============================================================

@router.get(
    "/me",
    summary="Get current user profile",
    description="Returns the authenticated user's profile. Requires authentication.",
)
async def me(user: dict = Depends(get_current_user)):
    """
    Get the current authenticated user's profile.
    - Requires a valid access token (Bearer or cookie)
    - Returns user data without password_hash
    """
    user_data = await get_current_user_data(user_id=user["_id"])

    return {
        "success": True,
        "message": "User profile retrieved",
        "data": user_data,
    }


# ============================================================
# GET /admin-check (admin-only test endpoint)
# ============================================================

@router.get(
    "/admin-check",
    summary="Admin access check",
    description="Test endpoint to verify admin role authorization.",
)
async def admin_check(user: dict = Depends(require_admin)):
    """
    Verify admin authorization.
    - Requires a valid access token with role=admin
    - Returns 403 Forbidden for non-admin users
    """
    return {
        "success": True,
        "message": "Admin access confirmed",
        "data": {"user_id": user["_id"], "role": user["role"]},
    }


# ============================================================
# Helper — Set HttpOnly auth cookies
# ============================================================

def _set_auth_cookies(response: Response, tokens: dict) -> None:
    """
    Set HttpOnly cookies for both access and refresh tokens.
    This supports web clients that prefer cookie-based auth.

    Security settings:
        httponly=True   — prevents JavaScript access (XSS protection)
        samesite="lax"  — CSRF protection for same-site requests
        secure=False    — set to True in production (requires HTTPS)
    """
    response.set_cookie(
        key="access_token",
        value=tokens["access_token"],
        httponly=True,
        samesite="lax",
        secure=False,  # TODO: Set True in production (HTTPS)
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        httponly=True,
        samesite="lax",
        secure=False,  # TODO: Set True in production (HTTPS)
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
    )
