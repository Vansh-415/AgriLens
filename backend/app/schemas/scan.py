# ============================================================
# AgriLens Backend — Scan Metadata Schemas
# ============================================================

from datetime import datetime
from pydantic import BaseModel, Field


class ScanCreateRequest(BaseModel):
    crop_id: str
    image_path: str
    disease_id: str | None = None
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    model_version: str = Field(default="")
    prediction_time_ms: int = Field(default=0, ge=0)
    offline_mode: bool = False
    device_type: str = Field(default="unknown")
    status: str = Field(default="processed")


class ScanResponse(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: str
    crop_id: str
    image_path: str
    disease_id: str | None
    confidence: float
    model_version: str
    prediction_time_ms: int
    offline_mode: bool
    device_type: str
    status: str
    created_at: datetime

    class Config:
        populate_by_name = True
