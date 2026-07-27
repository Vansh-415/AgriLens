"""
Evaluation Module for AgriLens AI Training Pipeline.
Runs test set inference, computes metrics, and generates loss/accuracy/confusion matrix figures.
"""

from pathlib import Path
from typing import Dict, List, Any, Optional
import numpy as np
import tensorflow as tf

from .metrics import calculate_and_plot_metrics


def evaluate_model(
    model: tf.keras.Model,
    test_ds: tf.data.Dataset,
    test_paths: List[str],
    test_labels: List[int],
    class_names: List[str],
    output_dir: Path,
    history_dict: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Evaluates trained model on the held-out test dataset split.

    Args:
        model: Trained Keras model.
        test_ds: Batched test tf.data.Dataset.
        test_paths: File paths of test images.
        test_labels: Ground truth labels.
        class_names: List of target disease class names.
        output_dir: Path to outputs directory.
        history_dict: Optional training history.

    Returns:
        Dict containing evaluation loss, test accuracy, and detailed metric summaries.
    """
    print("\nRunning Model Evaluation on Held-Out Test Set...")
    
    # Keras evaluation
    eval_loss, eval_acc, *extra = model.evaluate(test_ds, verbose=1)
    print(f"--> Test Loss:     {eval_loss:.4f}")
    print(f"--> Test Accuracy: {eval_acc * 100.0:.2f}%")

    # Predict probabilities for confusion matrix and ROC curves
    y_pred_probs = model.predict(test_ds, verbose=1)
    y_true = np.array(test_labels)

    metrics_summary = calculate_and_plot_metrics(
        y_true=y_true,
        y_pred_probs=y_pred_probs,
        class_names=class_names,
        output_dir=output_dir,
        history_dict=history_dict
    )

    return {
        'test_loss': float(eval_loss),
        'test_accuracy': float(eval_acc),
        'metrics': metrics_summary
    }
