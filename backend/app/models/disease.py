# ============================================================
# AgriLens Backend — Disease Document Model
# ============================================================
# Defines the MongoDB document shape for crop diseases.
# Each disease is linked to a crop via crop_id (UUID string).
# ============================================================

import uuid
from datetime import datetime, timezone


def create_disease_document(
    crop_id: str,
    name: str,
    scientific_name: str = "",
    description: str = "",
    symptoms: list[str] | None = None,
    treatment_ids: list[str] | None = None,
    prevention: list[str] | None = None,
    severity: str = "unknown",
    is_active: bool = True,
) -> dict:
    """
    Create a new disease document dictionary for MongoDB insertion.

    Args:
        crop_id: UUID of the parent crop this disease affects.
        name: Common name of the disease (e.g., "Bacterial Blight").
        scientific_name: Scientific name of the pathogen.
        description: Brief description of the disease.
        symptoms: List of visible symptoms.
        treatment_ids: List of UUIDs referencing documents in the treatments
                       collection. Keeps the database normalized so one disease
                       can share treatments with others.
        prevention: List of preventive measures.
        severity: Severity level ("low", "medium", "high", "critical", "unknown").
        is_active: Whether this disease is currently active in the system.

    Returns:
        A dictionary ready to insert into the 'diseases' collection.
    """
    now = datetime.now(timezone.utc)

    return {
        "_id": str(uuid.uuid4()),
        "crop_id": crop_id,
        "name": name,
        "scientific_name": scientific_name,
        "description": description,
        "symptoms": symptoms or [],
        "treatment_ids": treatment_ids or [],
        "prevention": prevention or [],
        "severity": severity,
        "is_active": is_active,
        "created_at": now,
        "updated_at": now,
    }


# ----- Collection Name -----
COLLECTION_NAME = "diseases"
