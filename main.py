"""
Unified entry point for the Todo Application (Phase I CLI and Phase II Web).

This file serves as the main entry point for the entire application, supporting:
- Phase I: Command-line interface (CLI) functionality
- Phase II: Web application backend API

The application preserves backward compatibility with Phase I while
adding Phase II multi-user web capabilities.
"""

import sys
import os
from typing import Optional

def run_cli_app():
    """Run the Phase I CLI application."""
    from chief_of_staff.main import main as cli_main
    print("Starting Phase I: Command-Line Interface...")
    cli_main()


def run_web_backend():
    """Run the Phase II Web Application backend."""
    print("Starting Phase II: Web Application Backend...")

    # Check if we have the required dependencies
    try:
        import uvicorn
        from apps.backend.main import app

        print("Web backend initialized successfully")
        print("Starting server on http://0.0.0.0:8000")

        # Run the FastAPI app with uvicorn
        uvicorn.run(
            "apps.backend.main:app",
            host="0.0.0.0",
            port=int(os.getenv("BACKEND_PORT", "8000")),
            reload=os.getenv("DEV_MODE", "false").lower() == "true"
        )
    except ImportError as e:
        print(f"Error starting web backend: {e}")
        print("Make sure you've installed the backend dependencies:")
        print("cd apps/backend && pip install -r requirements.txt")
        sys.exit(1)


def show_usage():
    """Display usage information."""
    print("Smart Personal Chief of Staff - Todo Application")
    print("=" * 50)
    print("Usage:")
    print("  python main.py cli          - Run Phase I CLI application")
    print("  python main.py web          - Run Phase II Web backend")
    print("  python main.py --help       - Show this help message")
    print("")
    print("Features:")
    print("- Phase I: Command-line task management")
    print("- Phase II: Multi-user web application with authentication")
    print("- Full backward compatibility maintained")


def main():
    """Main entry point for the unified application."""
    if len(sys.argv) < 2:
        show_usage()
        return

    command = sys.argv[1].lower()

    if command in ['--help', '-h', 'help']:
        show_usage()
    elif command == 'cli':
        run_cli_app()
    elif command in ['web', 'backend', 'api']:
        run_web_backend()
    else:
        print(f"Unknown command: {command}")
        show_usage()
        sys.exit(1)


if __name__ == "__main__":
    main()
