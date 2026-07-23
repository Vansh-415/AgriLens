# ============================================================
# AgriLens Backend — Scan Service
# ============================================================

from app.database import get_database
from app.models.scan_metadata import create_scan_metadata_document, COLLECTION_NAME
from app.schemas.scan import ScanCreateRequest
from app.utils.exceptions import NotFoundException


async def get_user_scans(user_id: str, limit: int = 50, skip: int = 0) -> list[dict]:
    db = get_database()
    cursor = db[COLLECTION_NAME].find({"user_id": user_id}).sort("created_at", -1).skip(skip).limit(limit)
    return await cursor.to_list(length=limit)


async def get_all_scans(limit: int = 100, skip: int = 0) -> list[dict]:
    """For admin use."""
    db = get_database()
    cursor = db[COLLECTION_NAME].find({}).sort("created_at", -1).skip(skip).limit(limit)
    return await cursor.to_list(length=limit)


async def get_scan_by_id(scan_id: str) -> dict:
    db = get_database()
    scan = await db[COLLECTION_NAME].find_one({"_id": scan_id})
    if not scan:
        raise NotFoundException("Scan not found")
    return scan


async def create_scan_metadata(user_id: str, data: ScanCreateRequest) -> dict:
    db = get_database()
    scan_doc = create_scan_metadata_document(
        user_id=user_id,
        crop_id=data.crop_id,
        image_path=data.image_path,
        disease_id=data.disease_id,
        confidence=data.confidence,
        model_version=data.model_version,
        prediction_time_ms=data.prediction_time_ms,
        offline_mode=data.offline_mode,
        device_type=data.device_type,
        status=data.status,
    )
    await db[COLLECTION_NAME].insert_one(scan_doc)
    return scan_doc
