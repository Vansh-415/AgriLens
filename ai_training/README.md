# 🤖 AgriLens — AI Training

This directory contains all AI/ML training resources, completely separated
from the backend inference pipeline.

## 📁 Structure

```
ai_training/
├── notebooks/    # Jupyter notebooks for exploration & training
├── scripts/      # Standalone training & evaluation scripts
├── data/         # Training datasets (not committed to git)
└── models/       # Trained model outputs (not committed to git)
```

## 🔑 Key Rules

1. **Training stays here.** The backend only loads the final `.keras` model
   from `backend/ai_models/<crop>/model.keras`.
2. **Data is not committed.** Download datasets locally into `data/`.
3. **Use MobileNetV2** for transfer learning (lightweight, mobile-friendly).
4. **Export format:** `.keras` (TensorFlow SavedModel format).

## 🌱 Version 1 Scope

- Cotton crop only
- Diseases: Bacterial Blight, Leaf Curl Virus, Fusarium Wilt, Healthy

## 🔮 Future Crops (Placeholders)

- Wheat
- Rice
- Tomato
