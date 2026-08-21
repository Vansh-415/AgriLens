"""
Callbacks Module for AgriLens AI Training Pipeline.
Configures Cosine Decay with Linear Warmup, ReduceLROnPlateau, EarlyStopping,
ModelCheckpoint, CSVLogger, and TerminateOnNaN.
Compatible across Keras 3, Keras 2, and TensorFlow 2.x.
"""

import os
from pathlib import Path
from typing import List
import numpy as np
import tensorflow as tf
from tensorflow.keras.callbacks import (
    EarlyStopping,
    ReduceLROnPlateau,
    ModelCheckpoint,
    CSVLogger,
    TerminateOnNaN,
    LearningRateScheduler
)


def make_cosine_decay_warmup_scheduler(
    target_lr: float = 1e-3,
    warmup_epochs: int = 3,
    total_epochs: int = 10,
    min_lr: float = 1e-6
) -> LearningRateScheduler:
    """
    Creates a native Keras LearningRateScheduler applying linear Warmup followed by Cosine Annealing.
    """
    target_lr = float(target_lr)
    warmup_epochs = int(warmup_epochs)
    total_epochs = int(total_epochs)
    min_lr = float(min_lr)

    def lr_schedule(epoch: int) -> float:
        if epoch < warmup_epochs:
            return target_lr * (float(epoch + 1) / float(warmup_epochs))
        else:
            progress = float(epoch - warmup_epochs) / float(max(1, total_epochs - warmup_epochs))
            cosine_decay = 0.5 * (1.0 + float(np.cos(np.pi * progress)))
            return min_lr + (target_lr - min_lr) * cosine_decay

    return LearningRateScheduler(lr_schedule)


# Backwards compatibility alias
class CosineDecayWithWarmupCallback(LearningRateScheduler):
    def __init__(self, target_lr: float = 1e-3, warmup_epochs: int = 3, total_epochs: int = 10, min_lr: float = 1e-6):
        def lr_schedule(epoch: int) -> float:
            if epoch < warmup_epochs:
                return float(target_lr) * (float(epoch + 1) / float(warmup_epochs))
            else:
                progress = float(epoch - warmup_epochs) / float(max(1, total_epochs - warmup_epochs))
                cosine_decay = 0.5 * (1.0 + float(np.cos(np.pi * progress)))
                return float(min_lr) + (float(target_lr) - float(min_lr)) * cosine_decay
        super().__init__(lr_schedule)


def create_training_callbacks(
    models_dir: Path,
    logs_dir: Path,
    history_dir: Path,
    phase_name: str = "phase1",
    scheduler_type: str = "cosine_warmup",
    target_lr: float = 1e-3,
    warmup_epochs: int = 3,
    total_epochs: int = 10,
    patience: int = 7
) -> List[tf.keras.callbacks.Callback]:
    """
    Creates and returns a list of Keras training callbacks.
    
    Args:
        models_dir: Directory for model checkpoints.
        logs_dir: Directory for logs.
        history_dir: Directory for CSV history.
        phase_name: Name prefix for checkpoint and CSV files.
        scheduler_type: "cosine_warmup" or "reduce_on_plateau".
        target_lr: Target learning rate for cosine warmup scheduler.
        warmup_epochs: Number of warmup epochs for cosine scheduler.
        total_epochs: Total epochs for cosine scheduler calculation.
        patience: Number of epochs to wait before early stopping.
    """
    models_dir.mkdir(parents=True, exist_ok=True)
    logs_dir.mkdir(parents=True, exist_ok=True)
    history_dir.mkdir(parents=True, exist_ok=True)

    checkpoint_path = models_dir / f"checkpoint_{phase_name}.keras"
    csv_log_path = history_dir / f"history_{phase_name}.csv"

    callbacks: List[tf.keras.callbacks.Callback] = [
        # Prevent NaN gradient explosions
        TerminateOnNaN(),

        # Early Stopping to prevent overfitting
        EarlyStopping(
            monitor="val_loss",
            patience=patience,
            restore_best_weights=True,
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
        )
    ]

    # Add selected learning rate scheduler
    if scheduler_type.lower() == "cosine_warmup":
        callbacks.append(
            make_cosine_decay_warmup_scheduler(
                target_lr=target_lr,
                warmup_epochs=warmup_epochs,
                total_epochs=total_epochs,
                min_lr=1e-6
            )
        )
    else:
        # ReduceLROnPlateau — adapts LR based on actual val_loss progress
        # Best for Phase 2 fine-tuning where global epoch offsets cause issues with cosine
        callbacks.append(
            ReduceLROnPlateau(
                monitor="val_loss",
                factor=0.5,
                patience=4,
                min_lr=1e-6,
                verbose=1
            )
        )

    return callbacks
