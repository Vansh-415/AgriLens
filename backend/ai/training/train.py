"""
Main Training Pipeline Script for AgriLens AI Module 4.
Orchestrates dataset loading, class weighting, tf.data pipeline creation,
mixed precision initialization, model building (EfficientNetV2),
two-phase training (Warmup Transfer Learning & Fine-Tuning), evaluation, and artifact exporting.
"""

import sys
import json
from pathlib import Path
import tensorflow as tf

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from ai.configs.config import config
from ai.datasets.dataset_loader import load_dataset_splits
from ai.datasets.preprocessing import prepare_tf_dataset
from ai.datasets.augmentations import get_training_augmentation
from ai.datasets.class_weights import calculate_class_weights
from ai.models.model_builder import build_model, unfreeze_model_for_finetuning
from ai.training.callbacks import create_training_callbacks
from ai.utils.evaluate import evaluate_model
from ai.utils.export import export_artifacts


def configure_mixed_precision():
    """Enables mixed precision policy if GPU is available."""
    gpus = tf.config.list_physical_devices('GPU')
    if gpus and config.USE_MIXED_PRECISION:
        try:
            tf.keras.mixed_precision.set_global_policy('mixed_float16')
            print("[Hardware Optimization] Mixed Precision (mixed_float16) enabled for GPU execution.")
        except Exception as e:
            print(f"[Hardware Optimization] Failed to set mixed precision: {e}")
    else:
        print("[Hardware Optimization] Standard float32 policy active.")


