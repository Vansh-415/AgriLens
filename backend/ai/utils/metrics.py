"""
Metrics & Plotting Utility for AgriLens AI Evaluation Pipeline.
Calculates Accuracy, Precision, Recall, F1-score, Confusion Matrix, Classification Report, and ROC curves.
Generates matplotlib figure plots saved to disk.
"""

import json
from pathlib import Path
from typing import Dict, List, Any, Optional
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    confusion_matrix,
    classification_report,
    roc_curve,
    auc
)


def calculate_and_plot_metrics(
    y_true: np.ndarray,
    y_pred_probs: np.ndarray,
    class_names: List[str],
    output_dir: Path,
    history_dict: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Computes performance metrics and outputs plots for confusion matrix, training curves, and ROC curves.

    Args:
        y_true: Ground truth integer class targets (shape: N,).
        y_pred_probs: Predicted probability distributions (shape: N, num_classes).
        class_names: List of class names.
        output_dir: Base outputs directory containing plots and metrics folders.
        history_dict: Optional training history dict for loss/accuracy curve plotting.

    Returns:
        Dict containing evaluated metrics summary.
    """
    plots_dir = output_dir / "plots"
    metrics_dir = output_dir / "metrics"
    reports_dir = output_dir.parent / "reports"

    for d in [plots_dir, metrics_dir, reports_dir]:
        d.mkdir(parents=True, exist_ok=True)

    y_pred = np.argmax(y_pred_probs, axis=1)

    # 1. Scalar Classification Metrics
    acc = float(accuracy_score(y_true, y_pred))
    prec, rec, f1, _ = precision_recall_fscore_support(y_true, y_pred, average='weighted', zero_division=0)
    prec_macro, rec_macro, f1_macro, _ = precision_recall_fscore_support(y_true, y_pred, average='macro', zero_division=0)

    clf_report_str = classification_report(y_true, y_pred, target_names=class_names, zero_division=0)
    clf_report_dict = classification_report(y_true, y_pred, target_names=class_names, output_dict=True, zero_division=0)

    # Save Classification Report TXT & JSON
    with open(metrics_dir / "classification_report.txt", "w", encoding="utf-8") as f:
        f.write(clf_report_str)
    with open(reports_dir / "classification_report.txt", "w", encoding="utf-8") as f:
        f.write(clf_report_str)
    with open(metrics_dir / "classification_report.json", "w", encoding="utf-8") as f:
        json.dump(clf_report_dict, f, indent=2)

    # 2. Confusion Matrix Plot
    cm = confusion_matrix(y_true, y_pred)
    _plot_confusion_matrix(cm, class_names, plots_dir / "confusion_matrix.png")
    _plot_confusion_matrix(cm, class_names, reports_dir / "confusion_matrix.png")

    # 3. ROC Curves Plot
    _plot_roc_curves(y_true, y_pred_probs, class_names, plots_dir / "roc_curves.png")

    # 4. Training History Curves Plot (Loss & Accuracy)
    if history_dict is not None:
        _plot_training_curves(history_dict, plots_dir / "loss_accuracy_curves.png")
        _plot_training_curves(history_dict, reports_dir / "loss_accuracy_curves.png")

    metrics_summary = {
        'accuracy': acc,
        'precision_weighted': float(prec),
        'recall_weighted': float(rec),
        'f1_score_weighted': float(f1),
        'precision_macro': float(prec_macro),
        'recall_macro': float(rec_macro),
        'f1_score_macro': float(f1_macro),
        'confusion_matrix': cm.tolist()
    }

    with open(metrics_dir / "metrics_summary.json", "w", encoding="utf-8") as f:
        json.dump(metrics_summary, f, indent=2)

    return metrics_summary


def _plot_confusion_matrix(cm: np.ndarray, class_names: List[str], save_path: Path):
    """Renders normalized and raw confusion matrix heatmap."""
    fig, ax = plt.subplots(figsize=(8, 7), dpi=300)
    im = ax.imshow(cm, interpolation='nearest', cmap=plt.cm.Greens)
    ax.figure.colorbar(im, ax=ax)

    ax.set(xticks=np.arange(cm.shape[1]),
           yticks=np.arange(cm.shape[0]),
           xticklabels=class_names, yticklabels=class_names,
           title='Confusion Matrix - Cotton Disease Classification',
           ylabel='True Disease Class',
           xlabel='Predicted Disease Class')

    plt.setp(ax.get_xticklabels(), rotation=45, ha="right", rotation_mode="anchor")

    fmt = 'd'
    thresh = cm.max() / 2.
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            ax.text(j, i, format(cm[i, j], fmt),
                    ha="center", va="center",
                    color="white" if cm[i, j] > thresh else "black",
                    fontweight="bold")

    fig.tight_layout()
    fig.savefig(save_path, dpi=300)
    plt.close(fig)


def _plot_roc_curves(y_true: np.ndarray, y_pred_probs: np.ndarray, class_names: List[str], save_path: Path):
    """Renders Multi-Class ROC curves."""
    fig, ax = plt.subplots(figsize=(9, 7), dpi=300)
    num_classes = len(class_names)

    # One-hot encode y_true
    y_true_oh = np.eye(num_classes)[y_true]

    for i in range(num_classes):
        fpr, tpr, _ = roc_curve(y_true_oh[:, i], y_pred_probs[:, i])
        roc_auc = auc(fpr, tpr)
        ax.plot(fpr, tpr, lw=2, label=f'{class_names[i]} (AUC = {roc_auc:.2f})')

    ax.plot([0, 1], [0, 1], 'k--', lw=2, label='Chance / Random Guess')
    ax.set_xlim([0.0, 1.0])
    ax.set_ylim([0.0, 1.05])
    ax.set_xlabel('False Positive Rate', fontsize=11, fontweight='bold')
    ax.set_ylabel('True Positive Rate', fontsize=11, fontweight='bold')
    ax.set_title('Multi-Class ROC Curves - AgriLens Classifier', fontsize=13, fontweight='bold')
    ax.legend(loc="lower right", fontsize=9)
    ax.grid(True, linestyle='--', alpha=0.5)

    fig.tight_layout()
    fig.savefig(save_path, dpi=300)
    plt.close(fig)


def _plot_training_curves(history_dict: Dict[str, Any], save_path: Path):
    """Renders Phase 1 & Phase 2 Training & Validation Loss & Accuracy curves."""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5), dpi=300)

    # Concatenate phase1 and phase2 metrics if present
    acc, val_acc, loss, val_loss = [], [], [], []

    for phase in ['phase1', 'phase2']:
        if phase in history_dict:
            p_hist = history_dict[phase]
            acc.extend(p_hist.get('accuracy', []))
            val_acc.extend(p_hist.get('val_accuracy', []))
            loss.extend(p_hist.get('loss', []))
            val_loss.extend(p_hist.get('val_loss', []))

    epochs = range(1, len(acc) + 1)

    # Plot Accuracy
    ax1.plot(epochs, acc, 'bo-', label='Training Accuracy')
    ax1.plot(epochs, val_acc, 'r^-', label='Validation Accuracy')
    ax1.set_title('Training & Validation Accuracy', fontsize=12, fontweight='bold')
    ax1.set_xlabel('Epochs')
    ax1.set_ylabel('Accuracy')
    ax1.legend()
    ax1.grid(True, linestyle='--', alpha=0.5)

    # Plot Loss
    ax2.plot(epochs, loss, 'bo-', label='Training Loss')
    ax2.plot(epochs, val_loss, 'r^-', label='Validation Loss')
    ax2.set_title('Training & Validation Loss', fontsize=12, fontweight='bold')
    ax2.set_xlabel('Epochs')
    ax2.set_ylabel('Loss')
    ax2.legend()
    ax2.grid(True, linestyle='--', alpha=0.5)

    fig.tight_layout()
    fig.savefig(save_path, dpi=300)
    plt.close(fig)
