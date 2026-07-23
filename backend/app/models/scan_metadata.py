# ============================================================
# AgriLens Backend — Scan Metadata Document Model
# ============================================================
# Defines the MongoDB document shape for user scan metadata.
# ============================================================

import uuid
from datetime import datetime, timezone


def create_scan_metadata_document(
    user_id: str,
    crop_id: str,
    image_path: str,
    disease_id: str | None = None,
    confidence: float = 0.0,
    model_version: str = "",
    prediction_time_ms: int = 0,
    offline_mode: bool = False,
    device_type: str = "unknown",
    status: str = "processed",
) -> dict:
    """
    Create a new scan metadata document dictionary for MongoDB insertion.

    Args:
        user_id: UUID of the user who performed the scan.
        crop_id: UUID of the scanned crop.
        image_path: Path/URL to the uploaded image.
        disease_id: UUID of the predicted disease (None if healthy or failed).
        confidence: Prediction confidence score (0.0 to 1.0).
        model_version: Version of the AI model used.
        prediction_time_ms: Time taken for inference in milliseconds.
        offline_mode: True if the scan was performed offline on the device.
        device_type: Type of device (e.g., "android", "ios", "web").
        status: Status of the scan (e.g., "processed", "failed").

    Returns:
        A dictionary ready to insert into the 'scans' collection.
    """
    now = datetime.now(timezone.utc)

    return {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "crop_id": crop_id,
        "image_path": image_path,
        "disease_id": disease_id,
        "confidence": confidence,
        "model_version": model_version,
        "prediction_time_ms": prediction_time_ms,
        "offline_mode": offline_mode,
        "device_type": device_type,
        "status": status,
        "created_at": now,
    }


# ----- Collection Name -----
COLLECTION_NAME = "scans"
