# ============================================================
# AgriLens Backend — Security Utilities
# ============================================================
# Password hashing (bcrypt), JWT token helpers, and token
# hashing. These have NO dependency on FastAPI routes or services.
# ============================================================

import hashlib
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings
import bcrypt

# Fix for passlib + bcrypt >= 4.1.0 version inspection issue
if not hasattr(bcrypt, '__about__'):
    bcrypt.__about__ = type('About', (), {'__version__': getattr(bcrypt, '__version__', '4.2.1')})

# ----- Password Hashing Context -----
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Hash a plain-text password using bcrypt.

    Args:
        password: The plain-text password to hash.

    Returns:
        The bcrypt-hashed password string.
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain-text password against a bcrypt hash.

    Args:
        plain_password: The plain-text password to check.
        hashed_password: The stored bcrypt hash.

    Returns:
        True if the password matches, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Create a signed JWT access token.

    Args:
        data: Payload dict to encode (e.g., {"sub": user_id}).
        expires_delta: Optional custom expiration time. Defaults to
                       ACCESS_TOKEN_EXPIRE_MINUTES from settings.

    Returns:
        Encoded JWT string.
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )
    return encoded_jwt


def create_refresh_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Create a signed JWT refresh token with longer expiry.

    Refresh tokens are stored (hashed) in MongoDB so they can be
    revoked on logout. They carry "type": "refresh" in the payload
    to distinguish them from access tokens.

    Args:
        data: Payload dict to encode (e.g., {"sub": user_id}).
        expires_delta: Optional custom expiration. Defaults to
                       REFRESH_TOKEN_EXPIRE_DAYS from settings.

    Returns:
        Encoded JWT string.
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )

    to_encode.update({"exp": expire, "type": "refresh"})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )
    return encoded_jwt


def decode_access_token(token: str) -> dict | None:
    """
    Decode and validate a JWT token (works for both access and refresh).

    Args:
        token: The JWT string to decode.

    Returns:
        The decoded payload dict, or None if the token is invalid/expired.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload
    except JWTError:
        return None


def hash_token(token: str) -> str:
    """
    Create a SHA-256 hash of a token string.

    Used for storing refresh tokens securely in MongoDB.
    SHA-256 is appropriate here because JWT tokens already have
    high entropy — we don't need the slowness of bcrypt.

    Args:
        token: The raw JWT token string.

    Returns:
        Hex-encoded SHA-256 hash.
    """
    return hashlib.sha256(token.encode("utf-8")).hexdigest()
