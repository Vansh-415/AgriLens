# ============================================================
# AgriLens Backend — Disease Routes
# ============================================================

from fastapi import APIRouter, Depends
from typing import Any

from app.schemas.disease import DiseaseCreateRequest, DiseaseUpdateRequest, DiseaseResponse
from app.services.disease_service import (
    get_all_diseases,
    get_disease_by_id,
    create_disease,
    update_disease,
    delete_disease,
)
from app.dependencies.auth import get_current_user, require_admin

router = APIRouter(prefix="/diseases", tags=["Diseases"])


@router.get("/", response_model=dict[str, Any])
async def list_diseases(
    crop_id: str | None = None,
    active_only: bool = True,
    current_user: dict = Depends(get_current_user),
):
    """Get a list of all diseases, optionally filtered by crop."""
    diseases = await get_all_diseases(crop_id=crop_id, active_only=active_only)
    return {"success": True, "data": diseases}


@router.get("/{disease_id}", response_model=dict[str, Any])
async def get_disease(
    disease_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Get details of a specific disease by ID."""
    disease = await get_disease_by_id(disease_id)
    return {"success": True, "data": disease}


@router.post("/", response_model=dict[str, Any], status_code=201)
async def add_disease(
    data: DiseaseCreateRequest,
    current_user: dict = Depends(require_admin),
):
    """Add a new disease (Admin only)."""
    disease = await create_disease(data)
    return {"success": True, "message": "Disease created successfully", "data": disease}


@router.put("/{disease_id}", response_model=dict[str, Any])
async def edit_disease(
    disease_id: str,
    data: DiseaseUpdateRequest,
    current_user: dict = Depends(require_admin),
):
    """Update a disease (Admin only)."""
    disease = await update_disease(disease_id, data)
    return {"success": True, "message": "Disease updated successfully", "data": disease}


@router.delete("/{disease_id}", response_model=dict[str, Any])
async def remove_disease(
    disease_id: str,
    current_user: dict = Depends(require_admin),
):
    """Delete a disease (Admin only)."""
    await delete_disease(disease_id)
    return {"success": True, "message": "Disease deleted successfully"}
