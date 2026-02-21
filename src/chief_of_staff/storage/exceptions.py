"""Storage layer exceptions."""


class TaskNotFoundException(Exception):
    """Raised when a task is not found in storage."""

    def __init__(self, task_id: str) -> None:
        """
        Initialize TaskNotFoundException.

        Args:
            task_id: The ID of the task that was not found.
        """
        self.task_id = task_id
        super().__init__(f"Task not found: {task_id}")
