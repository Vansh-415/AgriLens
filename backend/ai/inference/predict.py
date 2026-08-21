"""
Inference Module for AgriLens Cotton Leaf Disease Classifier.
Loads trained model (EfficientNetV2/MobileNetV2) and labels.json for single-image diagnosis,
confidence scoring, and Test-Time Augmentation (TTA).
Dynamically adjusts image target dimensions based on model input shape.
"""

import io
import json
from pathlib import Path
from typing import Dict, Union, Any, List, Optional
import numpy as np
from PIL import Image
import tensorflow as tf

OptionalPath = Optional[Union[str, Path]]


class CottonDiseasePredictor:
    def __init__(self, model_path: OptionalPath = None, labels_path: OptionalPath = None, use_tta: bool = True):
        base_ai_models = Path(__file__).resolve().parent.parent.parent / "ai_models" / "cotton"
        
        self.model_path = Path(model_path) if model_path else base_ai_models / "best_model.keras"
        self.labels_path = Path(labels_path) if labels_path else base_ai_models / "labels.json"

        self.model: Optional[tf.keras.Model] = None
        self.labels_metadata: Dict[str, Any] = {}
        self.class_names: List[str] = []
        self.target_size = (288, 288)
        self.use_tta = use_tta

    def set_model_and_labels(self, model: tf.keras.Model, class_names: List[str]) -> None:
        """Directly inject in-memory model instance and class names for testing/inference."""
        self.model = model
        self.class_names = class_names
        if hasattr(model, 'input_shape') and model.input_shape:
            shape = model.input_shape
            h = shape[1] if shape[1] is not None else 288
            w = shape[2] if shape[2] is not None else 288
            self.target_size = (int(h), int(w))

    def load_resources(self) -> None:
        """Loads model binary and label metadata into memory."""
        if not self.labels_path.exists():
            raise FileNotFoundError(f"Labels mapping file missing at: {self.labels_path}")
        
        with open(self.labels_path, "r", encoding="utf-8") as f:
            self.labels_metadata = json.load(f)
            self.class_names = self.labels_metadata.get("class_names", [])

        if not self.model_path.exists():
            raise FileNotFoundError(f"Trained model file missing at: {self.model_path}")

        self.model = tf.keras.models.load_model(str(self.model_path), compile=False)
        
        # Dynamically infer target size from model input shape
        if hasattr(self.model, 'input_shape') and self.model.input_shape:
            shape = self.model.input_shape
            h = shape[1] if shape[1] is not None else 288
            w = shape[2] if shape[2] is not None else 288
            self.target_size = (int(h), int(w))

    def preprocess_image_input(self, image_input: Union[str, Path, bytes, Image.Image, np.ndarray]) -> np.ndarray:
        """
        Standardizes various input types (file path, raw bytes, PIL Image, or numpy array)
        into a preprocessed 4D batch tensor of shape (1, H, W, 3).
        """
        if isinstance(image_input, (str, Path)):
            img = Image.open(str(image_input)).convert("RGB")
        elif isinstance(image_input, bytes):
            img = Image.open(io.BytesIO(image_input)).convert("RGB")
        elif isinstance(image_input, Image.Image):
            img = image_input.convert("RGB")
        elif isinstance(image_input, np.ndarray):
            if image_input.ndim == 2:
                img = Image.fromarray(image_input).convert("RGB")
            else:
                img = Image.fromarray(image_input.astype('uint8')).convert("RGB")
        else:
            raise TypeError(f"Unsupported image input type: {type(image_input)}")

        img = img.resize(self.target_size, Image.Resampling.BILINEAR)
        img_array = np.array(img, dtype=np.float32)
        
        # Raw [0, 255] float32 tensor
        batch_tensor = np.expand_dims(img_array, axis=0)
        return batch_tensor

    def _apply_tta(self, batch_tensor: np.ndarray) -> np.ndarray:
        """
        Applies Test-Time Augmentation (TTA) across original, horizontal flip,
        and vertical flip views to compute ensemble probability distribution.
        """
        orig_pred = self.model.predict(batch_tensor, verbose=0)[0]

        # Horizontal flip view
        hflip_tensor = np.flip(batch_tensor, axis=2)
        hflip_pred = self.model.predict(hflip_tensor, verbose=0)[0]

        # Vertical flip view
        vflip_tensor = np.flip(batch_tensor, axis=1)
        vflip_pred = self.model.predict(vflip_tensor, verbose=0)[0]

        # Ensemble average
        mean_pred = (orig_pred + hflip_pred + vflip_pred) / 3.0
        return mean_pred

    def predict(self, image_input: Union[str, Path, bytes, Image.Image, np.ndarray], use_tta: Optional[bool] = None) -> Dict[str, Any]:
        """
        Performs inference on a single image.

        Returns:
            Dict containing:
                - 'predicted_class': str
                - 'confidence': float (0.0 to 1.0)
                - 'class_probabilities': Dict[str, float]
        """
        if self.model is None or not self.class_names:
            self.load_resources()

        batch_tensor = self.preprocess_image_input(image_input)

        run_tta = self.use_tta if use_tta is None else use_tta

        if run_tta:
            predictions = self._apply_tta(batch_tensor)
        else:
            predictions = self.model.predict(batch_tensor, verbose=0)[0]

        top_idx = int(np.argmax(predictions))
        predicted_class = self.class_names[top_idx]
        confidence = float(predictions[top_idx])

        class_probabilities = {
            cname: float(prob)
            for cname, prob in zip(self.class_names, predictions)
        }

        return {
            "predicted_class": predicted_class,
            "confidence": round(confidence, 4),
            "class_probabilities": {k: round(v, 4) for k, v in class_probabilities.items()}
        }
