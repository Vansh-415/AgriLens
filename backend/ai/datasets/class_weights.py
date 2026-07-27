"""
Class Weights Utility for AgriLens AI Training Pipeline.
Computes balanced class weights using scikit-learn to handle class imbalance.
"""

from typing import Dict, List
import numpy as np
from sklearn.utils.class_weight import compute_class_weight


def calculate_class_weights(labels: List[int]) -> Dict[int, float]:
    """
    Calculates balanced class weights for imbalanced datasets.

    Args:
        labels: List of integer target labels from training set.

    Returns:
        Dict[int, float] mapping class index to computed sample weight float.
    """
    unique_classes = np.unique(labels)
    computed_weights = compute_class_weight(
        class_weight='balanced',
        classes=unique_classes,
        y=np.array(labels)
    )

    class_weight_dict = {
        int(cls_idx): float(w)
        for cls_idx, w in zip(unique_classes, computed_weights)
    }

    return class_weight_dict
