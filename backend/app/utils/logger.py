# ============================================================
# AgriLens Backend — Logger Configuration
# ============================================================
# Provides a structured logger using Python's stdlib logging.
# Usage:
#   from app.utils.logger import get_logger
#   logger = get_logger(__name__)
#   logger.info("Server started")
# ============================================================

import logging
import sys


def get_logger(name: str) -> logging.Logger:
    """
    Create and return a configured logger instance.

    Args:
        name: Logger name, typically __name__ of the calling module.

    Returns:
        A configured logging.Logger instance with console output.
    """
    logger = logging.getLogger(name)

    # Avoid adding duplicate handlers if logger already exists
    if logger.handlers:
        return logger

    logger.setLevel(logging.DEBUG)

    # ----- Console Handler -----
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.DEBUG)

    # ----- Formatter -----
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    console_handler.setFormatter(formatter)

    logger.addHandler(console_handler)

    # Prevent log propagation to root logger (avoids duplicate output)
    logger.propagate = False

    return logger
