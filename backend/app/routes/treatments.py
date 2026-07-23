# ============================================================
# AgriLens Backend — Treatment Routes
# ============================================================

from fastapi import APIRouter, Depends
from typing import Any

from app.schemas.treatment import TreatmentCreateRequest, TreatmentUpdateRequest, TreatmentResponse
from app.services.treatment_service import (
    get_all_treatments,
    get_treatment_by_id,
    create_treatment,
    update_treatment,
    delete_treatment,
)
from app.dependencies.auth import get_current_user, require_admin

router = APIRouter(prefix="/treatments", tags=["Treatments"])


@router.get("/", response_model=dict[str, Any])
async def list_treatments(
    active_only: bool = True,
    current_user: dict = Depends(get_current_user),
):
    """Get a list of all treatments."""
    treatments = await get_all_treatments(active_only=active_only)
    return {"success": True, "data": treatments}


@router.get("/{treatment_id}", response_model=dict[str, Any])
async def get_treatment(
    treatment_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Get details of a specific treatment by ID."""
    treatment = await get_treatment_by_id(treatment_id)
    return {"success": True, "data": treatment}


@router.post("/", response_model=dict[str, Any], status_code=201)
async def add_treatment(
    data: TreatmentCreateRequest,
    current_user: dict = Depends(require_admin),
):
    """Add a new treatment (Admin only)."""
    treatment = await create_treatment(data)
    return {"success": True, "message": "Treatment created successfully", "data": treatment}


@router.put("/{treatment_id}", response_model=dict[str, Any])
async def edit_treatment(
    treatment_id: str,
    data: TreatmentUpdateRequest,
    current_user: dict = Depends(require_admin),
):
    """Update a treatment (Admin only)."""
    treatment = await update_treatment(treatment_id, data)
    return {"success": True, "message": "Treatment updated successfully", "data": treatment}


@router.delete("/{treatment_id}", response_model=dict[str, Any])
async def remove_treatment(
    treatment_id: str,
    current_user: dict = Depends(require_admin),
):
    """Delete a treatment (Admin only)."""
    await delete_treatment(treatment_id)
    return {"success": True, "message": "Treatment deleted successfully"}
