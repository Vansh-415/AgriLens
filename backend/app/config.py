# ============================================================
# AgriLens Backend — Application Configuration
# ============================================================
# Loads environment variables from .env using pydantic-settings.
# All settings are type-validated and have sensible defaults.
# ============================================================

from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.

    Usage:
        from app.config import settings
        print(settings.APP_NAME)
    """

    # ----- Application -----
    APP_NAME: str = "AgriLens"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]

    # ----- MongoDB Atlas -----
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "agrilens_db"

    # ----- JWT Authentication -----
    JWT_SECRET_KEY: str = "change-this-to-a-secure-secret-key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ----- Default Admin (for seeding) -----
    DEFAULT_ADMIN_EMAIL: str = "admin@agrilens.com"
    DEFAULT_ADMIN_PASSWORD: str = "Admin@123"

    # Load from .env file in the backend directory
    model_config = SettingsConfigDict(
        env_file=[
            str(Path(__file__).resolve().parent.parent / ".env"),
            ".env",
        ],
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


# ---- Singleton instance used throughout the app ----
settings = Settings()
