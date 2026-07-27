"""
Main Execution Script for Module 4 Dataset Inspection & Verification.
Imports reusable tools from backend.ai.tools and executes complete inspection pipeline.
"""

import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from ai.tools.image_validator import ImageValidator
from ai.tools.duplicate_detector import DuplicateDetector
from ai.tools.dataset_analyzer import DatasetAnalyzer


DATASET_PATH = r"D:\Cotton Leaf Disease Detection Dataset\Cotton Leaf Disease Detection Dataset\Original Dataset"
REPORTS_DIR = Path(__file__).resolve().parent / "reports"


def main():
    print("=" * 60)
    print("AgriLens AI Module 4: Dataset Inspection & Verification")
    print("=" * 60)
    print(f"Dataset Path: {DATASET_PATH}")
    print(f"Reports Path: {REPORTS_DIR}\n")

    # Step 1: Validate images & auto-remove corrupted files
    print("[1/4] Validating Image Files & Checking Integrity...")
    validator = ImageValidator(DATASET_PATH)
    val_info = validator.validate_dataset(auto_remove=True)
    print(f"      Scanned: {val_info['total_scanned']} | Valid: {val_info['valid_count']} | Zero-byte: {val_info['zero_byte_count']} | Corrupted: {val_info['corrupted_count']}")
    if val_info['removed_files']:
        print(f"      Removed {len(val_info['removed_files'])} corrupted/unreadable files.")

    # Step 2: Detect duplicates with perceptual hashing
    print("[2/4] Detecting Duplicate Images (Perceptual Hashing)...")
    dup_csv_path = REPORTS_DIR / "duplicate_report.csv"
    detector = DuplicateDetector(DATASET_PATH, max_hamming_distance=4)
    dup_info = detector.detect_duplicates(str(dup_csv_path))
    print(f"      Found {dup_info['duplicate_count']} duplicate pairs. Logged to duplicate_report.csv")

    # Step 3: Detailed Dataset & Property Analysis & Report Generation
    print("[3/4] Running Structural & Property Analysis & Plot Generation...")
    analyzer = DatasetAnalyzer(DATASET_PATH)
    analysis_info = analyzer.analyze_dataset(
        output_dir=str(REPORTS_DIR),
        validation_info=val_info,
        duplicate_info=dup_info
    )

    # Step 4: Verification of Generated Reports
    print("[4/4] Verifying Generated Artifacts...")
    required_reports = [
        REPORTS_DIR / "dataset_report.md",
        REPORTS_DIR / "dataset_class_distribution.png",
        REPORTS_DIR / "dataset_preview.png",
        REPORTS_DIR / "duplicate_report.csv",
        REPORTS_DIR / "image_statistics.csv"
    ]

    missing_reports = [p for p in required_reports if not p.exists()]
    if missing_reports:
        print("ERROR: Missing reports:")
        for m in missing_reports:
            print(f"  - {m}")
        sys.exit(1)

    print("\n" + "=" * 60)
    print("Inspection Completed Successfully! All reports generated & verified.")
    print("=" * 60)


if __name__ == '__main__':
    main()
