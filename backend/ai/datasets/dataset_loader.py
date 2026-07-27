"""
Dataset Loader Module for AgriLens AI Training Pipeline.
Scans raw image dataset, infers classes, creates reproducible train/val/test splits, and shuffles data.
"""

import os
from pathlib import Path
from typing import Dict, List, Tuple, Any
import numpy as np
from sklearn.model_selection import train_test_split


def load_dataset_splits(
    dataset_dir: str,
    train_ratio: float = 0.70,
    val_ratio: float = 0.15,
    test_ratio: float = 0.15,
    seed: int = 42
) -> Dict[str, Any]:
    """
    Scans dataset_dir, infers classes, and splits into train, validation, and test sets.

    Returns:
        Dict containing:
            - 'train_paths': List[str]
            - 'train_labels': List[int]
            - 'val_paths': List[str]
            - 'val_labels': List[int]
            - 'test_paths': List[str]
            - 'test_labels': List[int]
            - 'class_names': List[str]
            - 'class_to_idx': Dict[str, int]
    """
    dpath = Path(dataset_dir)
    if not dpath.exists():
        raise FileNotFoundError(f"Dataset directory not found: {dataset_dir}")

    # Infer class names from subdirectories
    class_names = sorted([f.name for f in dpath.iterdir() if f.is_dir()])
    if not class_names:
        raise ValueError(f"No class subdirectories found in: {dataset_dir}")

    class_to_idx = {cname: idx for idx, cname in enumerate(class_names)}

    all_paths: List[str] = []
    all_labels: List[int] = []

    valid_exts = {'.jpg', '.jpeg', '.png', '.bmp', '.webp', '.tiff'}

    for cname in class_names:
        cdir = dpath / cname
        for item in cdir.glob('*'):
            if item.is_file() and item.suffix.lower() in valid_exts:
                all_paths.append(str(item.resolve()))
                all_labels.append(class_to_idx[cname])

    if len(all_paths) == 0:
        raise ValueError(f"No valid images found in: {dataset_dir}")

    # Stratified train / val / test split
    # First split: train vs temp (val + test)
    temp_ratio = val_ratio + test_ratio
    train_paths, temp_paths, train_labels, temp_labels = train_test_split(
        all_paths,
        all_labels,
        test_size=temp_ratio,
        random_state=seed,
        stratify=all_labels
    )

    # Second split: val vs test from temp
    val_relative_ratio = val_ratio / temp_ratio
    val_paths, test_paths, val_labels, test_labels = train_test_split(
        temp_paths,
        temp_labels,
        test_size=(1.0 - val_relative_ratio),
        random_state=seed,
        stratify=temp_labels
    )

    return {
        'train_paths': train_paths,
        'train_labels': train_labels,
        'val_paths': val_paths,
        'val_labels': val_labels,
        'test_paths': test_paths,
        'test_labels': test_labels,
        'class_names': class_names,
        'class_to_idx': class_to_idx,
        'total_images': len(all_paths)
    }
