FROM python:3.11-slim

# Create non-root user (required by Hugging Face Spaces)
RUN useradd -m -u 1000 appuser

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY apps/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY apps/__init__.py apps/__init__.py
COPY apps/backend/ apps/backend/
COPY db/ db/

# Create __init__.py for db if missing
RUN touch db/__init__.py

# Switch to non-root user
RUN chown -R appuser:appuser /app
USER appuser

# Hugging Face Spaces uses port 7860
EXPOSE 7860

CMD ["uvicorn", "apps.backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
