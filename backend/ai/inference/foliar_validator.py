"""
Foliar Quality & Biomarker Validation Module for AgriLens.
Provides pre-inference computer vision quality checks:
1. Blur Detection (Laplacian Variance)
2. Foliar / Crop Canopy Detection (HSV + Color Space Segmentation)
3. Foliar Biomarker Extraction (Chlorophyll ExG, Necrosis, Anthocyanin, Chlorosis)
"""

import io
from typing import Tuple, Dict, Any
import numpy as np
from PIL import Image
import cv2


class FoliarQualityValidator:
    # Thresholds calibrated for mobile camera field captures
    BLUR_THRESHOLD: float = 65.0
    MIN_VEGETATION_RATIO: float = 0.15
    MIN_IMAGE_DIMENSION: int = 120

    @classmethod
    def validate_image(cls, image_input: Any) -> Tuple[bool, str, str]:
        """
        Validates image for:
        - Readable format and sufficient dimensions
        - Focus sharpness / blur
        - Presence of plant foliage (non-crop rejection)

        Returns:
            (is_valid: bool, error_code: str, error_message: str)
        """
        try:
            if isinstance(image_input, bytes):
                pil_img = Image.open(io.BytesIO(image_input)).convert("RGB")
            elif isinstance(image_input, Image.Image):
                pil_img = image_input.convert("RGB")
            elif isinstance(image_input, np.ndarray):
                pil_img = Image.fromarray(image_input.astype("uint8")).convert("RGB")
            else:
                pil_img = Image.open(str(image_input)).convert("RGB")
        except Exception as e:
            return False, "CORRUPTED_IMAGE", f"Unable to decode image file: {e}"

        w, h = pil_img.size
        if w < cls.MIN_IMAGE_DIMENSION or h < cls.MIN_IMAGE_DIMENSION:
            return (
                False,
                "LOW_RESOLUTION",
                f"Image resolution ({w}x{h}) is too small. Please upload a clear photo of at least 200x200 pixels."
            )

        # Convert to OpenCV BGR and Grayscale
        rgb_arr = np.array(pil_img)
        gray = cv2.cvtColor(rgb_arr, cv2.COLOR_RGB2GRAY)

        # 1. Blur Detection using Laplacian Variance
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        if laplacian_var < cls.BLUR_THRESHOLD:
            return (
                False,
                "IMAGE_BLURRY",
                f"Image is too blurry or out of focus (sharpness score: {laplacian_var:.1f}). Please hold your camera steady and take a sharp photo of the cotton leaf."
            )

        # 2. Vegetation / Foliage Segmentation (HSV + LAB Color Space)
        hsv = cv2.cvtColor(rgb_arr, cv2.COLOR_RGB2HSV)
        
        # Green foliage mask
        green_mask = cv2.inRange(hsv, np.array([25, 30, 30]), np.array([95, 255, 255]))
        # Yellow/Chlorotic leaf mask
        yellow_mask = cv2.inRange(hsv, np.array([15, 35, 40]), np.array([25, 255, 255]))
        # Brown/Necrotic lesion mask
        brown_mask = cv2.inRange(hsv, np.array([8, 40, 20]), np.array([18, 255, 180]))
        # Red/Anthocyanin leaf mask (wraps around 0/180)
        red_mask1 = cv2.inRange(hsv, np.array([0, 40, 30]), np.array([12, 255, 240]))
        red_mask2 = cv2.inRange(hsv, np.array([165, 40, 30]), np.array([180, 255, 240]))
        
        combined_plant_mask = green_mask | yellow_mask | brown_mask | red_mask1 | red_mask2
        total_pixels = float(w * h)
        plant_pixel_count = float(cv2.countNonZero(combined_plant_mask))
        vegetation_ratio = plant_pixel_count / total_pixels

        if vegetation_ratio < cls.MIN_VEGETATION_RATIO:
            return (
                False,
                "NO_LEAF_DETECTED",
                f"No cotton leaf detected in the photo (foliage coverage: {vegetation_ratio * 100:.1f}%). Please ensure a cotton leaf is clearly centered in the camera frame."
            )

        return True, "OK", "Validation passed successfully."

    @classmethod
    def extract_biomarkers(cls, image_input: Any) -> Dict[str, float]:
        """
        Extracts foliar pathology biomarkers from cotton leaf pixels:
        - excess_green: 2*G - R - B chlorophyll index
        - necrotic_ratio: Percentage of dark necrotic disease lesions
        - chlorosis_ratio: Percentage of yellow mosaic / chlorotic leaf area
        - anthocyanin_ratio: Percentage of red/purple leaf reddening pigment
        - healthy_uniformity: Degree of uniform healthy green color
        """
        if isinstance(image_input, bytes):
            pil_img = Image.open(io.BytesIO(image_input)).convert("RGB")
        elif isinstance(image_input, Image.Image):
            pil_img = image_input.convert("RGB")
        elif isinstance(image_input, np.ndarray):
            pil_img = Image.fromarray(image_input.astype("uint8")).convert("RGB")
        else:
            pil_img = Image.open(str(image_input)).convert("RGB")

        rgb = np.array(pil_img, dtype=np.float32)
        r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]

        # Normalized Excess Green Index (ExG)
        exg = (2.0 * g - r - b) / 255.0
        hsv = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2HSV)

        # Plant mask
        green_mask = cv2.inRange(hsv, np.array([25, 30, 30]), np.array([95, 255, 255])) > 0
        yellow_mask = cv2.inRange(hsv, np.array([15, 35, 40]), np.array([25, 255, 255])) > 0
        brown_mask = cv2.inRange(hsv, np.array([8, 40, 20]), np.array([18, 255, 180])) > 0
        red_mask = (cv2.inRange(hsv, np.array([0, 40, 30]), np.array([12, 255, 240])) > 0) | \
                   (cv2.inRange(hsv, np.array([165, 40, 30]), np.array([180, 255, 240])) > 0)

        plant_mask = green_mask | yellow_mask | brown_mask | red_mask
        plant_pixel_total = np.maximum(np.sum(plant_mask), 1.0)

        mean_exg = float(np.mean(exg[plant_mask])) if np.sum(plant_mask) > 0 else 0.0
        green_ratio = float(np.sum(green_mask) / plant_pixel_total)
        necrotic_ratio = float(np.sum(brown_mask) / plant_pixel_total)
        chlorosis_ratio = float(np.sum(yellow_mask) / plant_pixel_total)
        anthocyanin_ratio = float(np.sum(red_mask) / plant_pixel_total)

        # Uniformity: Standard deviation of Green channel within leaf
        leaf_green_std = float(np.std(g[plant_mask])) if np.sum(plant_mask) > 0 else 50.0

        return {
            "mean_exg": round(mean_exg, 4),
            "green_ratio": round(green_ratio, 4),
            "necrotic_ratio": round(necrotic_ratio, 4),
            "chlorosis_ratio": round(chlorosis_ratio, 4),
            "anthocyanin_ratio": round(anthocyanin_ratio, 4),
            "green_std": round(leaf_green_std, 4),
        }
