"""
Central Configuration Module for AgriLens AI Training & Inference Pipeline.
Supports multi-architecture backbones (EfficientNetV2, ConvNeXt, MobileNetV3),
AdamW optimizer, Cosine Warmup learning rate decay, Mixed Precision, and TTA.
Auto-detects Kaggle, Google Colab, and local Windows environments.
"""

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Tuple, Optional


def resolve_dataset_dir() -> str:
    """Auto-detects dataset location across Kaggle, Google Colab, and Local Windows environments."""
    env_path = os.environ.get("DATASET_DIR")
    if env_path and os.path.exists(env_path):
        return env_path
    
    # Auto-scan Kaggle input directory dynamically
    if os.path.exists("/kaggle/input"):
        for root, dirs, files in os.walk("/kaggle/input"):
            if "Bacterial Blight" in dirs and "Healthy Leaf" in dirs:
                return root
        for root, dirs, files in os.walk("/kaggle/input"):
            if "original dataset" in Path(root).name.lower():
                return root

    possible_paths = [
        "/kaggle/input/agrilens-cotton-original-dataset/Cotton Leaf Disease Detection Dataset/Original Dataset",
        "/kaggle/input/agrilens-cotton-original-dataset/Original Dataset",
        "/kaggle/input/datasets/vanshshastri07/agrilens-cotton-original-dataset/Cotton Leaf Disease Detection Dataset/Original Dataset",
        "/kaggle/input/datasets/vanshshastri07/agrilens-cotton-original-dataset/Original Dataset",
        "/content/dataset/Original Dataset",
        r"D:\Cotton Leaf Disease Detection Dataset\Cotton Leaf Disease Detection Dataset\Original Dataset"
    ]

    for p in possible_paths:
        if os.path.exists(p):
            return p

    return possible_paths[-1]


@dataclass
class Config:
    # Dataset Configuration
    DATASET_DIR: str = field(default_factory=resolve_dataset_dir)
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

    # Architecture & Backbone Selection
    BACKBONE: str = "efficientnetv2_b0"
    MODEL_NAME: str = "cotton_efficientnetv2_b0"
    IMAGE_SIZE: Tuple[int, int] = (256, 256)
    COLOR_CHANNELS: int = 3
    INPUT_SHAPE: Tuple[int, int, int] = (256, 256, 3)

    # Data Split & Training Hyperparameters
    BATCH_SIZE: int = 32
    SEED: int = 42
    TRAIN_SPLIT: float = 0.70
    VAL_SPLIT: float = 0.15
    TEST_SPLIT: float = 0.15

    # Optimization Configuration
    OPTIMIZER_TYPE: str = "adamw"
    WEIGHT_DECAY: float = 1e-4
    GRADIENT_CLIPNORM: Optional[float] = 1.0

    # Loss Configuration — using built-in string loss for Keras 3 compatibility
    LOSS_TYPE: str = "sparse_categorical_crossentropy"

    # Learning Rate Scheduler Configuration
    SCHEDULER_TYPE: str = "cosine_warmup"
    WARMUP_EPOCHS: int = 3

    # Phase 1: Transfer Learning (frozen backbone, only head trains)
    EPOCHS: int = 10
    INITIAL_LR: float = 1e-3

    # Phase 2: Fine-Tuning (top layers unfrozen)
    FINE_TUNE_EPOCHS: int = 40
    FINE_TUNE_LR: float = 1e-4
    UNFREEZE_LAYERS: int = 80

    # Hardware & Performance Optimizations
    USE_MIXED_PRECISION: bool = True
    USE_TTA: bool = True  # Test Time Augmentation during inference/evaluation

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
        kaggle_export = "/kaggle/working/backend/backend/ai_models/cotton"
        if os.path.exists("/kaggle/working"):
            return Path(kaggle_export)
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
