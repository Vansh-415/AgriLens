"""
Image Validator Utility for AgriLens AI Dataset Analysis.
Validates images for corruption, readability, zero-byte size, and unsupported formats.
Only deletes corrupted or unreadable files when auto_remove is True.
"""

import os
from pathlib import Path
from typing import Dict, List, Tuple, Any
from PIL import Image, ImageOps


class ImageValidator:
    SUPPORTED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.bmp', '.webp', '.tiff'}

    def __init__(self, dataset_path: str):
        self.dataset_path = Path(dataset_path)

    def validate_dataset(self, auto_remove: bool = True) -> Dict[str, Any]:
        """
        Scans all files in dataset_path subdirectories.
        Checks for zero-byte, corrupted, unreadable, or unsupported format files.
        If auto_remove is True, deletes corrupted/unreadable/zero-byte files.
        Returns a summary report dict and list of removed files.
        """
        valid_files: List[Path] = []
        zero_byte_files: List[Path] = []
        corrupted_files: List[Tuple[Path, str]] = []
        unsupported_format_files: List[Path] = []
        removed_files: List[Dict[str, str]] = []

        if not self.dataset_path.exists():
            raise FileNotFoundError(f"Dataset path does not exist: {self.dataset_path}")

        for root, _, files in os.walk(self.dataset_path):
            for file_name in files:
                file_path = Path(root) / file_name

                # Check extension
                ext = file_path.suffix.lower()
                if ext not in self.SUPPORTED_EXTENSIONS:
                    unsupported_format_files.append(file_path)
                    continue

                # Check zero byte
                if file_path.stat().st_size == 0:
                    zero_byte_files.append(file_path)
                    if auto_remove:
                        try:
                            file_path.unlink()
                            removed_files.append({
                                'file': str(file_path),
                                'reason': 'Zero-byte empty file'
                            })
                        except Exception as e:
                            print(f"Error removing zero-byte file {file_path}: {e}")
                    continue

                # Check corruption / read error
                is_valid, error_msg = self._check_image_integrity(file_path)
                if not is_valid:
                    corrupted_files.append((file_path, error_msg))
                    if auto_remove:
                        try:
                            file_path.unlink()
                            removed_files.append({
                                'file': str(file_path),
                                'reason': f'Corrupted / Unreadable image ({error_msg})'
                            })
                        except Exception as e:
                            print(f"Error removing corrupted file {file_path}: {e}")
                else:
                    valid_files.append(file_path)

        return {
            'total_scanned': len(valid_files) + len(corrupted_files) + len(zero_byte_files) + len(unsupported_format_files),
            'valid_count': len(valid_files),
            'zero_byte_count': len(zero_byte_files),
            'corrupted_count': len(corrupted_files),
            'unsupported_format_count': len(unsupported_format_files),
            'corrupted_files': [(str(p), msg) for p, msg in corrupted_files],
            'zero_byte_files': [str(p) for p in zero_byte_files],
            'unsupported_format_files': [str(p) for p in unsupported_format_files],
            'removed_files': removed_files
        }

    def _check_image_integrity(self, file_path: Path) -> Tuple[bool, str]:
        """Verify image opens and pixel data can be fully decoded."""
        try:
            with Image.open(file_path) as img:
                img.verify()
            
            # Reopen to load pixel payload (verify closes/invalidates img stream)
            with Image.open(file_path) as img:
                img.load()
                # Try transpose/exif orientation to ensure full decoding
                _ = ImageOps.exif_transpose(img)
            return True, ""
        except Exception as e:
            return False, str(e)
