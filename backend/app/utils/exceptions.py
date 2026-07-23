# ============================================================
# AgriLens Backend — Custom Exceptions & Handlers
# ============================================================
# Defines custom exception classes and FastAPI exception handlers.
# Exception handlers are registered in main.py.
# ============================================================

from fastapi import Request
from fastapi.responses import JSONResponse

from app.utils.logger import get_logger

logger = get_logger(__name__)


# ============================================================
# Custom Exception Classes
# ============================================================

class AgriLensException(Exception):
    """Base exception for all AgriLens application errors."""

    def __init__(self, message: str = "An unexpected error occurred", status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class NotFoundException(AgriLensException):
    """Raised when a requested resource is not found."""

    def __init__(self, message: str = "Resource not found"):
        super().__init__(message=message, status_code=404)


class BadRequestException(AgriLensException):
    """Raised when the request data is invalid."""

    def __init__(self, message: str = "Bad request"):
        super().__init__(message=message, status_code=400)


class UnauthorizedException(AgriLensException):
    """Raised when authentication fails or is missing."""

    def __init__(self, message: str = "Unauthorized"):
        super().__init__(message=message, status_code=401)


class ForbiddenException(AgriLensException):
    """Raised when the user lacks required permissions (e.g., not admin)."""

    def __init__(self, message: str = "Forbidden"):
        super().__init__(message=message, status_code=403)


# ============================================================
# FastAPI Exception Handlers
# ============================================================

async def agrilens_exception_handler(request: Request, exc: AgriLensException) -> JSONResponse:
    """
    Handle all custom AgriLens exceptions and return a consistent
    JSON error response.
    """
    logger.error(f"AgriLensException: {exc.message} (status={exc.status_code})")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.message,
            "data": None,
        },
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Catch-all handler for unhandled exceptions. Logs the full error
    and returns a generic 500 response (no internal details leaked).
    """
    logger.exception(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "An internal server error occurred",
            "data": None,
        },
    )
