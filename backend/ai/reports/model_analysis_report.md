# MobileNetV2 Standalone AI Model Analysis Report

**Evaluation Target**: Test Split Only (321 images)  
**Model Path**: `D:\Agrilens\backend\ai_models\cotton\best_model.keras`  
**Dataset Source**: Cotton Leaf Disease Detection Dataset (`D:\Cotton Leaf Disease Detection Dataset\Original Dataset`)

---

## 1. Executive Summary & Overall Metrics

| Metric | Weighted Average | Macro Average |
| :--- | :---: | :---: |
| **Accuracy** | **81.00%** | **81.00%** |
| **Precision** | **82.43%** | 80.44% |
| **Recall** | **81.00%** | 83.09% |
| **F1-Score** | **81.13%** | 81.11% |

- **Total Test Samples**: 321
- **Correct Predictions**: 260
- **Total Misclassifications**: 61 (19.00%)

---

## 2. Per-Class Accuracy & Performance Breakdown

| Disease / Leaf Class | Per-Class Accuracy | Precision | Recall | F1-Score | Support |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `Bacterial Blight` | 92.11% | 67.31% | 92.11% | 77.78% | 38.0 |
| `Curl Virus` | 68.75% | 88.00% | 68.75% | 77.19% | 64.0 |
| `Healthy Leaf` | 76.92% | 76.92% | 76.92% | 76.92% | 39.0 |
| `Herbicide Growth Damage` | 90.48% | 100.00% | 90.48% | 95.00% | 42.0 |
| `Leaf Hopper Jassids` | 70.59% | 63.16% | 70.59% | 66.67% | 34.0 |
| `Leaf Redding` | 82.76% | 86.75% | 82.76% | 84.71% | 87.0 |
| `Leaf Variegation` | 100.00% | 80.95% | 100.00% | 89.47% | 17.0 |

---

## 3. Top 20 Most Confidently Wrong Predictions

These are the test samples where the model made an incorrect prediction with the highest probability score:

| Rank | Filename | True Class | Predicted Class | Confidence |
| :---: | :--- | :--- | :--- | :---: |
| 1 | `CV00018.jpg` | `Curl Virus` | `Healthy Leaf` | **98.98%** |
| 2 | `LR00432.jpg` | `Leaf Redding` | `Bacterial Blight` | **98.83%** |
| 3 | `LR00516.jpg` | `Leaf Redding` | `Bacterial Blight` | **96.16%** |
| 4 | `LR00526.jpg` | `Leaf Redding` | `Bacterial Blight` | **95.28%** |
| 5 | `LHJ00178.jpg` | `Leaf Hopper Jassids` | `Bacterial Blight` | **90.70%** |
| 6 | `HL00098.jpg` | `Healthy Leaf` | `Leaf Hopper Jassids` | **88.10%** |
| 7 | `LHJ00221.jpg` | `Leaf Hopper Jassids` | `Healthy Leaf` | **87.82%** |
| 8 | `LR00555.jpg` | `Leaf Redding` | `Bacterial Blight` | **85.32%** |
| 9 | `CV00401.jpg` | `Curl Virus` | `Healthy Leaf` | **83.52%** |
| 10 | `LHJ00051.jpg` | `Leaf Hopper Jassids` | `Leaf Redding` | **82.59%** |
| 11 | `LR00414.jpg` | `Leaf Redding` | `Leaf Hopper Jassids` | **82.20%** |
| 12 | `CV00385.jpg` | `Curl Virus` | `Leaf Hopper Jassids` | **82.00%** |
| 13 | `LHJ00011.jpg` | `Leaf Hopper Jassids` | `Curl Virus` | **81.90%** |
| 14 | `HGD00188.jpg` | `Herbicide Growth Damage` | `Leaf Variegation` | **81.81%** |
| 15 | `HGD00094.jpg` | `Herbicide Growth Damage` | `Leaf Hopper Jassids` | **81.54%** |
| 16 | `CV00415.jpg` | `Curl Virus` | `Healthy Leaf` | **80.62%** |
| 17 | `LR00245.jpg` | `Leaf Redding` | `Curl Virus` | **79.78%** |
| 18 | `LR00429.jpg` | `Leaf Redding` | `Bacterial Blight` | **76.75%** |
| 19 | `CV00022.jpg` | `Curl Virus` | `Healthy Leaf` | **76.66%** |
| 20 | `HGD00238.jpg` | `Herbicide Growth Damage` | `Leaf Hopper Jassids` | **75.71%** |

---

## 4. Generated Artifacts Location

- **Confusion Matrix Figure**: [`confusion_matrix.png`](file:///D:/Agrilens/backend/ai/reports/confusion_matrix.png)
- **Classification Report TXT**: [`classification_report.txt`](file:///D:/Agrilens/backend/ai/reports/classification_report.txt)
- **Top 20 Misclassifications CSV**: [`top20_misclassifications.csv`](file:///D:/Agrilens/backend/ai/reports/top20_misclassifications.csv)
- **Full Markdown Report**: [`model_analysis_report.md`](file:///D:/Agrilens/backend/ai/reports/model_analysis_report.md)
