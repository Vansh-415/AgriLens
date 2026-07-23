# ============================================================
# AgriLens Backend — Disease Service
# ============================================================

from datetime import datetime, timezone
from app.database import get_database
from app.models.disease import create_disease_document, COLLECTION_NAME
from app.schemas.disease import DiseaseCreateRequest, DiseaseUpdateRequest
from app.utils.exceptions import NotFoundException, BadRequestException
from app.services.crop_service import get_crop_by_id


async def get_all_diseases(crop_id: str | None = None, active_only: bool = True) -> list[dict]:
    db = get_database()
    query = {}
    if active_only:
        query["is_active"] = True
    if crop_id:
        query["crop_id"] = crop_id
        
    cursor = db[COLLECTION_NAME].find(query).sort("name", 1)
    return await cursor.to_list(length=1000)


async def get_disease_by_id(disease_id: str) -> dict:
    db = get_database()
    disease = await db[COLLECTION_NAME].find_one({"_id": disease_id})
    if not disease:
        raise NotFoundException("Disease not found")
    return disease


async def create_disease(data: DiseaseCreateRequest) -> dict:
    # Verify crop exists
    try:
        await get_crop_by_id(data.crop_id)
    except NotFoundException:
        raise BadRequestException("Invalid crop_id")

    db = get_database()
    disease_doc = create_disease_document(
        crop_id=data.crop_id,
        name=data.name,
        scientific_name=data.scientific_name,
        description=data.description,
        symptoms=data.symptoms,
        treatment_ids=data.treatment_ids,
        prevention=data.prevention,
        severity=data.severity,
        is_active=data.is_active,
    )
    await db[COLLECTION_NAME].insert_one(disease_doc)
    return disease_doc


async def update_disease(disease_id: str, data: DiseaseUpdateRequest) -> dict:
    db = get_database()
    update_data = {k: v for k, v in data.model_dump(exclude_unset=True).items()}
    
    if not update_data:
        return await get_disease_by_id(disease_id)

    update_data["updated_at"] = datetime.now(timezone.utc)
    
    result = await db[COLLECTION_NAME].update_one(
        {"_id": disease_id}, {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise NotFoundException("Disease not found")
        
    return await get_disease_by_id(disease_id)


async def delete_disease(disease_id: str) -> None:
    db = get_database()
    result = await db[COLLECTION_NAME].delete_one({"_id": disease_id})
    if result.deleted_count == 0:
        raise NotFoundException("Disease not found")
