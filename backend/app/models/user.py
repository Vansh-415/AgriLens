# ============================================================
# AgriLens Backend — User Document Model
# ============================================================
# Defines the MongoDB document shape for users.
# Uses UUID strings as the primary key (_id) instead of ObjectId.
#
# Roles:
#   "farmer" — default role for registered users
#   "admin"  — full system access
#
# Audit fields:
#   last_login    — timestamp of the most recent login
#   login_count   — total number of successful logins
#   account_status — "active" or "inactive"
# ============================================================

import uuid
from datetime import datetime, timezone


def create_user_document(
    email: str,
    full_name: str,
    password_hash: str,
    role: str = "farmer",
) -> dict:
    """
    Create a new user document dictionary for MongoDB insertion.

    Args:
        email: User's email address (stored lowercase, trimmed).
        full_name: User's display name.
        password_hash: Bcrypt-hashed password (never store plaintext).
        role: User role — "farmer" (default) or "admin".

    Returns:
        A dictionary ready to insert into the 'users' collection.
    """
    now = datetime.now(timezone.utc)

    return {
        "_id": str(uuid.uuid4()),
        "email": email.lower().strip(),
        "full_name": full_name.strip(),
        "password_hash": password_hash,
        "role": role,
        "account_status": "active",
        "last_login": None,
        "login_count": 0,
        "created_at": now,
        "updated_at": now,
    }


# ----- Collection Name -----
COLLECTION_NAME = "users"
