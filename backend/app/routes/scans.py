# ============================================================
# AgriLens Backend — Scan Routes
# ============================================================

from fastapi import APIRouter, Depends, Query
from typing import Any

from app.schemas.scan import ScanCreateRequest, ScanResponse
from app.services.scan_service import (
    get_user_scans,
    get_all_scans,
    get_scan_by_id,
    create_scan_metadata,
)
from app.dependencies.auth import get_current_user, require_admin
from app.utils.exceptions import ForbiddenException

router = APIRouter(prefix="/scans", tags=["Scans"])


@router.get("/", response_model=dict[str, Any])
async def list_scans(
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
    current_user: dict = Depends(get_current_user),
):
    """Get a list of scans for the current user."""
    scans = await get_user_scans(user_id=current_user["_id"], limit=limit, skip=skip)
    return {"success": True, "data": scans}


@router.get("/all", response_model=dict[str, Any])
async def list_all_scans(
    limit: int = Query(100, ge=1, le=500),
    skip: int = Query(0, ge=0),
    current_user: dict = Depends(require_admin),
):
    """Get a list of all scans in the system (Admin only)."""
    scans = await get_all_scans(limit=limit, skip=skip)
    return {"success": True, "data": scans}


@router.get("/{scan_id}", response_model=dict[str, Any])
async def get_scan(
    scan_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Get details of a specific scan by ID."""
    scan = await get_scan_by_id(scan_id)
    
    # Ensure user can only view their own scans unless they are an admin
    if scan["user_id"] != current_user["_id"] and current_user["role"] != "admin":
        raise ForbiddenException("You do not have permission to view this scan")
        
    return {"success": True, "data": scan}


@router.post("/", response_model=dict[str, Any], status_code=201)
async def add_scan_metadata(
    data: ScanCreateRequest,
    current_user: dict = Depends(get_current_user),
):
    """Save scan metadata."""
    scan = await create_scan_metadata(user_id=current_user["_id"], data=data)
    return {"success": True, "message": "Scan metadata saved successfully", "data": scan}
