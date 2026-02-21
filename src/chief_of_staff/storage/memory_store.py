"""In-memory storage implementation for tasks."""

from typing import Any

from chief_of_staff.models.task import Task
from chief_of_staff.storage.exceptions import TaskNotFoundException


class MemoryStore:
    """
    In-memory storage for Task entities.

    Uses a dictionary to store tasks, keyed by task ID (as string).
    Maintains insertion order (Python 3.7+ dict behavior).
    """

    def __init__(self) -> None:
        """Initialize an empty task store."""
        self._tasks: dict[str, Task] = {}

    def add(self, task: Task) -> Task:
        """
        Add a task to the store.

        Args:
            task: The task to add.

        Returns:
            The added task.
        """
        self._tasks[str(task.id)] = task
        return task

    def get(self, task_id: str) -> Task:
        """
        Get a task by ID.

        Args:
            task_id: The ID of the task to retrieve.

        Returns:
            The task with the given ID.

        Raises:
            TaskNotFoundException: If no task with the given ID exists.
        """
        task = self._tasks.get(task_id)
        if task is None:
            raise TaskNotFoundException(task_id)
        return task

    def get_all(self) -> list[Task]:
        """
        Get all tasks in the store.

        Returns:
            List of all tasks in insertion order.
        """
        return list(self._tasks.values())

    def exists(self, task_id: str) -> bool:
        """
        Check if a task exists in the store.

        Args:
            task_id: The ID to check.

        Returns:
            True if the task exists, False otherwise.
        """
        return task_id in self._tasks

    def update(self, task_id: str, **updates: Any) -> Task:
        """
        Update a task's fields.

        Args:
            task_id: The ID of the task to update.
            **updates: Keyword arguments with field names and new values.
                       Supported fields: title, description.

        Returns:
            The updated task.

        Raises:
            TaskNotFoundException: If no task with the given ID exists.
        """
        task = self.get(task_id)

        # Extract valid update fields
        title = updates.get("title")
        description = updates.get("description")

        # Apply updates through Task.update method
        task.update(title=title, description=description)

        return task

    def delete(self, task_id: str) -> None:
        """
        Delete a task from the store.

        Args:
            task_id: The ID of the task to delete.

        Raises:
            TaskNotFoundException: If no task with the given ID exists.
        """
        if task_id not in self._tasks:
            raise TaskNotFoundException(task_id)
        del self._tasks[task_id]
