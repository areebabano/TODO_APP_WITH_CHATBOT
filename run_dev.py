#!/usr/bin/env python3
"""
Development script to run both frontend and backend simultaneously.
"""

import subprocess
import sys
import os
import platform
import argparse 


def run_backend(root_dir: str, port: int):
    """Run the backend server."""
    print("Starting backend server...")

    env = os.environ.copy()
    env["PYTHONPATH"] = root_dir + os.pathsep + env.get("PYTHONPATH", "")

    # Load .env into subprocess environment
    env_file = os.path.join(root_dir, ".env")
    if os.path.exists(env_file):
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, _, value = line.partition("=")
                    env[key.strip()] = value.strip()

    cmd = [
        sys.executable, "-m", "uvicorn",
        "apps.backend.main:app",
        "--host", "0.0.0.0",
        "--port", str(port),
        "--reload",
    ]
    return subprocess.Popen(cmd, cwd=root_dir, env=env)


def run_frontend(root_dir: str):
    """Run the frontend development server."""
    print("Starting frontend server...")

    frontend_dir = os.path.join(root_dir, "apps", "frontend")

    try:
        if platform.system() == "Windows":
            subprocess.run(["where", "npm"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, shell=True)
        else:
            subprocess.run(["which", "npm"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        cmd = ["npm", "run", "dev"]
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("Error: npm not found. Please install Node.js.")
        return None

    return subprocess.Popen(cmd, cwd=frontend_dir, shell=(platform.system() == "Windows"))


def main():
    parser = argparse.ArgumentParser(description="Run the Todo Application development servers")
    parser.add_argument("--backend-only", action="store_true", help="Run only the backend server")
    parser.add_argument("--frontend-only", action="store_true", help="Run only the frontend server")
    parser.add_argument("--port", type=int, default=8000, help="Backend port (default: 8000)")
    args = parser.parse_args()

    root_dir = os.path.dirname(os.path.abspath(__file__))
    processes = []

    if not args.frontend_only:
        backend_process = run_backend(root_dir, args.port)
        if backend_process:
            processes.append(("backend", backend_process))

    if not args.backend_only:
        frontend_process = run_frontend(root_dir)
        if frontend_process:
            processes.append(("frontend", frontend_process))

    if not processes:
        print("No processes started. Exiting.")
        return

    print(f"\nDevelopment servers started:")
    if not args.frontend_only:
        print(f"  Backend:  http://localhost:{args.port}")
    if not args.backend_only:
        print(f"  Frontend: http://localhost:3000")
    print("\nPress Ctrl+C to stop.\n")

    try:
        for name, process in processes:
            process.wait()
    except KeyboardInterrupt:
        print("\nShutting down...")
        for name, process in processes:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
        print("Servers stopped.")


if __name__ == "__main__":
    main()
