# TaskServiceCoreSkill.md

## Skill Name
`task-service-core-implementation`

## Purpose
Implement the TaskService class with core CRUD operations (create, read, update, delete) and business logic validation, coordinating between the CLI layer and storage layer.

## Responsibilities
1. **Define TaskService Class**
   - Create class with `_storage: MemoryStore` private attribute
   - Accept storage via constructor injection: `__init__(self, storage: MemoryStore)`
   - Add class docstring explaining service purpose

2. **Implement Create Operation**
   - Create `create_task(self, title: str, description: Optional[str] = None) -> Task`
   - Validate title is non-empty (raise ValidationError if empty)
   - Strip whitespace from title and description
   - Create Task instance with validated data
   - Store via `_storage.add()`
   - Return created Task object

3. **Implement Read Operations**
   - Create `get_task(self, task_id: str) -> Task`
   - Retrieve from storage and convert dict to Task via `Task.from_dict()`
   - Catch `TaskNotFoundException` and raise `TaskNotFoundError`
   - Create `get_all_tasks(self) -> List[Task]`
   - Convert all storage dicts to Task objects
   - Return empty list if no tasks

4. **Implement Update Operation**
   - Create `update_task(self, task_id: str, title: Optional[str] = None, description: Optional[str] = None) -> Task`
   - Retrieve existing task first
   - Apply only provided updates (not None)
   - Validate new title if provided
   - Update `updated_at` timestamp
   - Store and return updated Task

5. **Implement Delete Operation**
   - Create `delete_task(self, task_id: str) -> None`
   - Catch `TaskNotFoundException` and raise `TaskNotFoundError`
   - Delegate to `_storage.delete()`

## Rules
1. **MUST** inject storage via constructor - never instantiate internally
2. **MUST** raise `ValidationError` for empty/invalid title
3. **MUST** wrap `TaskNotFoundException` as `TaskNotFoundError`
4. **MUST** return Task objects, not dictionaries
5. **MUST** have full type hints including Optional, List
6. **MUST** include docstrings with Args, Returns, Raises sections
7. **MUST NOT** perform file I/O or CLI operations
8. **MUST NOT** expose storage layer exceptions to callers

## Constraints
- Depends on MemoryStore being implemented
- Depends on Task model with from_dict method
- Depends on service exceptions being defined
- File location: `services/task_service.py`
- Must be importable as `from services import TaskService`

## When to Use / Trigger Conditions
- **Primary Trigger**: After ServiceExceptionsSkill completes
- **User Request**: "Implement TaskService", "Create service layer"
- **Prerequisite For**: TaskServiceStatusSkill, all CLI command skills
- **Never Use When**: TaskService core operations already exist

## Validation Checklist
Before marking complete, verify:
- [ ] TaskService accepts MemoryStore in constructor
- [ ] `create_task()` validates and creates tasks
- [ ] `create_task()` raises ValidationError for empty title
- [ ] `get_task()` returns Task object
- [ ] `get_task()` raises TaskNotFoundError for missing task
- [ ] `get_all_tasks()` returns List[Task]
- [ ] `get_all_tasks()` returns empty list when no tasks
- [ ] `update_task()` modifies existing task
- [ ] `update_task()` only updates provided fields
- [ ] `delete_task()` removes task from storage
- [ ] All methods have proper type hints
- [ ] All methods have docstrings

## Output Artifacts
- `services/task_service.py` - TaskService class implementation
- Updated `services/__init__.py` - Export TaskService

## Code Pattern
```python
"""Task management service layer."""
from typing import List, Optional

from models import Task
from storage import MemoryStore, TaskNotFoundException
from services.exceptions import TaskNotFoundError, ValidationError


class TaskService:
    """Service layer for task management operations.

    Provides business logic for creating, reading, updating, and deleting
    tasks while enforcing validation rules and coordinating with storage.
    """

    def __init__(self, storage: MemoryStore) -> None:
        """Initialize TaskService with storage dependency.

        Args:
            storage: MemoryStore instance for task persistence.
        """
        self._storage = storage

    def create_task(
        self, title: str, description: Optional[str] = None
    ) -> Task:
        """Create a new task with validation.

        Args:
            title: Task title (required, non-empty).
            description: Optional task description.

        Returns:
            The created Task instance.

        Raises:
            ValidationError: If title is empty or whitespace-only.
        """
        title = title.strip() if title else ""
        if not title:
            raise ValidationError("Title cannot be empty", field="title")

        description = description.strip() if description else None

        task = Task(title=title, description=description)
        self._storage.add(task)
        return task

    def get_task(self, task_id: str) -> Task:
        """Retrieve a task by ID.

        Args:
            task_id: The unique identifier of the task.

        Returns:
            The Task instance.

        Raises:
            TaskNotFoundError: If task does not exist.
        """
        try:
            task_dict = self._storage.get(task_id)
            return Task.from_dict(task_dict)
        except TaskNotFoundException:
            raise TaskNotFoundError(task_id)

    def get_all_tasks(self) -> List[Task]:
        """Retrieve all tasks.

        Returns:
            List of all Task instances.
        """
        task_dicts = self._storage.get_all()
        return [Task.from_dict(td) for td in task_dicts]

    def update_task(
        self,
        task_id: str,
        title: Optional[str] = None,
        description: Optional[str] = None,
    ) -> Task:
        """Update an existing task.

        Args:
            task_id: The unique identifier of the task to update.
            title: New title (optional).
            description: New description (optional).

        Returns:
            The updated Task instance.

        Raises:
            TaskNotFoundError: If task does not exist.
            ValidationError: If new title is empty.
        """
        task = self.get_task(task_id)

        if title is not None:
            title = title.strip()
            if not title:
                raise ValidationError("Title cannot be empty", field="title")
            task.title = title

        if description is not None:
            task.description = description.strip() or None

        from datetime import datetime
        task.updated_at = datetime.now()

        self._storage.update(task_id, task)
        return task

    def delete_task(self, task_id: str) -> None:
        """Delete a task by ID.

        Args:
            task_id: The unique identifier of the task to delete.

        Raises:
            TaskNotFoundError: If task does not exist.
        """
        try:
            self._storage.delete(task_id)
        except TaskNotFoundException:
            raise TaskNotFoundError(task_id)
```
