# ============================================================
# AgriLens Backend — Real-Time AI Prediction & Diagnosis Route
# ============================================================

from fastapi import APIRouter, File, UploadFile, Query, Depends, HTTPException, status
from typing import Any, Optional
import time

from app.services.ai_service import run_disease_prediction
from app.services.treatment_advisory_service import generate_personalized_advisory
from app.services.scan_service import create_scan_metadata
from app.schemas.scan import ScanCreateRequest
from app.dependencies.auth import get_optional_current_user
from app.utils.logger import get_logger

logger = get_logger(__name__)

router = APIRouter(prefix="/predict", tags=["AI Prediction"])


@router.post("/", response_model=dict[str, Any], status_code=status.HTTP_200_OK)
async def predict_crop_disease(
    file: UploadFile = File(..., description="Cotton leaf image file (JPEG, PNG, WEBP)"),
    land_acres: float = Query(1.0, ge=0.1, le=100.0, description="Farmer land area in acres for dosage calculation"),
    use_tta: bool = Query(True, description="Enable Test-Time Augmentation ensemble for maximum accuracy"),
    current_user: Optional[dict] = Depends(get_optional_current_user)
):
    """
    Real-time AI Diagnosis Endpoint.
    Accepts uploaded leaf image file, performs 95.33% EfficientNetV2 inference,
    and returns acreage-calculated personalized disease advisory.
    Automatically saves scan record to MongoDB if user is authenticated.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Please upload a valid image file (JPEG, PNG, WEBP)."
        )

    try:
        image_bytes = await file.read()
        if len(image_bytes) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Empty image file received."
            )
        
        if len(image_bytes) > 10 * 1024 * 1024:  # 10 MB limit
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image file too large. Maximum supported size is 10 MB."
            )

        start_time = time.perf_counter()

        # 1. Run AI Inference (95.33% EfficientNetV2-B1 Model)
        prediction_result = await run_disease_prediction(image_bytes, use_tta=use_tta)

        predicted_class = prediction_result["predicted_class"]
        confidence = prediction_result["confidence"]
        class_probabilities = prediction_result["class_probabilities"]
        prediction_time_ms = prediction_result["latency_ms"]

        # 2. Generate Personalized Acreage-Calculated Treatment Advisory
        personalized_advisory = generate_personalized_advisory(
            disease_name=predicted_class,
            land_acres=land_acres
        )

        total_latency_ms = int((time.perf_counter() - start_time) * 1000)

        # 3. Save Scan Metadata to MongoDB if User is Authenticated
        saved_scan_id = None
        if current_user and "_id" in current_user:
            try:
                scan_req = ScanCreateRequest(
                    crop_id="cotton",
                    image_path=f"uploads/{file.filename}",
                    disease_id=predicted_class.lower().replace(" ", "_"),
                    confidence=confidence,
                    model_version="efficientnetv2_b1_v1.0",
                    prediction_time_ms=prediction_time_ms,
                    offline_mode=False,
                    device_type="web",
                    status="processed"
                )
                saved_scan = await create_scan_metadata(user_id=current_user["_id"], data=scan_req)
                saved_scan_id = str(saved_scan.get("_id"))
            except Exception as ex:
                logger.warning(f"Failed to persist scan history to database: {ex}")

        return {
            "success": True,
            "message": f"Diagnosis completed in {total_latency_ms} ms",
            "data": {
                "predicted_class": predicted_class,
                "confidence": confidence,
                "confidence_pct": f"{confidence * 100.0:.2f}%",
                "prediction_time_ms": prediction_time_ms,
                "total_time_ms": total_latency_ms,
                "model_version": "efficientnetv2_b1_v1.0",
                "class_probabilities": class_probabilities,
                "personalized_advisory": personalized_advisory,
                "saved_scan_id": saved_scan_id
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Prediction Service Error: {str(e)}"
        )
