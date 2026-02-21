"""Task service with business logic and validation."""

from typing import Optional

from chief_of_staff.models.task import Task
from chief_of_staff.services.exceptions import TaskNotFoundError, ValidationError
from chief_of_staff.storage.exceptions import TaskNotFoundException
from chief_of_staff.storage.memory_store import MemoryStore


class TaskService:
    """
    Service layer for task operations.

    Provides business logic, validation, and exception translation
    between the CLI layer and storage layer.
    """

    def __init__(self, storage: MemoryStore) -> None:
        """
        Initialize TaskService with storage dependency.

        Args:
            storage: The storage backend for tasks.
        """
        self._storage = storage

    def create_task(
        self,
        title: str,
        description: Optional[str] = None,
    ) -> Task:
        """
        Create a new task.

        Args:
            title: The task title (1-100 characters).
            description: Optional task description (0-500 characters).

        Returns:
            The created task.

        Raises:
            ValidationError: If title is empty or exceeds limits.
        """
        # Input validation
        if not title or not title.strip():
            raise ValidationError("Title cannot be empty")

        try:
            task = Task(title=title, description=description)
            return self._storage.add(task)
        except ValueError as e:
            raise ValidationError(str(e)) from e

    def list_tasks(self) -> list[Task]:
        """
        Get all tasks sorted by creation date.

        Returns:
            List of tasks sorted by created_at (oldest first).
        """
        tasks = self._storage.get_all()
        return sorted(tasks, key=lambda t: t.created_at)

    def get_task(self, task_id: str) -> Task:
        """
        Get a task by ID.

        Args:
            task_id: The ID of the task to retrieve.

        Returns:
            The task with the given ID.

        Raises:
            TaskNotFoundError: If no task with the given ID exists.
        """
        try:
            return self._storage.get(task_id)
        except TaskNotFoundException as e:
            raise TaskNotFoundError(task_id) from e

    def update_task(
        self,
        task_id: str,
        title: Optional[str] = None,
        description: Optional[str] = None,
    ) -> Task:
        """
        Update a task's fields.

        Args:
            task_id: The ID of the task to update.
            title: New title if provided.
            description: New description if provided.

        Returns:
            The updated task.

        Raises:
            TaskNotFoundError: If no task with the given ID exists.
            ValidationError: If new values fail validation.
        """
        try:
            task = self._storage.get(task_id)
        except TaskNotFoundException as e:
            raise TaskNotFoundError(task_id) from e

        try:
            task.update(title=title, description=description)
            return task
        except ValueError as e:
            raise ValidationError(str(e)) from e

    def delete_task(self, task_id: str) -> None:
        """
        Delete a task.

        Args:
            task_id: The ID of the task to delete.

        Raises:
            TaskNotFoundError: If no task with the given ID exists.
        """
        try:
            self._storage.delete(task_id)
        except TaskNotFoundException as e:
            raise TaskNotFoundError(task_id) from e

    def complete_task(self, task_id: str) -> Task:
        """
        Mark a task as complete.

        Args:
            task_id: The ID of the task to complete.

        Returns:
            The updated task.

        Raises:
            TaskNotFoundError: If no task with the given ID exists.
        """
        try:
            task = self._storage.get(task_id)
        except TaskNotFoundException as e:
            raise TaskNotFoundError(task_id) from e

        task.mark_complete()
        return task

    def uncomplete_task(self, task_id: str) -> Task:
        """
        Mark a task as incomplete.

        Args:
            task_id: The ID of the task to mark as incomplete.

        Returns:
            The updated task.

        Raises:
            TaskNotFoundError: If no task with the given ID exists.
        """
        try:
            task = self._storage.get(task_id)
        except TaskNotFoundException as e:
            raise TaskNotFoundError(task_id) from e

        task.mark_incomplete()
        return task
