# AgriLens AI Training & Inference Pipeline (Module 4)

Production-grade, modular TensorFlow 2.x AI pipeline for Cotton Leaf Disease Detection.

---

## 1. Overview & Architecture

The `backend/ai/` module provides an enterprise-ready transfer learning & fine-tuning architecture built on **MobileNetV2** pre-trained on ImageNet.

```
backend/ai/
├── configs/
│   └── config.py               # Central configuration (hyperparameters, paths, seeds)
├── datasets/
│   ├── dataset_loader.py       # Auto-discovers dataset, splits (70/15/15), stratifies & shuffles
│   ├── preprocessing.py        # tf.data pipeline with 256x256 resize, normalization, caching, prefetch
│   ├── augmentations.py        # Training-only GPU augmentations (Flip, Rotate, Zoom, Contrast)
│   └── class_weights.py        # Balanced class weights calculation via scikit-learn
├── models/
│   └── model_builder.py        # MobileNetV2 backbone, top head, & unfreezing (80 layers) for fine-tuning
├── training/
│   ├── callbacks.py            # EarlyStopping (patience=5), ReduceLROnPlateau (patience=2, min_lr=1e-7), Checkpoint (val_acc), TensorBoard, CSVLogger
│   └── train.py                # Main orchestration pipeline (2-phase training execution: 15 + 25 = 40 total epochs)
├── inference/
│   └── predict.py              # CottonDiseasePredictor for single-image diagnosis & confidence (256x256)
├── utils/
│   ├── metrics.py              # Precision, Recall, F1, Confusion Matrix, ROC, & Loss/Acc curves
│   ├── evaluate.py             # Test-set evaluation module
│   └── export.py               # Exports best_model.keras, labels.json, metrics, & history
├── outputs/
│   ├── models/                 # Model checkpoints & final binaries
│   ├── logs/                   # TensorBoard event logs
│   ├── history/                # Epoch CSV history files
│   ├── metrics/                # Metric summaries & classification reports
│   └── plots/                  # Generated figures (confusion matrix, ROC, training curves)
├── reports/                    # Dataset verification reports & preview figures
└── README.md                   # Complete documentation
```

---

## 2. Dataset Information

- **Crop**: Cotton (*Gossypium*)
- **Target Disease Classes (7)**:
  1. `Bacterial Blight`
  2. `Curl Virus`
  3. `Healthy Leaf`
  4. `Herbicide Growth Damage`
  5. `Leaf Hopper Jassids`
  6. `Leaf Redding`
  7. `Leaf Variegation`
- **Total Images**: 2,137 (Verified 800x800 RGB JPEGs)
- **Local Path**: `D:\Cotton Leaf Disease Detection Dataset\Cotton Leaf Disease Detection Dataset\Original Dataset`

---

## 3. How to Run Training

### A. Local Execution
To execute the complete training pipeline locally:

```bash
cd backend
python ai/training/train.py
```

### B. Google Colab Training
1. Upload the dataset zip to Google Drive or Colab session storage.
2. Clone or mount `backend/ai/`.
3. Update `DATASET_DIR` in `configs/config.py` (or pass as environment variable).
4. Run:
```python
from ai.training.train import run_training_pipeline
run_training_pipeline()
```

---

## 4. Transfer Learning & Fine-Tuning Strategy

1. **Phase 1: Transfer Learning (Frozen Backbone)**
   - Backbone: MobileNetV2 (`weights="imagenet"`, `include_top=False`).
   - Image Input Dimensions: `256x256x3`.
   - All base backbone layers are frozen (`trainable = False`).
   - Top head: `GlobalAveragePooling2D` -> `BatchNormalization` -> `Dropout(0.2)` -> `Dense(256, relu)` -> `Dropout(0.4)` -> `Dense(7, softmax)`.
   - Initial Learning Rate: `1e-3` with Adam optimizer.
   - Epochs: 15 (with EarlyStopping patience=5, ReduceLROnPlateau factor=0.2, patience=2, min_lr=1e-7).

2. **Phase 2: Fine-Tuning (Unfrozen Top Backbone Layers)**
   - Top ~80 layers of MobileNetV2 backbone are unfrozen (`trainable = True`).
   - BatchNormalization layers remain locked in evaluation mode for stability.
   - Reduced Learning Rate: `1e-5` with Adam optimizer.
   - Fine-tuning Epochs: 25 (Total Epochs: 40).

---

## 5. Artifact Export & Future FastAPI Integration

Upon completion of training, artifacts are automatically exported to `backend/ai_models/cotton/`:
- `best_model.keras`
- `labels.json`
- `training_history.json`
- `metrics.json`

### FastAPI Integration (in `backend/app/services/scan_service.py`):
```python
from ai.inference.predict import CottonDiseasePredictor

predictor = CottonDiseasePredictor()

def analyze_crop_image(image_bytes: bytes):
    result = predictor.predict(image_bytes)
    return {
        "disease_name": result["predicted_class"],
        "confidence": result["confidence"],
        "all_probabilities": result["class_probabilities"]
    }
```
