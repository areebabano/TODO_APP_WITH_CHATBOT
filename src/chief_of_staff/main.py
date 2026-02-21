"""Main entry point for the Chief of Staff CLI application."""

from chief_of_staff.app import AppController
from chief_of_staff.services.task_service import TaskService
from chief_of_staff.storage.memory_store import MemoryStore


def main() -> None:
    """
    Run the Chief of Staff interactive CLI application.

    Initializes the storage, service, and controller layers,
    then starts the persistent UI loop.
    """
    # Initialize dependency chain: Storage -> Service -> Controller
    storage = MemoryStore()
    service = TaskService(storage)
    controller = AppController(service)

    # Run the application loop
    controller.run()


if __name__ == "__main__":
    main()
