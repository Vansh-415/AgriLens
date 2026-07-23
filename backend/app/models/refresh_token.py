# ============================================================
# AgriLens Backend — Refresh Token Document Model
# ============================================================
# Stores hashed refresh tokens in MongoDB for revocation support.
# The raw JWT is NEVER stored — only a SHA-256 hash.
# On logout, the token is marked as revoked (is_revoked=True).
# ============================================================

import uuid
from datetime import datetime, timezone


def create_refresh_token_document(
    user_id: str,
    token_hash: str,
    expires_at: datetime,
) -> dict:
    """
    Create a new refresh token document for MongoDB insertion.

    Args:
        user_id: UUID of the user this token belongs to.
        token_hash: SHA-256 hash of the raw JWT refresh token.
        expires_at: When this refresh token expires.

    Returns:
        A dictionary ready to insert into the 'refresh_tokens' collection.
    """
    return {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "token_hash": token_hash,
        "expires_at": expires_at,
        "is_revoked": False,
        "created_at": datetime.now(timezone.utc),
    }


# ----- Collection Name -----
COLLECTION_NAME = "refresh_tokens"
