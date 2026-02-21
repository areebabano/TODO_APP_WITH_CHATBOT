"""Service layer exceptions."""


class ValidationError(Exception):
    """Raised when service-level input validation fails."""

    def __init__(self, message: str) -> None:
        """
        Initialize ValidationError.

        Args:
            message: Description of the validation error.
        """
        self.message = message
        super().__init__(message)


class TaskNotFoundError(Exception):
    """Raised when a task is not found."""

    def __init__(self, task_id: str) -> None:
        """
        Initialize TaskNotFoundError.

        Args:
            task_id: The ID of the task that was not found.
        """
        self.task_id = task_id
        super().__init__(f"Task not found: {task_id}")
