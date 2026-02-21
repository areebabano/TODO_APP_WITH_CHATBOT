"""
Custom error handling and response formatting for the API.
"""

from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from typing import Union
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Custom handler for HTTP exceptions.

    Args:
        request: The incoming request
        exc: The HTTP exception

    Returns:
        JSONResponse with error details
    """
    logger.warning(f"HTTP Exception: {exc.status_code} - {exc.detail}")

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": "Request failed",
            "message": exc.detail
        }
    )


async def validation_exception_handler(request: Request, exc: Exception):
    """
    Custom handler for validation exceptions.

    Args:
        request: The incoming request
        exc: The validation exception

    Returns:
        JSONResponse with error details
    """
    logger.warning(f"Validation Exception: {str(exc)}")

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "Validation failed",
            "message": "Invalid input data"
        }
    )


async def general_exception_handler(request: Request, exc: Exception):
    """
    General exception handler for unexpected errors.

    Args:
        request: The incoming request
        exc: The exception

    Returns:
        JSONResponse with error details
    """
    logger.error(f"General Exception: {str(exc)}", exc_info=True)

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "message": "An unexpected error occurred"
        }
    )


def register_error_handlers(app):
    """
    Register custom error handlers with the FastAPI application.

    Args:
        app: FastAPI application instance
    """
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)

    # For validation errors, we use the default Pydantic handler
    # but could customize it if needed