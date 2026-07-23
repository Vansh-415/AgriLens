# ============================================================
# AgriLens Backend — AI Model Registry Document
# ============================================================
# Tracks trained AI models in the database.
# Each registry entry points to a .keras model file in
# backend/ai_models/<crop>/model.keras
# ============================================================

import uuid
from datetime import datetime, timezone


def create_ai_model_registry_document(
    crop_id: str,
    model_name: str,
    model_path: str,
    version: str = "0.0.0",
    accuracy: float | None = None,
    input_size: int = 224,
    classes: list[str] | None = None,
    is_active: bool = False,
) -> dict:
    """
    Create a new AI model registry document for MongoDB insertion.

    Args:
        crop_id: UUID of the crop this model is trained for.
        model_name: Human-readable name (e.g., "cotton_disease_mobilenetv2").
        model_path: Relative path to the .keras file (e.g., "ai_models/cotton/model.keras").
        version: Semantic version of the trained model.
        accuracy: Model accuracy on the test set (0.0–1.0), None if not yet trained.
        input_size: Expected input image dimension in pixels (e.g., 224 for 224x224).
        classes: List of class labels the model can predict
                 (e.g., ["bacterial_blight", "healthy"]).
        is_active: Whether this model is currently used for inference.

    Returns:
        A dictionary ready to insert into the 'ai_model_registry' collection.
    """
    now = datetime.now(timezone.utc)

    return {
        "_id": str(uuid.uuid4()),
        "crop_id": crop_id,
        "model_name": model_name,
        "model_path": model_path,
        "version": version,
        "accuracy": accuracy,
        "input_size": input_size,
        "classes": classes or [],
        "is_active": is_active,
        "created_at": now,
        "updated_at": now,
    }


# ----- Collection Name -----
COLLECTION_NAME = "ai_model_registry"
