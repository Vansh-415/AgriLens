# ============================================================
# AgriLens Backend — Production Dockerfile for Render Deployment
# ============================================================

FROM python:3.11-slim

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# Install system dependencies (curl for model download)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Ensure model directory exists and download best_model.keras directly from Hugging Face
RUN mkdir -p ai_models/cotton && \
    curl -fSL https://huggingface.co/vansh415/agrilens-cotton-model/resolve/main/best_model.keras -o ai_models/cotton/best_model.keras

# Expose default port
EXPOSE 8000

# Shell form for CMD so Render's dynamic $PORT environment variable expands at runtime
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
