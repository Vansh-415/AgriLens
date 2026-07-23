# ============================================================
# AgriLens Backend — Treatment Document Model
# ============================================================
# Defines the MongoDB document shape for disease treatments.
# ============================================================

import uuid
from datetime import datetime, timezone


def create_treatment_document(
    name: str,
    description: str,
    type: str,
    dosage: str = "",
    frequency: str = "",
    precautions: str = "",
    is_active: bool = True,
) -> dict:
    """
    Create a new treatment document dictionary for MongoDB insertion.

    Args:
        name: Name of the treatment.
        description: Detailed explanation of how to apply it.
        type: Treatment type (e.g., "chemical", "organic", "biological").
        dosage: Recommended dosage amount.
        frequency: How often to apply (e.g., "Once a week for 3 weeks").
        precautions: Safety warnings or special handling instructions.
        is_active: Whether this treatment is currently active in the system.

    Returns:
        A dictionary ready to insert into the 'treatments' collection.
    """
    now = datetime.now(timezone.utc)

    return {
        "_id": str(uuid.uuid4()),
        "name": name,
        "description": description,
        "type": type,
        "dosage": dosage,
        "frequency": frequency,
        "precautions": precautions,
        "is_active": is_active,
        "created_at": now,
        "updated_at": now,
    }


# ----- Collection Name -----
COLLECTION_NAME = "treatments"
