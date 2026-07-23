# ============================================================
# AgriLens Backend — Crop Service
# ============================================================

from datetime import datetime, timezone
from app.database import get_database
from app.models.crop import create_crop_document, COLLECTION_NAME
from app.schemas.crop import CropCreateRequest, CropUpdateRequest
from app.utils.exceptions import NotFoundException


async def get_all_crops(active_only: bool = True) -> list[dict]:
    db = get_database()
    query = {"is_active": True} if active_only else {}
    cursor = db[COLLECTION_NAME].find(query).sort("name", 1)
    return await cursor.to_list(length=1000)


async def get_crop_by_id(crop_id: str) -> dict:
    db = get_database()
    crop = await db[COLLECTION_NAME].find_one({"_id": crop_id})
    if not crop:
        raise NotFoundException("Crop not found")
    return crop


async def create_crop(data: CropCreateRequest) -> dict:
    db = get_database()
    crop_doc = create_crop_document(
        name=data.name,
        scientific_name=data.scientific_name,
        description=data.description,
        is_active=data.is_active,
    )
    await db[COLLECTION_NAME].insert_one(crop_doc)
    return crop_doc


async def update_crop(crop_id: str, data: CropUpdateRequest) -> dict:
    db = get_database()
    update_data = {k: v for k, v in data.model_dump(exclude_unset=True).items()}
    
    if not update_data:
        return await get_crop_by_id(crop_id)

    update_data["updated_at"] = datetime.now(timezone.utc)
    
    result = await db[COLLECTION_NAME].update_one(
        {"_id": crop_id}, {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise NotFoundException("Crop not found")
        
    return await get_crop_by_id(crop_id)


async def delete_crop(crop_id: str) -> None:
    db = get_database()
    result = await db[COLLECTION_NAME].delete_one({"_id": crop_id})
    if result.deleted_count == 0:
        raise NotFoundException("Crop not found")