def run_training_pipeline():
    """
    Executes the full AI model training pipeline.
    Phase 1: Transfer Learning with frozen backbone (trains classification head only).
    Phase 2: Fine-Tuning with top backbone layers unfrozen (adapts feature extractors).
    """
    print("=" * 70)
    print(f"Starting AgriLens AI Model Training Pipeline ({config.BACKBONE.upper()})")
    print("=" * 70)

    # 0. Hardware & Output Directory Initialization
    configure_mixed_precision()
    config.ensure_directories()

    # 1. Load Dataset Splits
    print("\n[Step 1/7] Scanning Dataset & Creating Reproducible Stratified Splits...")
    splits = load_dataset_splits(
        dataset_dir=config.DATASET_DIR,
        train_ratio=config.TRAIN_SPLIT,
        val_ratio=config.VAL_SPLIT,
        test_ratio=config.TEST_SPLIT,
        seed=config.SEED
    )

    print(f"      Classes Found ({len(splits['class_names'])}): {splits['class_names']}")
    print(f"      Train Samples: {len(splits['train_paths']):,}")
    print(f"      Val Samples:   {len(splits['val_paths']):,}")
    print(f"      Test Samples:  {len(splits['test_paths']):,}")

    # 2. Compute Balanced Class Weights
    print("\n[Step 2/7] Calculating Balanced Class Weights for Imbalance Mitigation...")
    class_weights = calculate_class_weights(splits['train_labels'])
    print(f"      Computed Class Weights: {class_weights}")

    # 3. Create TensorFlow Datasets
    print("\n[Step 3/7] Building Optimized tf.data Pipelines (AUTOTUNE, Caching, Augmentation)...")
    augmentation_fn = get_training_augmentation(seed=config.SEED)

    train_ds = prepare_tf_dataset(
        image_paths=splits['train_paths'],
        labels=splits['train_labels'],
        batch_size=config.BATCH_SIZE,
        target_size=config.IMAGE_SIZE,
        is_training=True,
        augmentation_fn=augmentation_fn
    )

    val_ds = prepare_tf_dataset(
        image_paths=splits['val_paths'],
        labels=splits['val_labels'],
        batch_size=config.BATCH_SIZE,
        target_size=config.IMAGE_SIZE,
        is_training=False
    )

    test_ds = prepare_tf_dataset(
        image_paths=splits['test_paths'],
        labels=splits['test_labels'],
        batch_size=config.BATCH_SIZE,
        target_size=config.IMAGE_SIZE,
        is_training=False
    )

    # 4. Build Architecture
    print(f"\n[Step 4/7] Building {config.BACKBONE.upper()} Transfer Learning Architecture...")
    model, base_backbone = build_model(
        backbone_name=config.BACKBONE,
        input_shape=config.INPUT_SHAPE,
        num_classes=config.NUM_CLASSES,
        learning_rate=config.INITIAL_LR,
        dropout_rate=0.4,
        optimizer_type=config.OPTIMIZER_TYPE,
        weight_decay=config.WEIGHT_DECAY,
        loss_type=config.LOSS_TYPE,
    )
    model.summary()

    # =====================================================================
    # 5. PHASE 1: Transfer Learning (Frozen Backbone)
    # =====================================================================
    print("\n[Step 5/7] Executing Stage 1: Warmup Transfer Learning (Frozen Backbone)...")
    phase1_callbacks = create_training_callbacks(
        models_dir=config.MODELS_DIR,
        logs_dir=config.LOGS_DIR,
        history_dir=config.HISTORY_DIR,
        phase_name="phase1",
        scheduler_type="cosine_warmup",
        target_lr=config.INITIAL_LR,
        warmup_epochs=config.WARMUP_EPOCHS,
        total_epochs=config.EPOCHS,
        patience=7
    )

    history_phase1 = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=config.EPOCHS,
        class_weight=class_weights,
        callbacks=phase1_callbacks
    )

    # =====================================================================
    # 6. PHASE 2: Fine-Tuning (Top Backbone Layers Unfrozen)
    # =====================================================================
    print("\n[Step 6/7] Unfreezing Top Layers & Executing Stage 2: Fine-Tuning...")
    model = unfreeze_model_for_finetuning(
        model=model,
        unfreeze_layers_count=config.UNFREEZE_LAYERS,
        learning_rate=config.FINE_TUNE_LR,
        optimizer_type=config.OPTIMIZER_TYPE,
        weight_decay=config.WEIGHT_DECAY,
    )

    # Use ReduceLROnPlateau for Phase 2 — it adapts to actual validation progress
    # instead of cosine decay which has epoch-offset issues with initial_epoch
    phase2_callbacks = create_training_callbacks(
        models_dir=config.MODELS_DIR,
        logs_dir=config.LOGS_DIR,
        history_dir=config.HISTORY_DIR,
        phase_name="fine_tune",
        scheduler_type="reduce_on_plateau",
        target_lr=config.FINE_TUNE_LR,
        patience=10
    )

    total_epochs = config.EPOCHS + config.FINE_TUNE_EPOCHS
    initial_epoch = history_phase1.epoch[-1] + 1 if history_phase1.epoch else config.EPOCHS

    history_phase2 = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=total_epochs,
        initial_epoch=initial_epoch,
        class_weight=class_weights,
        callbacks=phase2_callbacks
    )

    # Combined History
    combined_history = {
        'phase1': history_phase1.history,
        'phase2': history_phase2.history
    }
    history_json_path = config.HISTORY_DIR / "training_history.json"
    with open(history_json_path, 'w', encoding='utf-8') as f:
        json.dump(combined_history, f, indent=2)

    # 7. Model Evaluation & Export
    print("\n[Step 7/7] Evaluating Trained Model on Test Set & Exporting Production Artifacts...")
    eval_results = evaluate_model(
        model=model,
        test_ds=test_ds,
        test_paths=splits['test_paths'],
        test_labels=splits['test_labels'],
        class_names=splits['class_names'],
        output_dir=config.OUTPUTS_DIR,
        history_dict=combined_history
    )

    export_artifacts(
        model=model,
        class_names=splits['class_names'],
        history=combined_history,
        metrics=eval_results['metrics'],
        export_dir=config.EXPORT_DIR,
        models_dir=config.MODELS_DIR
    )

    print("\n" + "=" * 70)
    print("Training Pipeline Execution Completed Successfully!")
    print("=" * 70)


if __name__ == '__main__':
    run_training_pipeline()
