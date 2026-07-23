# ============================================================
# AgriLens Backend — Treatment Schemas
# ============================================================

from datetime import datetime
from pydantic import BaseModel, Field


class TreatmentCreateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    description: str = Field(..., min_length=2, max_length=1000)
    type: str = Field(..., description="chemical, organic, biological")
    dosage: str = Field(default="", max_length=250)
    frequency: str = Field(default="", max_length=250)
    precautions: str = Field(default="", max_length=500)
    is_active: bool = True


class TreatmentUpdateRequest(BaseModel):
    name: str | None = Field(None, min_length=2, max_length=150)
    description: str | None = Field(None, max_length=1000)
    type: str | None = None
    dosage: str | None = Field(None, max_length=250)
    frequency: str | None = Field(None, max_length=250)
    precautions: str | None = Field(None, max_length=500)
    is_active: bool | None = None


class TreatmentResponse(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    description: str
    type: str
    dosage: str
    frequency: str
    precautions: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
