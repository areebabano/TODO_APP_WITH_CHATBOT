"""
Rate limiting functionality for API endpoints.
"""

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import FastAPI


def init_rate_limiter(app: FastAPI):
    """
    Initialize the rate limiter for the application.

    Args:
        app: FastAPI application instance
    """
    limiter = Limiter(key_func=get_remote_address)
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    return limiter


# Global limiter instance that can be configured during app startup
limiter = Limiter(key_func=get_remote_address)


def get_limiter() -> 'Limiter':
    """
    Get the rate limiter instance.

    Returns:
        Limiter instance
    """
    return limiter