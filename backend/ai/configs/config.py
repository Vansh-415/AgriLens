"""
Central Configuration Module for AgriLens AI Training Pipeline.
Controls all dataset paths, model hyperparameters, training configurations, and output directories.
"""

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Tuple


@dataclass
class Config:
    # Dataset Configuration
    DATASET_DIR: str = r"D:\Cotton Leaf Disease Detection Dataset\Cotton Leaf Disease Detection Dataset\Original Dataset"
    NUM_CLASSES: int = 7
    CLASS_NAMES: List[str] = field(default_factory=lambda: [
        "Bacterial Blight",
        "Curl Virus",
        "Healthy Leaf",
        "Herbicide Growth Damage",
        "Leaf Hopper Jassids",
        "Leaf Redding",
        "Leaf Variegation"
    ])

    # Model & Input Configuration
    MODEL_NAME: str = "cotton_mobilenetv2"
    IMAGE_SIZE: Tuple[int, int] = (224, 224)
    COLOR_CHANNELS: int = 3
    INPUT_SHAPE: Tuple[int, int, int] = (224, 224, 3)

    # Data Split & Training Hyperparameters
    BATCH_SIZE: int = 32
    SEED: int = 42
    TRAIN_SPLIT: float = 0.70
    VAL_SPLIT: float = 0.15
    TEST_SPLIT: float = 0.15

    # Phase 1: Transfer Learning (Frozen Backbone)
    EPOCHS: int = 30
    INITIAL_LR: float = 1e-3

    # Phase 2: Fine-Tuning (Unfrozen Top Layers)
    FINE_TUNE_EPOCHS: int = 15
    FINE_TUNE_LR: float = 1e-5
    UNFREEZE_LAYERS: int = 30

    # Output & Export Directories
    BASE_DIR: Path = field(default_factory=lambda: Path(__file__).resolve().parent.parent)
    
    @property
    def OUTPUTS_DIR(self) -> Path:
        return self.BASE_DIR / "outputs"

    @property
    def MODELS_DIR(self) -> Path:
        return self.OUTPUTS_DIR / "models"

    @property
    def LOGS_DIR(self) -> Path:
        return self.OUTPUTS_DIR / "logs"

    @property
    def HISTORY_DIR(self) -> Path:
        return self.OUTPUTS_DIR / "history"

    @property
    def METRICS_DIR(self) -> Path:
        return self.OUTPUTS_DIR / "metrics"

    @property
    def PLOTS_DIR(self) -> Path:
        return self.OUTPUTS_DIR / "plots"

    @property
    def REPORTS_DIR(self) -> Path:
        return self.BASE_DIR / "reports"

    @property
    def EXPORT_DIR(self) -> Path:
        # Export target location for production model serving
        return self.BASE_DIR.parent / "ai_models" / "cotton"

    def ensure_directories(self) -> None:
        """Create all necessary output and export directories if they do not exist."""
        for d in [
            self.OUTPUTS_DIR,
            self.MODELS_DIR,
            self.LOGS_DIR,
            self.HISTORY_DIR,
            self.METRICS_DIR,
            self.PLOTS_DIR,
            self.REPORTS_DIR,
            self.EXPORT_DIR
        ]:
            d.mkdir(parents=True, exist_ok=True)


# Global Singleton Config Instance
config = Config()
