"""
Standalone Model Evaluation & Diagnostic Script for AgriLens EfficientNetV2.
Evaluates pre-trained best_model.keras on the dataset test split without retraining.

Generates:
  - Confusion Matrix (PNG)
  - Classification Report (TXT & Markdown)
  - Overall & Per-Class Precision, Recall, F1-Score, and Accuracy
  - Top 20 Most Confident Misclassifications with Filenames (CSV & Markdown)
  - Full Diagnostic Report saved to backend/ai/reports/
"""

import os
import sys
import csv
import json
from pathlib import Path
from typing import Dict, List, Tuple, Any

import numpy as np
import tensorflow as tf
# No preprocess_input — EfficientNetV2 has built-in Rescaling layers.
# Images must be passed as raw [0, 255] float32 to match training preprocessing.
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    confusion_matrix,
    classification_report
)

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from ai.configs.config import config
from ai.datasets.dataset_loader import load_dataset_splits


def find_model_path() -> Path:
    """Locates best_model.keras in priority directories."""
    possible_paths = [
        config.BASE_DIR.parent / "ai_models" / "cotton" / "best_model.keras",
        config.MODELS_DIR / "best_model.keras",
        config.OUTPUTS_DIR / "models" / "best_model.keras",
        config.MODELS_DIR / "checkpoint_fine_tune.keras",
        config.MODELS_DIR / "checkpoint_phase1.keras"
    ]

    for path in possible_paths:
        if path.exists():
            return path

    raise FileNotFoundError(f"best_model.keras not found. Checked locations: {possible_paths}")


def load_test_image(image_path: tf.Tensor, target_size: Tuple[int, int] = (256, 256)) -> tf.Tensor:
    """Decodes and resizes image to raw [0, 255] float32 for EfficientNetV2."""
    raw = tf.io.read_file(image_path)
    img = tf.image.decode_jpeg(raw, channels=3)
    img = tf.image.resize(img, target_size)
    # Return raw [0, 255] float — EfficientNetV2 handles scaling internally.
    return img


