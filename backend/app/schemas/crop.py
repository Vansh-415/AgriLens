# ============================================================
# AgriLens Backend — Crop Schemas
# ============================================================

from datetime import datetime
from pydantic import BaseModel, Field


class CropCreateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    scientific_name: str = Field(default="", max_length=150)
    description: str = Field(default="", max_length=1000)
    is_active: bool = True


class CropUpdateRequest(BaseModel):
    name: str | None = Field(None, min_length=2, max_length=100)
    scientific_name: str | None = Field(None, max_length=150)
    description: str | None = Field(None, max_length=1000)
    is_active: bool | None = None


class CropResponse(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    scientific_name: str
    description: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
