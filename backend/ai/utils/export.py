"""
Export Utility Module for AgriLens AI Training Pipeline.
Exports trained model binaries, label mappings, training history, and evaluation metrics for deployment.
"""

import json
from pathlib import Path
from typing import Dict, List, Any
import tensorflow as tf


def export_artifacts(
    model: tf.keras.Model,
    class_names: List[str],
    history: Dict[str, Any],
    metrics: Dict[str, Any],
    export_dir: Path,
    models_dir: Path
) -> Dict[str, str]:
    """
    Exports production artifacts:
      1. best_model.keras
      2. labels.json
      3. training_history.json
      4. metrics.json

    Args:
        model: Trained Keras model instance.
        class_names: List of class names.
        history: Training history dictionary.
        metrics: Evaluation metrics dictionary.
        export_dir: Target directory for serving deployment (e.g., backend/ai_models/cotton).
        models_dir: Outputs models directory.

    Returns:
        Dict[str, str] of exported artifact file paths.
    """
    export_dir.mkdir(parents=True, exist_ok=True)
    models_dir.mkdir(parents=True, exist_ok=True)

    # 1. Export Keras Model (.keras format)
    model_export_path = export_dir / "best_model.keras"
    model_internal_path = models_dir / "best_model.keras"
    
    model.save(str(model_export_path))
    model.save(str(model_internal_path))

    # 2. Export labels.json
    labels_dict = {
        "crop": "Cotton",
        "num_classes": len(class_names),
        "class_names": class_names,
        "class_to_idx": {cname: idx for idx, cname in enumerate(class_names)},
        "idx_to_class": {idx: cname for idx, cname in enumerate(class_names)}
    }
    
    labels_path = export_dir / "labels.json"
    labels_internal_path = models_dir / "labels.json"
    
    with open(labels_path, "w", encoding="utf-8") as f:
        json.dump(labels_dict, f, indent=2)
    with open(labels_internal_path, "w", encoding="utf-8") as f:
        json.dump(labels_dict, f, indent=2)

    # 3. Export training_history.json
    history_path = export_dir / "training_history.json"
    with open(history_path, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2)

    # 4. Export metrics.json
    metrics_path = export_dir / "metrics.json"
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    print(f"\nArtifacts Successfully Exported to Production Directory: {export_dir}")
    print(f"  - Model:   {model_export_path}")
    print(f"  - Labels:  {labels_path}")
    print(f"  - History: {history_path}")
    print(f"  - Metrics: {metrics_path}")

    return {
        'model_path': str(model_export_path),
        'labels_path': str(labels_path),
        'history_path': str(history_path),
        'metrics_path': str(metrics_path)
    }
