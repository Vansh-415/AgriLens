# AgriLens AI Dataset Inspection & Verification Report

**Generated Date**: 2026-07-27  
**Module**: Module 4 (AI Training Preparation)  
**Target Crop**: Cotton (*Gossypium*)

---

## 1. Dataset Provenance & Metadata

| Metadata Field | Value |
| :--- | :--- |
| **Dataset Name** | Cotton Leaf Disease Detection Dataset |
| **Dataset Source** | Mendeley Data |
| **DOI** | [10.17632/b3jy2p6k8w](https://doi.org/10.17632/b3jy2p6k8w) |
| **Dataset Location** | `D:\Cotton Leaf Disease Detection Dataset\Cotton Leaf Disease Detection Dataset\Original Dataset` |
| **Augmented Dataset Status** | Ignored completely (Original dataset strictly used) |

---

## 2. Dataset Structure & Class Counts

- **Total Classes**: 7
- **Total Images**: 2,137

### Images per Class

| Class Name | Image Count | Percentage of Dataset |
| :--- | :---: | :---: |
| `Bacterial Blight` | 250 | 11.70% |
| `Curl Virus` | 431 | 20.17% |
| `Healthy Leaf` | 257 | 12.03% |
| `Herbicide Growth Damage` | 280 | 13.10% |
| `Leaf Hopper Jassids` | 225 | 10.53% |
| `Leaf Redding` | 578 | 27.05% |
| `Leaf Variegation` | 116 | 5.43% |

---

## 3. Class Balance & Distribution Analysis

- **Largest Class**: `Leaf Redding` with **578** images
- **Smallest Class**: `Leaf Variegation` with **116** images
- **Mean Class Size**: **305.29** images
- **Standard Deviation**: **140.65** images
- **Imbalance Ratio**: **4.98x** (Ratio of max to min class)

> [!NOTE]
> The dataset demonstrates a healthy distribution across all 7 cotton leaf disease classes. Class imbalance ratio is acceptable for transfer learning with CNN / Vision Transformer architectures.

---

## 4. Image Properties & Dimensionality Statistics

| Parameter | Value |
| :--- | :--- |
| **Width Range** | 800px - 800px (Avg: 800.0px) |
| **Height Range** | 800px - 800px (Avg: 800.0px) |
| **Average File Size** | 137.18 KB |
| **Formats** | {'JPEG': 2137} |
| **Color Channels** | {'RGB': 2137} |

---

## 5. Image Integrity & Corrupted Files

- **Total Scanned Files**: 2,137
- **Valid Files**: 2,137
- **Zero-Byte Files**: 0
- **Corrupted / Unreadable Files**: 0
- **Removed Files**: 0

### Log of Removed Files
*No corrupted or unreadable images were found. None removed.*

---

## 6. Duplicate Image Detection (Perceptual Hashing)

- **Total Duplicate Pairs Found**: 19
- **Detection Method**: Perceptual Hashing (dhash / phash) & MD5 Checksums
- **Duplicate Action**: Flagged & documented in `duplicate_report.csv` (NO files deleted).

---

## 7. Folder & Label Recommendations

- All class folder names strictly adhere to naming conventions. No syntax or capitalization fixes required.
- Recommendation: Maintain exact standard folder names `Bacterial Blight`, `Curl Virus`, `Healthy Leaf`, `Herbicide Growth Damage`, `Leaf Hopper Jassids`, `Leaf Redding`, `Leaf Variegation` during preprocessing and data loader setup.

---

## 8. Artifacts & Generated Assets

The following verification files have been generated in `backend/ai/reports/`:
1. [`dataset_report.md`](file:///d:/Agrilens/backend/ai/reports/dataset_report.md)
2. [`dataset_class_distribution.png`](file:///d:/Agrilens/backend/ai/reports/dataset_class_distribution.png)
3. [`dataset_preview.png`](file:///d:/Agrilens/backend/ai/reports/dataset_preview.png)
4. [`duplicate_report.csv`](file:///d:/Agrilens/backend/ai/reports/duplicate_report.csv)
5. [`image_statistics.csv`](file:///d:/Agrilens/backend/ai/reports/image_statistics.csv)

---

## 9. Final Decision

### READY FOR TRAINING: **YES**

> [!IMPORTANT]
> The dataset contains 2,137 valid images across all 7 target cotton leaf classes without corrupted files. It is verified and ready for dataset splitting (train/val/test) and AI model architecture training in subsequent steps.
