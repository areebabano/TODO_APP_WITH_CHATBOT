# MemoryStoreCRUDSkill.md

## Skill Name
`memory-store-crud-implementation`

## Purpose
Implement the MemoryStore class providing complete CRUD (Create, Read, Update, Delete) operations for in-memory task persistence.

## Responsibilities
1. **Define MemoryStore Class**
   - Create class with `_tasks: Dict[str, Dict]` private attribute
   - Initialize empty dictionary in `__init__`
   - Add class docstring explaining purpose and usage

2. **Implement Create Operation**
   - Create `add(self, task: Task) -> Dict[str, Any]` method
   - Convert Task to dict using `task.to_dict()`
   - Store with `str(task.id)` as key
   - Return the stored dictionary

3. **Implement Read Operations**
   - Create `get(self, task_id: str) -> Dict[str, Any]` method
   - Raise `TaskNotFoundException` if task_id not found
   - Return a copy of the stored dict (prevent mutation)
   - Create `get_all(self) -> List[Dict[str, Any]]` method
   - Return list of all task dicts (copies)
   - Return empty list if no tasks

4. **Implement Update Operation**
   - Create `update(self, task_id: str, task: Task) -> Dict[str, Any]` method
   - Verify task exists before updating
   - Raise `TaskNotFoundException` if not found
   - Replace stored dict with new `task.to_dict()`
   - Return updated dictionary

5. **Implement Delete Operation**
   - Create `delete(self, task_id: str) -> None` method
   - Verify task exists before deleting
   - Raise `TaskNotFoundException` if not found
   - Remove task from internal dictionary

## Rules
1. **MUST** store tasks as dictionaries, not Task objects
2. **MUST** use string task IDs as dictionary keys
3. **MUST** raise `TaskNotFoundException` for missing tasks in get/update/delete
4. **MUST** return copies of stored data to prevent external mutation
5. **MUST** have full type hints on all methods
6. **MUST** include docstrings with Args, Returns, Raises sections
7. **MUST NOT** perform any file I/O operations
8. **MUST NOT** implement thread safety (not required for Phase 1)

## Constraints
- In-memory only - no file persistence
- Depends on Task model with `to_dict()` method
- Depends on TaskNotFoundException being defined
- File location: `storage/memory_store.py`
- Must be importable as `from storage import MemoryStore`

## When to Use / Trigger Conditions
- **Primary Trigger**: After StorageExceptionsSkill completes
- **User Request**: "Implement MemoryStore", "Create storage layer", "Add CRUD operations"
- **Prerequisite For**: All ServiceAgent skills
- **Never Use When**: MemoryStore already exists with all CRUD operations

## Validation Checklist
Before marking complete, verify:
- [ ] MemoryStore class defined with _tasks attribute
- [ ] `add()` stores task and returns dict
- [ ] `get()` retrieves task by ID
- [ ] `get()` raises TaskNotFoundException for missing ID
- [ ] `get_all()` returns all tasks as list
- [ ] `get_all()` returns empty list when no tasks
- [ ] `update()` modifies existing task
- [ ] `update()` raises TaskNotFoundException for missing ID
- [ ] `delete()` removes task
- [ ] `delete()` raises TaskNotFoundException for missing ID
- [ ] All methods have proper type hints
- [ ] All methods have docstrings
- [ ] Returned dicts are copies (test mutation isolation)

## Output Artifacts
- `storage/memory_store.py` - MemoryStore class implementation
- Updated `storage/__init__.py` - Export MemoryStore

## Code Pattern
```python
"""In-memory storage implementation for tasks."""
from typing import Any, Dict, List

from models import Task
from storage.exceptions import TaskNotFoundException


class MemoryStore:
    """In-memory storage for tasks using dictionary-based persistence.

    Tasks are stored as dictionaries keyed by their string ID.
    This implementation is suitable for development and testing.
    """

    def __init__(self) -> None:
        """Initialize empty task storage."""
        self._tasks: Dict[str, Dict[str, Any]] = {}

    def add(self, task: Task) -> Dict[str, Any]:
        """Add a task to storage.

        Args:
            task: The Task instance to store.

        Returns:
            Dictionary representation of the stored task.
        """
        task_dict = task.to_dict()
        self._tasks[str(task.id)] = task_dict
        return task_dict.copy()

    def get(self, task_id: str) -> Dict[str, Any]:
        """Retrieve a task by ID.

        Args:
            task_id: The unique identifier of the task.

        Returns:
            Dictionary representation of the task.

        Raises:
            TaskNotFoundException: If task with given ID does not exist.
        """
        if task_id not in self._tasks:
            raise TaskNotFoundException(task_id)
        return self._tasks[task_id].copy()

    def get_all(self) -> List[Dict[str, Any]]:
        """Retrieve all tasks.

        Returns:
            List of dictionary representations of all tasks.
        """
        return [task.copy() for task in self._tasks.values()]

    def update(self, task_id: str, task: Task) -> Dict[str, Any]:
        """Update an existing task.

        Args:
            task_id: The unique identifier of the task to update.
            task: The updated Task instance.

        Returns:
            Dictionary representation of the updated task.

        Raises:
            TaskNotFoundException: If task with given ID does not exist.
        """
        if task_id not in self._tasks:
            raise TaskNotFoundException(task_id)
        task_dict = task.to_dict()
        self._tasks[task_id] = task_dict
        return task_dict.copy()

    def delete(self, task_id: str) -> None:
        """Delete a task by ID.

        Args:
            task_id: The unique identifier of the task to delete.

        Raises:
            TaskNotFoundException: If task with given ID does not exist.
        """
        if task_id not in self._tasks:
            raise TaskNotFoundException(task_id)
        del self._tasks[task_id]
```