def main():
    print("=" * 70)
    print("AgriLens Standalone AI Model Evaluation & Diagnostic Analysis")
    print("=" * 70)

    # 1. Ensure Reports Output Directory Exists
    reports_dir = config.REPORTS_DIR
    reports_dir.mkdir(parents=True, exist_ok=True)

    # 2. Locate and Load Trained Model
    model_path = find_model_path()
    print(f"\n[1/5] Loading Pre-Trained Model from: {model_path}")
    model = tf.keras.models.load_model(str(model_path), compile=False)
    
    input_shape = model.input_shape
    target_height = input_shape[1] if input_shape[1] is not None else 256
    target_width = input_shape[2] if input_shape[2] is not None else 256
    target_size = (target_height, target_width)

    print(f"      Model Input Shape:  {model.input_shape}")
    print(f"      Model Output Shape: {model.output_shape}")

    # 3. Load Dataset & Test Split
    print(f"\n[2/5] Loading Original Dataset from: {config.DATASET_DIR}")
    splits = load_dataset_splits(
        dataset_dir=config.DATASET_DIR,
        train_ratio=config.TRAIN_SPLIT,
        val_ratio=config.VAL_SPLIT,
        test_ratio=config.TEST_SPLIT,
        seed=config.SEED
    )

    test_paths = splits['test_paths']
    test_labels = splits['test_labels']
    class_names = splits['class_names']
    num_classes = len(class_names)

    print(f"      Discovered Classes ({num_classes}): {class_names}")
    print(f"      Test Split Image Count: {len(test_paths):,}")

    # 4. Build Test tf.data Dataset
    print(f"\n[3/5] Building Test Pipeline & Running Inference...")
    test_ds = tf.data.Dataset.from_tensor_slices((test_paths, test_labels))
    test_ds = test_ds.map(
        lambda p, l: (load_test_image(p, target_size=target_size), l),
        num_parallel_calls=tf.data.AUTOTUNE
    )
    test_ds = test_ds.batch(config.BATCH_SIZE).prefetch(buffer_size=tf.data.AUTOTUNE)

    # Run Prediction
    y_pred_probs = model.predict(test_ds, verbose=1)
    y_pred = np.argmax(y_pred_probs, axis=1)
    y_true = np.array(test_labels)

    # 5. Compute Detailed Metrics
    print(f"\n[4/5] Computing Performance Metrics & Per-Class Statistics...")
    overall_acc = float(accuracy_score(y_true, y_pred))
    prec_w, rec_w, f1_w, _ = precision_recall_fscore_support(y_true, y_pred, average='weighted', zero_division=0)
    prec_m, rec_m, f1_m, _ = precision_recall_fscore_support(y_true, y_pred, average='macro', zero_division=0)

    cm = confusion_matrix(y_true, y_pred)
    clf_report_str = classification_report(y_true, y_pred, target_names=class_names, zero_division=0)
    clf_report_dict = classification_report(y_true, y_pred, target_names=class_names, output_dict=True, zero_division=0)

    # Calculate Per-Class Accuracy
    per_class_acc: Dict[str, float] = {}
    for i, cname in enumerate(class_names):
        total_class_samples = np.sum(cm[i, :])
        correct_samples = cm[i, i]
        acc_val = (correct_samples / total_class_samples * 100.0) if total_class_samples > 0 else 0.0
        per_class_acc[cname] = round(acc_val, 2)

    # Find Top 20 Most Confidently Wrong Predictions
    misclassified_samples: List[Dict[str, Any]] = []
    for idx in range(len(y_true)):
        true_idx = y_true[idx]
        pred_idx = y_pred[idx]
        if true_idx != pred_idx:
            conf = float(y_pred_probs[idx, pred_idx])
            filepath = test_paths[idx]
            filename = Path(filepath).name
            rel_path = str(Path(filepath).relative_to(Path(config.DATASET_DIR)))

            misclassified_samples.append({
                'filename': filename,
                'relative_path': rel_path,
                'full_path': filepath,
                'true_class': class_names[true_idx],
                'predicted_class': class_names[pred_idx],
                'confidence': conf,
                'confidence_pct': f"{conf * 100.0:.2f}%"
            })

    # Sort misclassifications by confidence descending
    misclassified_samples.sort(key=lambda x: x['confidence'], reverse=True)
    top20_misclassified = misclassified_samples[:20]

    # Save Top 20 Misclassifications CSV
    top20_csv_path = reports_dir / "top20_misclassifications.csv"
    with open(top20_csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Rank", "Filename", "Relative Path", "True Class", "Predicted Class", "Confidence", "Confidence Pct"])
        for rank, item in enumerate(top20_misclassified, 1):
            writer.writerow([
                rank, item['filename'], item['relative_path'],
                item['true_class'], item['predicted_class'],
                f"{item['confidence']:.4f}", item['confidence_pct']
            ])

    # Plot & Save Confusion Matrix PNG
    cm_png_path = reports_dir / "confusion_matrix.png"
    _plot_confusion_matrix(cm, class_names, cm_png_path)

    # Save Classification Report TXT
    clf_txt_path = reports_dir / "classification_report.txt"
    with open(clf_txt_path, "w", encoding="utf-8") as f:
        f.write(clf_report_str)

    # Save Full Comprehensive Markdown Report
    markdown_report_path = reports_dir / "model_analysis_report.md"
    _generate_markdown_report(
        report_path=markdown_report_path,
        model_path=model_path,
        total_test=len(test_paths),
        overall_acc=overall_acc,
        prec_w=prec_w, rec_w=rec_w, f1_w=f1_w,
        prec_m=prec_m, rec_m=rec_m, f1_m=f1_m,
        per_class_acc=per_class_acc,
        clf_report_dict=clf_report_dict,
        top20_misclassified=top20_misclassified,
        total_misclassified=len(misclassified_samples)
    )

    print(f"\n[5/5] Analysis Completed! Artifacts Saved to: {reports_dir}")
    print(f"      - Confusion Matrix:           {cm_png_path}")
    print(f"      - Classification Report TXT:  {clf_txt_path}")
    print(f"      - Top 20 Misclassifications:  {top20_csv_path}")
    print(f"      - Full Markdown Report:       {markdown_report_path}")

    print("\n" + "=" * 70)
    print(f"Overall Test Accuracy:    {overall_acc * 100.0:.2f}%")
    print(f"Weighted F1-Score:        {f1_w * 100.0:.2f}%")
    print(f"Total Test Misclassified: {len(misclassified_samples)} / {len(test_paths)}")
    print("=" * 70)


def _plot_confusion_matrix(cm: np.ndarray, class_names: List[str], save_path: Path):
    """Renders clean, high-resolution confusion matrix heatmap."""
    fig, ax = plt.subplots(figsize=(10, 8), dpi=300)
    im = ax.imshow(cm, interpolation='nearest', cmap=plt.cm.Greens)
    ax.figure.colorbar(im, ax=ax)

    ax.set(
        xticks=np.arange(cm.shape[1]),
        yticks=np.arange(cm.shape[0]),
        xticklabels=class_names,
        yticklabels=class_names,
        title='Confusion Matrix - EfficientNetV2 Test Set Evaluation',
        ylabel='True Disease Class',
        xlabel='Predicted Disease Class'
    )

    plt.setp(ax.get_xticklabels(), rotation=35, ha="right", rotation_mode="anchor")

    thresh = cm.max() / 2.
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            val = cm[i, j]
            ax.text(
                j, i, format(val, 'd'),
                ha="center", va="center",
                color="white" if val > thresh else "black",
                fontweight="bold", fontsize=10
            )

    fig.tight_layout()
    fig.savefig(save_path, dpi=300)
    plt.close(fig)


def _generate_markdown_report(
    report_path: Path,
    model_path: Path,
    total_test: int,
    overall_acc: float,
    prec_w: float, rec_w: float, f1_w: float,
    prec_m: float, rec_m: float, f1_m: float,
    per_class_acc: Dict[str, float],
    clf_report_dict: Dict[str, Any],
    top20_misclassified: List[Dict[str, Any]],
    total_misclassified: int
):
    """Generates detailed model_analysis_report.md markdown file."""
    per_class_rows = []
    for cname, acc in per_class_acc.items():
        c_stats = clf_report_dict.get(cname, {})
        p = c_stats.get('precision', 0.0) * 100.0
        r = c_stats.get('recall', 0.0) * 100.0
        f1 = c_stats.get('f1-score', 0.0) * 100.0
        support = c_stats.get('support', 0)
        per_class_rows.append(f"| `{cname}` | {acc:.2f}% | {p:.2f}% | {r:.2f}% | {f1:.2f}% | {support} |")

    per_class_table = "\n".join(per_class_rows)

    top20_rows = []
    for rank, item in enumerate(top20_misclassified, 1):
        top20_rows.append(
            f"| {rank} | `{item['filename']}` | `{item['true_class']}` | `{item['predicted_class']}` | **{item['confidence_pct']}** |"
        )
    top20_table = "\n".join(top20_rows) if top20_rows else "*No misclassifications found on test split!*"

    content = f"""# EfficientNetV2 Standalone AI Model Analysis Report

**Evaluation Target**: Test Split Only ({total_test} images)  
**Model Path**: `{model_path}`  
**Dataset Source**: Cotton Leaf Disease Detection Dataset (`D:\\Cotton Leaf Disease Detection Dataset\\Original Dataset`)

---

## 1. Executive Summary & Overall Metrics

| Metric | Weighted Average | Macro Average |
| :--- | :---: | :---: |
| **Accuracy** | **{overall_acc * 100.0:.2f}%** | **{overall_acc * 100.0:.2f}%** |
| **Precision** | **{prec_w * 100.0:.2f}%** | {prec_m * 100.0:.2f}% |
| **Recall** | **{rec_w * 100.0:.2f}%** | {rec_m * 100.0:.2f}% |
| **F1-Score** | **{f1_w * 100.0:.2f}%** | {f1_m * 100.0:.2f}% |

- **Total Test Samples**: {total_test:,}
- **Correct Predictions**: {total_test - total_misclassified:,}
- **Total Misclassifications**: {total_misclassified} ({total_misclassified / total_test * 100.0:.2f}%)

---

## 2. Per-Class Accuracy & Performance Breakdown

| Disease / Leaf Class | Per-Class Accuracy | Precision | Recall | F1-Score | Support |
| :--- | :---: | :---: | :---: | :---: | :---: |
{per_class_table}

---

## 3. Top 20 Most Confidently Wrong Predictions

These are the test samples where the model made an incorrect prediction with the highest probability score:

| Rank | Filename | True Class | Predicted Class | Confidence |
| :---: | :--- | :--- | :--- | :---: |
{top20_table}

---

## 4. Generated Artifacts Location

- **Confusion Matrix Figure**: [`confusion_matrix.png`](file:///{Path(report_path.parent / 'confusion_matrix.png').as_posix()})
- **Classification Report TXT**: [`classification_report.txt`](file:///{Path(report_path.parent / 'classification_report.txt').as_posix()})
- **Top 20 Misclassifications CSV**: [`top20_misclassifications.csv`](file:///{Path(report_path.parent / 'top20_misclassifications.csv').as_posix()})
- **Full Markdown Report**: [`model_analysis_report.md`](file:///{Path(report_path).as_posix()})
"""

    with open(report_path, "w", encoding="utf-8") as f:
        f.write(content)


if __name__ == '__main__':
    main()
