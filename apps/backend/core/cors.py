"""
CORS (Cross-Origin Resource Sharing) configuration for the backend.
"""

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import os


def configure_cors(app: FastAPI):
    """
    Configure CORS middleware for the FastAPI application.

    Args:
        app: FastAPI application instance
    """
    # Get allowed origins from environment variables or default to localhost
    allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
    if allowed_origins_env:
        allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",")]
    else:
        # Default to allowing localhost for development
        allowed_origins = [
            "http://localhost:3000",  # Next.js default port
            "http://localhost:3001",  # Alternative Next.js port
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
            "http://localhost:8000",  # Backend itself
            "http://127.0.0.1:8000",
        ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
        allow_headers=["*"],  # Allow all headers
        # Expose authorization header to frontend
        expose_headers=["Access-Control-Allow-Origin", "Authorization"],
    )