"""
Data Augmentation Module for AgriLens AI Training Pipeline.
Defines GPU-accelerated Keras augmentation layers for training.
Validation and Test pipelines MUST NEVER use augmentation.
"""

import tensorflow as tf
from tensorflow.keras import Sequential
from tensorflow.keras.layers import (
    RandomFlip,
    RandomRotation,
    RandomZoom,
    RandomContrast,
    RandomBrightness
)


def get_training_augmentation(seed: int = 42) -> tf.keras.Sequential:
    """
    Constructs a tf.keras.Sequential model containing image augmentation layers.
    Includes: RandomFlip, RandomRotation, RandomZoom, RandomContrast, and RandomBrightness.
    
    Returns:
        tf.keras.Sequential data augmentation pipeline for training only.
    """
    augmentation = Sequential([
        RandomFlip("horizontal_and_vertical", seed=seed),
        RandomRotation(0.2, fill_mode="reflect", seed=seed),
        RandomZoom(0.2, fill_mode="reflect", seed=seed),
        RandomContrast(0.2, seed=seed),
        RandomBrightness(0.2, value_range=(-1.0, 1.0), seed=seed)
    ], name="data_augmentation")

    return augmentation
