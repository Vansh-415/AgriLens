# ============================================================
# AgriLens Backend — Crop Document Model
# ============================================================
# Defines the MongoDB document shape for crops.
# Uses UUID strings as the primary key (_id) instead of ObjectId.
# ============================================================

import uuid
from datetime import datetime, timezone


def create_crop_document(
    name: str,
    scientific_name: str = "",
    description: str = "",
    is_active: bool = True,
) -> dict:
    """
    Create a new crop document dictionary for MongoDB insertion.

    Args:
        name: Common name of the crop (e.g., "Cotton").
        scientific_name: Scientific/botanical name (e.g., "Gossypium").
        description: Brief description of the crop.
        is_active: Whether this crop is currently active in the system.

    Returns:
        A dictionary ready to insert into the 'crops' collection.
    """
    now = datetime.now(timezone.utc)

    return {
        "_id": str(uuid.uuid4()),
        "name": name,
        "scientific_name": scientific_name,
        "description": description,
        "is_active": is_active,
        "created_at": now,
        "updated_at": now,
    }


# ----- Collection Name -----
COLLECTION_NAME = "crops"
