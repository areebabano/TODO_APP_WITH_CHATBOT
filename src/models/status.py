"""Task status enum for the Chief of Staff application."""

from enum import Enum


class TaskStatus(str, Enum):
    """Enum representing the possible statuses of a task."""

    PENDING = "incomplete"
    COMPLETED = "complete"

    def __str__(self) -> str:
        """Return the string value of the status."""
        return self.value