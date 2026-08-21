"""
Model Builder Module for AgriLens AI Training Pipeline.
Supports state-of-the-art vision backbones (EfficientNetV2, ConvNeXt, MobileNetV3, MobileNetV2),
AdamW optimizer with weight decay, and multi-stage unfreezing for fine-tuning.
Compatible across Keras 3, Keras 2, and TensorFlow 2.x with Mixed Precision support.

Input images are expected in [0, 255] float32 range.
EfficientNetV2 has built-in Rescaling layers that handle normalization internally.
"""

from typing import Tuple, Optional
import tensorflow as tf
from tensorflow.keras import Model
from tensorflow.keras.layers import (
    Input,
    GlobalAveragePooling2D,
    Dense,
    Dropout,
    BatchNormalization
)

try:
    from tensorflow.keras.applications import (
        EfficientNetV2B0,
        EfficientNetV2B1,
        EfficientNetV2B2,
        EfficientNetB0,
        MobileNetV3Large,
        MobileNetV2
    )
    HAS_EFFICIENTNETV2 = True
except ImportError:
    HAS_EFFICIENTNETV2 = False

try:
    from tensorflow.keras.applications import ConvNeXtTiny
    HAS_CONVNEXT = True
except ImportError:
    HAS_CONVNEXT = False


def get_base_backbone(backbone_name: str, input_shape: Tuple[int, int, int], inputs: Input) -> Model:
    """Instantiates requested pre-trained ImageNet backbone model."""
    name_clean = backbone_name.lower().replace("-", "_")

    if name_clean == "efficientnetv2_b0":
        return EfficientNetV2B0(weights="imagenet", include_top=False, input_shape=input_shape, input_tensor=inputs)
    elif name_clean == "efficientnetv2_b1":
        return EfficientNetV2B1(weights="imagenet", include_top=False, input_shape=input_shape, input_tensor=inputs)
    elif name_clean == "efficientnetv2_b2":
        return EfficientNetV2B2(weights="imagenet", include_top=False, input_shape=input_shape, input_tensor=inputs)
    elif name_clean == "efficientnet_b0":
        return EfficientNetB0(weights="imagenet", include_top=False, input_shape=input_shape, input_tensor=inputs)
    elif name_clean == "convnext_tiny" and HAS_CONVNEXT:
        return ConvNeXtTiny(weights="imagenet", include_top=False, input_shape=input_shape, input_tensor=inputs)
    elif name_clean == "mobilenetv3_large":
        return MobileNetV3Large(weights="imagenet", include_top=False, input_shape=input_shape, input_tensor=inputs)
    else:
        # Fallback to MobileNetV2
        return MobileNetV2(weights="imagenet", include_top=False, input_shape=input_shape, input_tensor=inputs)


def get_optimizer(optimizer_type: str, learning_rate: float, weight_decay: float = 1e-4, clipnorm: Optional[float] = 1.0):
    """Instantiates AdamW, Adam, or SGD optimizer with gradient clipping."""
    opt_type = optimizer_type.lower()
    
    if opt_type == "adamw" and hasattr(tf.keras.optimizers, "AdamW"):
        return tf.keras.optimizers.AdamW(
            learning_rate=learning_rate,
            weight_decay=weight_decay,
            clipnorm=clipnorm
        )
    elif opt_type == "sgd":
        return tf.keras.optimizers.SGD(
            learning_rate=learning_rate,
            momentum=0.9,
            nesterov=True,
            clipnorm=clipnorm
        )
    else:
        return tf.keras.optimizers.Adam(
            learning_rate=learning_rate,
            clipnorm=clipnorm
        )


def build_model(
    backbone_name: str = "efficientnetv2_b0",
    input_shape: Tuple[int, int, int] = (256, 256, 3),
    num_classes: int = 7,
    learning_rate: float = 1e-3,
    dropout_rate: float = 0.4,
    optimizer_type: str = "adamw",
    weight_decay: float = 1e-4,
    loss_type: str = "sparse_categorical_crossentropy",
) -> Tuple[Model, Model]:
    """
    Constructs a Transfer Learning Classifier with frozen backbone layers.
    Uses float32 output layer dtype for mixed precision safety.
    """
    inputs = Input(shape=input_shape, name="input_image")

    # Instantiate pre-trained backbone
    base_model = get_base_backbone(backbone_name, input_shape, inputs)

    # Freeze backbone initially for Transfer Learning Stage 1
    base_model.trainable = False

    # Classification Head
    x = base_model.output
    x = GlobalAveragePooling2D(name="global_avg_pool")(x)
    x = BatchNormalization(name="batch_norm")(x)
    x = Dropout(dropout_rate / 2.0, name="dropout_1")(x)
    x = Dense(256, activation="relu", name="dense_256")(x)
    x = Dropout(dropout_rate, name="dropout_2")(x)
    
    # Final output layer uses explicit float32 dtype for mixed precision compatibility
    # (prevents InTopKV2 float16 vs float32 mismatch error)
    outputs = Dense(num_classes, activation="softmax", dtype="float32", name="predictions")(x)

    model_name = f"AgriLens_{backbone_name}"
    model = Model(inputs=inputs, outputs=outputs, name=model_name)

    # Compile Model — use string loss for Keras 3 compatibility
    optimizer = get_optimizer(optimizer_type, learning_rate, weight_decay)

    model.compile(
        optimizer=optimizer,
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )

    return model, base_model


# Backwards compatibility alias
def build_mobilenetv2_model(*args, **kwargs):
    kwargs.setdefault("backbone_name", "mobilenetv2")
    return build_model(*args, **kwargs)


def unfreeze_model_for_finetuning(
    model: Model,
    unfreeze_layers_count: int = 80,
    learning_rate: float = 1e-4,
    optimizer_type: str = "adamw",
    weight_decay: float = 1e-4,
) -> Model:
    """
    Unfreezes the top N layers of the backbone for Fine-Tuning Stage 2.
    BatchNormalization layers remain frozen for stability.
    """
    model.trainable = True

    total_layers = len(model.layers)
    freeze_until = max(0, total_layers - unfreeze_layers_count)

    for i, layer in enumerate(model.layers):
        if i < freeze_until:
            layer.trainable = False
        else:
            # BatchNormalization layers remain locked in eval mode for stability
            if isinstance(layer, BatchNormalization):
                layer.trainable = False
            else:
                layer.trainable = True

    optimizer = get_optimizer(optimizer_type, learning_rate, weight_decay)

    model.compile(
        optimizer=optimizer,
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )

    return model
