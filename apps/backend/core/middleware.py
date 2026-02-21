"""
Custom middleware for security headers and other security measures.
"""

from fastapi import FastAPI
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
import time


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add security headers to all responses.
    """

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "no-referrer-when-downgrade"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"

        return response


def add_security_middleware(app: FastAPI):
    """
    Add security middleware to the FastAPI application.

    Args:
        app: FastAPI application instance
    """
    app.add_middleware(SecurityHeadersMiddleware)


class TimingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to measure request processing time.
    """

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time

        # Add timing header to response
        response.headers["X-Process-Time"] = str(process_time)

        return response


def add_timing_middleware(app: FastAPI):
    """
    Add timing middleware to the FastAPI application.

    Args:
        app: FastAPI application instance
    """
    app.add_middleware(TimingMiddleware)