"""
Preprocessing Module for AgriLens AI Training Pipeline.
Converts file paths and labels into optimized TensorFlow tf.data.Dataset pipelines
with caching, prefetching, and batching.

Images are returned as raw float32 tensors in [0, 255] range.
EfficientNetV2 has built-in Rescaling/Normalization layers that handle scaling internally.
"""

from typing import List, Tuple, Optional, Callable
import tensorflow as tf


def load_and_preprocess_image(
    image_path: tf.Tensor,
    target_size: Tuple[int, int] = (256, 256)
) -> tf.Tensor:
    """Reads image file from disk, decodes, and resizes to target dimensions.
    Returns raw float32 image in [0, 255] range — no preprocess_input scaling."""
    raw = tf.io.read_file(image_path)
    img = tf.image.decode_jpeg(raw, channels=3)
    img = tf.image.resize(img, target_size)
    # EfficientNetV2 has built-in rescaling; do NOT apply preprocess_input here.
    return img


def prepare_tf_dataset(
    image_paths: List[str],
    labels: List[int],
    batch_size: int = 32,
    target_size: Tuple[int, int] = (256, 256),
    is_training: bool = False,
    augmentation_fn: Optional[Callable] = None,
    shuffle_buffer_size: int = 2048
) -> tf.data.Dataset:
    """
    Creates an optimized tf.data.Dataset instance from image paths and integer labels.

    Args:
        image_paths: List of file paths.
        labels: List of integer class targets.
        batch_size: Mini-batch size.
        target_size: Target image dimensions (height, width).
        is_training: If True, applies shuffling and optional data augmentation.
        augmentation_fn: Optional augmentation layer / module applied ONLY during training.
        shuffle_buffer_size: Buffer size for shuffling training samples.

    Returns:
        tf.data.Dataset configured with AUTOTUNE, caching, and prefetching.
    """
    ds = tf.data.Dataset.from_tensor_slices((image_paths, labels))

    if is_training:
        ds = ds.shuffle(buffer_size=min(len(image_paths), shuffle_buffer_size))

    # Parse and decode images in parallel
    def _parse_fn(path: tf.Tensor, label: tf.Tensor) -> Tuple[tf.Tensor, tf.Tensor]:
        img = load_and_preprocess_image(path, target_size=target_size)
        return img, label

    ds = ds.map(_parse_fn, num_parallel_calls=tf.data.AUTOTUNE)

    # Cache decoded images in RAM — dataset is small enough (~4 GB at 256×256)
    ds = ds.cache()

    # Re-shuffle after cache on every epoch for training
    if is_training:
        ds = ds.shuffle(buffer_size=min(len(image_paths), shuffle_buffer_size))

    # Batch before augmentation to leverage vectorized GPU ops
    ds = ds.batch(batch_size)

    # Apply training augmentation ONLY if requested and during training
    if is_training and augmentation_fn is not None:
        ds = ds.map(
            lambda x, y: (augmentation_fn(x, training=True), y),
            num_parallel_calls=tf.data.AUTOTUNE
        )

    # Performance optimization: prefetch next batch while GPU works on current
    ds = ds.prefetch(buffer_size=tf.data.AUTOTUNE)

    return ds
