# ============================================================
# AgriLens Backend — User & Auth Schemas
# ============================================================
# Pydantic models for authentication request/response validation.
# All API responses follow the consistent format:
#   { "success": bool, "message": str, "data": ... }
# ============================================================

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator


# ============================================================
# Request Schemas
# ============================================================

class UserRegisterRequest(BaseModel):
    """Schema for POST /api/v1/auth/register."""

    email: EmailStr
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="User's full name (2–100 characters)",
    )
    password: str = Field(
        ...,
        min_length=8,
        max_length=100,
        description="Password (minimum 8 characters)",
    )

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Ensure password meets minimum security requirements."""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return v


class UserLoginRequest(BaseModel):
    """Schema for POST /api/v1/auth/login."""

    email: EmailStr
    password: str


class RefreshTokenRequest(BaseModel):
    """Schema for POST /api/v1/auth/refresh and POST /api/v1/auth/logout."""

    refresh_token: str = Field(
        ...,
        description="The refresh token JWT string",
    )


# ============================================================
# Response Data Schemas (nested inside ApiResponse.data)
# ============================================================

class UserData(BaseModel):
    """User profile data returned in API responses."""

    id: str
    email: str
    full_name: str
    role: str
    account_status: str
    last_login: datetime | None = None
    login_count: int = 0
    created_at: datetime


class TokenData(BaseModel):
    """Token pair returned on login/register."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class AuthResponseData(BaseModel):
    """Combined user + tokens data for login/register responses."""

    user: UserData
    tokens: TokenData


class RefreshResponseData(BaseModel):
    """New access token returned on refresh."""

    access_token: str
    token_type: str = "bearer"
