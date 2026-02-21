"""
Main FastAPI application for the Todo Web Application backend.
"""

import os
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

from fastapi import FastAPI
from apps.backend.api.v1.endpoints import auth, tasks
from apps.backend.core.errors import register_error_handlers
from apps.backend.core.cors import configure_cors
from apps.backend.core.middleware import add_security_middleware
from apps.backend.core.rate_limiter import init_rate_limiter

app = FastAPI(
    title="Todo Web Application API",
    description="REST API for the Todo Web Application",
    version="1.0.0",
)

init_rate_limiter(app)
configure_cors(app)
add_security_middleware(app)
register_error_handlers(app)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(tasks.router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"message": "Todo Web Application API", "status": "running", "version": "1.0.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "todo-backend-api"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "apps.backend.main:app",
        host="0.0.0.0",
        port=int(os.getenv("BACKEND_PORT", "8000")),
        reload=True,
    )
