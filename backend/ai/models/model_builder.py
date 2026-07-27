"""
Model Builder Module for AgriLens AI Training Pipeline.
Constructs transfer learning models based on MobileNetV2 pre-trained on ImageNet.
Includes architecture construction, frozen backbone setup, compilation, and fine-tuning unfreezing.
"""

from typing import Tuple
import tensorflow as tf
from tensorflow.keras import Model
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import (
    Input,
    GlobalAveragePooling2D,
    Dense,
    Dropout,
    BatchNormalization
)


def build_mobilenetv2_model(
    input_shape: Tuple[int, int, int] = (224, 224, 3),
    num_classes: int = 7,
    learning_rate: float = 1e-3,
    dropout_rate: float = 0.4
) -> Tuple[Model, Model]:
    """
    Builds a MobileNetV2 transfer learning classifier with frozen backbone layers.

    Args:
        input_shape: Image input dimensions (height, width, channels).
        num_classes: Number of output disease classes.
        learning_rate: Initial learning rate for Adam optimizer.
        dropout_rate: Dropout rate for regularization.

    Returns:
        Tuple[Model, Model]: (compiled_full_model, base_mobilenet_backbone)
    """
    inputs = Input(shape=input_shape, name="input_image")

    # Load ImageNet pre-trained backbone without top classification head
    base_model = MobileNetV2(
        weights="imagenet",
        include_top=False,
        input_shape=input_shape,
        input_tensor=inputs
    )

    # Freeze base model layers initially for Transfer Learning Phase 1
    base_model.trainable = False

    # Classification Head
    x = base_model.output
    x = GlobalAveragePooling2D(name="global_avg_pool")(x)
    x = BatchNormalization(name="batch_norm")(x)
    x = Dropout(dropout_rate / 2.0, name="dropout_1")(x)
    x = Dense(256, activation="relu", name="dense_256")(x)
    x = Dropout(dropout_rate, name="dropout_2")(x)
    outputs = Dense(num_classes, activation="softmax", name="predictions")(x)

    model = Model(inputs=inputs, outputs=outputs, name="AgriLens_Cotton_MobileNetV2")

    # Compile Model
    optimizer = tf.keras.optimizers.Adam(learning_rate=learning_rate)
    model.compile(
        optimizer=optimizer,
        loss="sparse_categorical_crossentropy",
        metrics=[
            "accuracy",
            tf.keras.metrics.SparseTopKCategoricalAccuracy(k=2, name="top2_accuracy")
        ]
    )

    return model, base_model


def unfreeze_model_for_finetuning(
    model: Model,
    unfreeze_layers_count: int = 30,
    learning_rate: float = 1e-5
) -> Model:
    """
    Unfreezes the top N layers of the backbone for Fine-Tuning Phase 2.

    Args:
        model: Compiled Keras model instance.
        unfreeze_layers_count: Number of top layers to unfreeze.
        learning_rate: Reduced learning rate for fine-tuning.

    Returns:
        Recompiled Keras model ready for fine-tuning.
    """
    # Find base model layer or iterate overall layers
    model.trainable = True

    # Freeze all layers except the last `unfreeze_layers_count`
    total_layers = len(model.layers)
    freeze_until = max(0, total_layers - unfreeze_layers_count)

    for i, layer in enumerate(model.layers):
        if i < freeze_until:
            layer.trainable = False
        else:
            # BatchNormalization layers should remain frozen in fine-tuning for stability
            if isinstance(layer, BatchNormalization):
                layer.trainable = False
            else:
                layer.trainable = True

    optimizer = tf.keras.optimizers.Adam(learning_rate=learning_rate)
    model.compile(
        optimizer=optimizer,
        loss="sparse_categorical_crossentropy",
        metrics=[
            "accuracy",
            tf.keras.metrics.SparseTopKCategoricalAccuracy(k=2, name="top2_accuracy")
        ]
    )

    return model
