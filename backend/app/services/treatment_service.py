# ============================================================
# AgriLens Backend — Treatment Service
# ============================================================

from datetime import datetime, timezone
from app.database import get_database
from app.models.treatment import create_treatment_document, COLLECTION_NAME
from app.schemas.treatment import TreatmentCreateRequest, TreatmentUpdateRequest
from app.utils.exceptions import NotFoundException


async def get_all_treatments(active_only: bool = True) -> list[dict]:
    db = get_database()
    query = {"is_active": True} if active_only else {}
    cursor = db[COLLECTION_NAME].find(query).sort("name", 1)
    return await cursor.to_list(length=1000)


async def get_treatments_by_ids(treatment_ids: list[str]) -> list[dict]:
    if not treatment_ids:
        return []
    db = get_database()
    cursor = db[COLLECTION_NAME].find({"_id": {"$in": treatment_ids}, "is_active": True})
    return await cursor.to_list(length=len(treatment_ids))


async def get_treatment_by_id(treatment_id: str) -> dict:
    db = get_database()
    treatment = await db[COLLECTION_NAME].find_one({"_id": treatment_id})
    if not treatment:
        raise NotFoundException("Treatment not found")
    return treatment


async def create_treatment(data: TreatmentCreateRequest) -> dict:
    db = get_database()
    treatment_doc = create_treatment_document(
        name=data.name,
        description=data.description,
        type=data.type,
        dosage=data.dosage,
        frequency=data.frequency,
        precautions=data.precautions,
        is_active=data.is_active,
    )
    await db[COLLECTION_NAME].insert_one(treatment_doc)
    return treatment_doc


async def update_treatment(treatment_id: str, data: TreatmentUpdateRequest) -> dict:
    db = get_database()
    update_data = {k: v for k, v in data.model_dump(exclude_unset=True).items()}
    
    if not update_data:
        return await get_treatment_by_id(treatment_id)

    update_data["updated_at"] = datetime.now(timezone.utc)
    
    result = await db[COLLECTION_NAME].update_one(
        {"_id": treatment_id}, {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise NotFoundException("Treatment not found")
        
    return await get_treatment_by_id(treatment_id)


async def delete_treatment(treatment_id: str) -> None:
    db = get_database()
    result = await db[COLLECTION_NAME].delete_one({"_id": treatment_id})
    if result.deleted_count == 0:
        raise NotFoundException("Treatment not found")
