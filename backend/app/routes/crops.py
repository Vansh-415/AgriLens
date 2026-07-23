# ============================================================
# AgriLens Backend — Crop Routes
# ============================================================

from fastapi import APIRouter, Depends
from typing import Any

from app.schemas.crop import CropCreateRequest, CropUpdateRequest, CropResponse
from app.services.crop_service import (
    get_all_crops,
    get_crop_by_id,
    create_crop,
    update_crop,
    delete_crop,
)
from app.dependencies.auth import get_current_user, require_admin

router = APIRouter(prefix="/crops", tags=["Crops"])


@router.get("/", response_model=dict[str, Any])
async def list_crops(
    active_only: bool = True,
    current_user: dict = Depends(get_current_user),
):
    """Get a list of all crops."""
    crops = await get_all_crops(active_only=active_only)
    return {"success": True, "data": crops}


@router.get("/{crop_id}", response_model=dict[str, Any])
async def get_crop(
    crop_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Get details of a specific crop by ID."""
    crop = await get_crop_by_id(crop_id)
    return {"success": True, "data": crop}


@router.post("/", response_model=dict[str, Any], status_code=201)
async def add_crop(
    data: CropCreateRequest,
    current_user: dict = Depends(require_admin),
):
    """Add a new crop (Admin only)."""
    crop = await create_crop(data)
    return {"success": True, "message": "Crop created successfully", "data": crop}


@router.put("/{crop_id}", response_model=dict[str, Any])
async def edit_crop(
    crop_id: str,
    data: CropUpdateRequest,
    current_user: dict = Depends(require_admin),
):
    """Update a crop (Admin only)."""
    crop = await update_crop(crop_id, data)
    return {"success": True, "message": "Crop updated successfully", "data": crop}


@router.delete("/{crop_id}", response_model=dict[str, Any])
async def remove_crop(
    crop_id: str,
    current_user: dict = Depends(require_admin),
):
    """Delete a crop (Admin only)."""
    await delete_crop(crop_id)
    return {"success": True, "message": "Crop deleted successfully"}
