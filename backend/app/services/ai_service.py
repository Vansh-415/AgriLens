# ============================================================
# AgriLens Backend — AI Model Service Singleton
# ============================================================

from typing import Dict, Any, Optional
import time
from app.utils.logger import get_logger

try:
    from ai.inference.predict import CottonDiseasePredictor
    HAS_AI_PREDICTOR = True
except ImportError:
    HAS_AI_PREDICTOR = False

logger = get_logger(__name__)

_predictor_instance: Optional[CottonDiseasePredictor] = None


def get_predictor_instance() -> CottonDiseasePredictor:
    """Returns singleton instance of CottonDiseasePredictor."""
    global _predictor_instance
    if not HAS_AI_PREDICTOR:
        raise RuntimeError("AI inference module (ai.inference.predict) is not installed or available.")
    
    if _predictor_instance is None:
        logger.info("Initializing CottonDiseasePredictor singleton instance...")
        _predictor_instance = CottonDiseasePredictor()
        _predictor_instance.load_resources()
        logger.info(f"CottonDiseasePredictor loaded model target size: {_predictor_instance.target_size}")
    
    return _predictor_instance


async def run_disease_prediction(image_bytes: bytes, use_tta: bool = True) -> Dict[str, Any]:
    """
    Executes disease inference on raw uploaded image bytes.

    Returns:
        Dict containing:
            - 'predicted_class': str
            - 'confidence': float
            - 'class_probabilities': Dict[str, float]
            - 'latency_ms': int
    """
    start_time = time.perf_counter()
    predictor = get_predictor_instance()
    
    # Run prediction
    result = predictor.predict(image_bytes, use_tta=use_tta)
    
    latency_ms = int((time.perf_counter() - start_time) * 1000)
    result["latency_ms"] = latency_ms
    
    return result
