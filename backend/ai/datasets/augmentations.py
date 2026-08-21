"""
Data Augmentation Module for AgriLens AI Training Pipeline.
Defines GPU-accelerated Keras augmentation layers for training.
Validation and Test pipelines MUST NEVER use augmentation.

Input images are expected in [0, 255] float32 range (no preprocess_input scaling).
"""

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import (
    RandomFlip,
    RandomRotation,
    RandomZoom,
    RandomContrast,
    RandomBrightness,
    RandomTranslation
)


def get_training_augmentation(seed: int = 42) -> Sequential:
    """
    Constructs a GPU-accelerated Sequential model containing realistic image augmentation layers.
    All parameters are tuned for a small cotton leaf dataset (~2,137 images).
    
    Returns:
        Sequential data augmentation pipeline for training only.
    """
    augmentation = Sequential([
        RandomFlip("horizontal_and_vertical", seed=seed),
        RandomRotation(0.042, fill_mode="reflect", seed=seed),      # ±15 degrees (15/360 ≈ 0.042)
        RandomZoom(0.1, fill_mode="reflect", seed=seed),             # ±10% zoom
        RandomContrast(0.15, seed=seed),                             # ±15% contrast
        RandomBrightness(0.1, value_range=(0.0, 255.0), seed=seed),  # ±10% brightness, INPUT IS [0, 255]
        RandomTranslation(height_factor=0.1, width_factor=0.1, fill_mode="reflect", seed=seed)  # ±10% shift
    ], name="data_augmentation")

    return augmentation
