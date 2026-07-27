"""
Duplicate Detector Utility for AgriLens AI Dataset Analysis.
Uses perceptual hashing (dhash/phash) and MD5 checksums to detect exact and visually identical duplicate images.
Generates duplicate_report.csv without deleting any images.
"""

import os
import csv
import hashlib
from pathlib import Path
from typing import Dict, List, Tuple, Any
from PIL import Image
import numpy as np

try:
    import imagehash
    HAS_IMAGEHASH = True
except ImportError:
    HAS_IMAGEHASH = False


def _compute_dhash(image: Image.Image, hash_size: int = 8) -> str:
    """Fallback dhash implementation using PIL and numpy."""
    gray = image.convert('L').resize((hash_size + 1, hash_size), Image.Resampling.BILINEAR)
    pixels = np.asarray(gray)
    diff = pixels[:, 1:] > pixels[:, :-1]
    # Convert boolean array to hex string
    decimal_val = 0
    hash_bits = []
    for bit in diff.flatten():
        hash_bits.append('1' if bit else '0')
    binary_str = ''.join(hash_bits)
    hex_str = f"{int(binary_str, 2):0{hash_size * hash_size // 4}x}"
    return hex_str


def _hamming_distance(hex1: str, hex2: str) -> int:
    """Calculate hamming distance between two hex hash strings."""
    val1 = int(hex1, 16)
    val2 = int(hex2, 16)
    xor_val = val1 ^ val2
    return bin(xor_val).count('1')


class DuplicateDetector:
    def __init__(self, dataset_path: str, max_hamming_distance: int = 4):
        self.dataset_path = Path(dataset_path)
        self.max_hamming_distance = max_hamming_distance

    def _get_image_hash(self, file_path: Path) -> Tuple[str, str]:
        """Returns (md5_hash, perceptual_hash_hex)"""
        with open(file_path, 'rb') as f:
            data = f.read()
            md5 = hashlib.md5(data).hexdigest()

        try:
            with Image.open(file_path) as img:
                if HAS_IMAGEHASH:
                    phash = str(imagehash.phash(img))
                else:
                    phash = _compute_dhash(img)
            return md5, phash
        except Exception:
            return md5, ""

    def detect_duplicates(self, output_csv_path: str) -> Dict[str, Any]:
        """
        Scans dataset directory, computes perceptual hashes, detects duplicates,
        and saves duplicate_report.csv.
        Does NOT delete any images.
        """
        if not self.dataset_path.exists():
            raise FileNotFoundError(f"Dataset path does not exist: {self.dataset_path}")

        image_records: List[Dict[str, Any]] = []

        # Gather all image files
        for root, _, files in os.walk(self.dataset_path):
            for f in files:
                file_path = Path(root) / f
                if file_path.suffix.lower() in {'.jpg', '.jpeg', '.png', '.bmp', '.webp', '.tiff'}:
                    md5, phash = self._get_image_hash(file_path)
                    image_records.append({
                        'path': file_path,
                        'relative_path': file_path.relative_to(self.dataset_path),
                        'md5': md5,
                        'phash': phash
                    })

        duplicates: List[Dict[str, Any]] = []
        n = len(image_records)

        # 1. Exact MD5 duplicates
        md5_map: Dict[str, List[Dict[str, Any]]] = {}
        for rec in image_records:
            md5_map.setdefault(rec['md5'], []).append(rec)

        seen_pairs = set()

        for md5, group in md5_map.items():
            if len(group) > 1:
                original = group[0]
                for dup in group[1:]:
                    pair_key = (str(original['relative_path']), str(dup['relative_path']))
                    if pair_key not in seen_pairs:
                        seen_pairs.add(pair_key)
                        duplicates.append({
                            'Original Image': str(original['relative_path']),
                            'Duplicate Image': str(dup['relative_path']),
                            'Similarity Score': '100.00%',
                            'Type': 'Exact MD5 Duplicate'
                        })

        # 2. Perceptual hash duplicates for items not already exact pairs
        hash_size_bits = len(image_records[0]['phash']) * 4 if image_records and image_records[0]['phash'] else 64

        for i in range(n):
            rec1 = image_records[i]
            if not rec1['phash']:
                continue
            for j in range(i + 1, n):
                rec2 = image_records[j]
                if not rec2['phash']:
                    continue
                pair_key = (str(rec1['relative_path']), str(rec2['relative_path']))
                if pair_key in seen_pairs:
                    continue

                dist = _hamming_distance(rec1['phash'], rec2['phash'])
                if dist <= self.max_hamming_distance:
                    similarity_pct = round((1.0 - (dist / float(hash_size_bits))) * 100.0, 2)
                    seen_pairs.add(pair_key)
                    duplicates.append({
                        'Original Image': str(rec1['relative_path']),
                        'Duplicate Image': str(rec2['relative_path']),
                        'Similarity Score': f"{similarity_pct:.2f}%",
                        'Type': 'Exact Duplicate' if dist == 0 else 'Visually Identical'
                    })

        # Save duplicate_report.csv
        out_path = Path(output_csv_path)
        out_path.parent.mkdir(parents=True, exist_ok=True)

        with open(out_path, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Original Image', 'Duplicate Image', 'Similarity Score'])
            for d in duplicates:
                writer.writerow([d['Original Image'], d['Duplicate Image'], d['Similarity Score']])

        return {
            'total_images_analyzed': len(image_records),
            'duplicate_count': len(duplicates),
            'duplicates': duplicates,
            'report_csv': str(out_path)
        }
