# ============================================================
# AgriLens Backend — Disease Schemas
# ============================================================

from datetime import datetime
from pydantic import BaseModel, Field


class DiseaseCreateRequest(BaseModel):
    crop_id: str
    name: str = Field(..., min_length=2, max_length=150)
    scientific_name: str = Field(default="", max_length=150)
    description: str = Field(default="", max_length=1000)
    symptoms: list[str] = Field(default_factory=list)
    treatment_ids: list[str] = Field(default_factory=list)
    prevention: list[str] = Field(default_factory=list)
    severity: str = Field(default="unknown")
    is_active: bool = True


class DiseaseUpdateRequest(BaseModel):
    name: str | None = Field(None, min_length=2, max_length=150)
    scientific_name: str | None = Field(None, max_length=150)
    description: str | None = Field(None, max_length=1000)
    symptoms: list[str] | None = None
    treatment_ids: list[str] | None = None
    prevention: list[str] | None = None
    severity: str | None = None
    is_active: bool | None = None


class DiseaseResponse(BaseModel):
    id: str = Field(..., alias="_id")
    crop_id: str
    name: str
    scientific_name: str
    description: str
    symptoms: list[str]
    treatment_ids: list[str]
    prevention: list[str]
    severity: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
