"""
Callbacks Module for AgriLens AI Training Pipeline.
Configures EarlyStopping, ReduceLROnPlateau, ModelCheckpoint, CSVLogger, and TensorBoard callbacks.
"""

import os
from pathlib import Path
from typing import List
import tensorflow as tf
from tensorflow.keras.callbacks import (
    EarlyStopping,
    ReduceLROnPlateau,
    ModelCheckpoint,
    CSVLogger,
    TensorBoard
)


def create_training_callbacks(
    models_dir: Path,
    logs_dir: Path,
    history_dir: Path,
    phase_name: str = "phase1"
) -> List[tf.keras.callbacks.Callback]:
    """
    Creates and returns a list of Keras training callbacks.

    Args:
        models_dir: Path to directory where model checkpoints will be saved.
        logs_dir: Path to TensorBoard logs directory.
        history_dir: Path to CSV training logs directory.
        phase_name: String prefix identifier ("phase1" or "fine_tune").

    Returns:
        List of configured Keras Callback objects.
    """
    models_dir.mkdir(parents=True, exist_ok=True)
    logs_dir.mkdir(parents=True, exist_ok=True)
    history_dir.mkdir(parents=True, exist_ok=True)

    checkpoint_path = models_dir / f"checkpoint_{phase_name}.keras"
    csv_log_path = history_dir / f"history_{phase_name}.csv"
    tb_log_dir = logs_dir / phase_name

    callbacks = [
        # Early Stopping to prevent overfitting
        EarlyStopping(
            monitor="val_loss",
            patience=5,
            restore_best_weights=True,
            verbose=1
        ),
        # Reduce learning rate when validation loss plateaus
        ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.2,
            patience=2,
            min_lr=1e-7,
            verbose=1
        ),
        # Save best model checkpoint based on validation accuracy
        ModelCheckpoint(
            filepath=str(checkpoint_path),
            monitor="val_accuracy",
            save_best_only=True,
            save_weights_only=False,
            verbose=1
        ),
        # Save epoch-by-epoch CSV training metrics history
        CSVLogger(
            filename=str(csv_log_path),
            separator=",",
            append=False
        ),
        # Log metrics and computational graph for TensorBoard visualization
        TensorBoard(
            log_dir=str(tb_log_dir),
            histogram_freq=1,
            write_graph=True
        )
    ]

    return callbacks
