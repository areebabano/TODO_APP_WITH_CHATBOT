# Feature Specification: In-Memory Storage Service

**Spec ID**: SPEC-003
**Feature Branch**: `001-task-cli-app`
**Created**: 2025-12-28
**Status**: Approved
**Priority**: P0
**Dependencies**: SPEC-001 (Project Setup), SPEC-002 (Task Data Model)

## Overview

Implement an in-memory storage layer using Python dictionaries to persist Task objects during application runtime. This layer provides CRUD (Create, Read, Update, Delete) operations and maintains insertion order for consistent task listing. The storage layer is designed for future replacement with persistent storage (e.g., SQLite) in subsequent phases.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Store and Retrieve Tasks (Priority: P1)

As a service layer, I need to store tasks and retrieve them by ID so that task data persists during application runtime.

**Why this priority**: Storage is fundamental - without it, no tasks can be persisted for the duration of the application session.

**Independent Test**: Add a task to storage, retrieve it by ID, verify the returned task matches the original exactly.

**Acceptance Scenarios**:

1. **Given** an empty storage, **When** a Task is added via add(), **Then** the task is stored and can be retrieved by its ID.

2. **Given** a storage with tasks, **When** get(task_id) is called with a valid ID, **Then** the corresponding Task is returned.

3. **Given** a storage with tasks, **When** get(task_id) is called with an invalid ID, **Then** TaskNotFoundException is raised with the ID in the message.

---

### User Story 2 - List All Tasks (Priority: P1)

As a service layer, I need to retrieve all tasks to support the list command.

**Why this priority**: Listing tasks is a core feature users will use frequently.

**Independent Test**: Add multiple tasks, call get_all(), verify all tasks are returned in insertion order.

**Acceptance Scenarios**:

1. **Given** a storage with 3 tasks added in order A, B, C, **When** get_all() is called, **Then** tasks are returned in order A, B, C (insertion order preserved).

2. **Given** an empty storage, **When** get_all() is called, **Then** an empty list is returned.

3. **Given** a storage with tasks, **When** one task is deleted and get_all() is called, **Then** remaining tasks are returned in original insertion order.

---

### User Story 3 - Update Existing Tasks (Priority: P2)

As a service layer, I need to update task attributes in storage so that changes are persisted.

**Why this priority**: Updates are important but secondary to basic storage and retrieval.

**Independent Test**: Add a task, update it via storage, retrieve and verify updates were applied.

**Acceptance Scenarios**:

1. **Given** a stored task, **When** update(task_id, title="New Title") is called, **Then** the task's title is updated and retrievable.

2. **Given** a stored task, **When** update(task_id, ...) is called with an invalid ID, **Then** TaskNotFoundException is raised.

3. **Given** a stored task, **When** update() is called with multiple fields, **Then** all specified fields are updated atomically.

---

### User Story 4 - Delete Tasks (Priority: P2)

As a service layer, I need to remove tasks from storage so that users can delete unwanted tasks.

**Why this priority**: Deletion is important for task management but secondary to viewing and modifying.

**Independent Test**: Add a task, delete it, verify it no longer exists in storage.

**Acceptance Scenarios**:

1. **Given** a stored task with known ID, **When** delete(task_id) is called, **Then** the task is removed and subsequent get() raises TaskNotFoundException.

2. **Given** a storage with multiple tasks, **When** one is deleted, **Then** other tasks remain unaffected.

3. **Given** an invalid task ID, **When** delete(task_id) is called, **Then** TaskNotFoundException is raised.

---

### User Story 5 - Check Task Existence (Priority: P3)

As a service layer, I need to check if a task exists without raising exceptions for flow control.

**Why this priority**: Existence checks are helper functionality.

**Independent Test**: Add a task, verify exists() returns True, delete it, verify exists() returns False.

**Acceptance Scenarios**:

1. **Given** a stored task, **When** exists(task_id) is called, **Then** True is returned.

2. **Given** no task with that ID, **When** exists(task_id) is called, **Then** False is returned (no exception).

---

### Edge Cases

- What happens when adding a task with duplicate ID? The existing task is overwritten (dict behavior).
- What happens when storage is cleared? get_all() returns empty list, all get() calls raise TaskNotFoundException.
- What happens with very large numbers of tasks? Performance may degrade but functionality remains correct.
- What happens when update() receives no fields to update? No changes made, no error raised.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: MemoryStore MUST use a Python dictionary with task ID (as string) as keys and Task objects as values.

- **FR-002**: MemoryStore MUST implement `add(task: Task) -> Task` that stores the task and returns it.

- **FR-003**: MemoryStore MUST implement `get(task_id: str | UUID) -> Task` that returns the task or raises TaskNotFoundException.

- **FR-004**: MemoryStore MUST implement `get_all() -> list[Task]` that returns all tasks in insertion order.

- **FR-005**: MemoryStore MUST implement `update(task_id: str | UUID, **updates) -> Task` that applies updates to the task and returns the modified task.

- **FR-006**: MemoryStore MUST implement `delete(task_id: str | UUID) -> None` that removes the task or raises TaskNotFoundException.

- **FR-007**: MemoryStore MUST implement `exists(task_id: str | UUID) -> bool` that returns True if task exists, False otherwise.

- **FR-008**: MemoryStore MUST preserve insertion order when listing tasks (using dict ordering in Python 3.7+).

- **FR-009**: TaskNotFoundException MUST be a custom exception defined in the storage layer that includes the task ID in its message.

- **FR-010**: All methods accepting task_id MUST handle both string and UUID types by converting to string internally.

- **FR-011**: MemoryStore MUST NOT modify the original Task object passed to add(); it should store the object directly (no deep copy required for Phase I).

### Key Entities

- **MemoryStore**: Storage class managing the in-memory dictionary of tasks.
  - Internal: `_tasks: dict[str, Task]` - Dictionary mapping task ID strings to Task objects

- **TaskNotFoundException**: Custom exception for missing task lookups.
  - Contains: `task_id` - The ID that was not found

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All CRUD operations complete in under 1 millisecond for stores with up to 1000 tasks.

- **SC-002**: Insertion order is maintained 100% of the time when calling get_all().

- **SC-003**: TaskNotFoundException is raised for all operations on non-existent tasks (except exists()).

- **SC-004**: Storage operations do not leak memory (tasks removed via delete() are garbage collected).

- **SC-005**: Storage correctly handles both string and UUID task identifiers interchangeably.

## Technical Context

### File Locations

- `src/chief_of_staff/storage/memory_store.py` - MemoryStore class
- `src/chief_of_staff/storage/exceptions.py` - TaskNotFoundException
- `src/chief_of_staff/storage/__init__.py` - Export public interfaces

### Class Structure

```python
# exceptions.py
class TaskNotFoundException(Exception):
    """Raised when a task is not found in storage."""

    def __init__(self, task_id: str) -> None:
        self.task_id = task_id
        super().__init__(f"Task not found: {task_id}")


# memory_store.py
from typing import Any
from uuid import UUID

from chief_of_staff.models.task import Task
from chief_of_staff.storage.exceptions import TaskNotFoundException


class MemoryStore:
    """In-memory storage for Task objects."""

    def __init__(self) -> None:
        """Initialize empty storage."""
        self._tasks: dict[str, Task] = {}

    def add(self, task: Task) -> Task:
        """Add a task to storage."""
        # Implementation

    def get(self, task_id: str | UUID) -> Task:
        """Retrieve a task by ID."""
        # Implementation

    def get_all(self) -> list[Task]:
        """Retrieve all tasks in insertion order."""
        # Implementation

    def update(self, task_id: str | UUID, **updates: Any) -> Task:
        """Update a task's fields."""
        # Implementation

    def delete(self, task_id: str | UUID) -> None:
        """Remove a task from storage."""
        # Implementation

    def exists(self, task_id: str | UUID) -> bool:
        """Check if a task exists."""
        # Implementation
```

### Storage Operations

| Operation | Input | Output | Errors |
|-----------|-------|--------|--------|
| add | Task | Task | None |
| get | task_id | Task | TaskNotFoundException |
| get_all | None | list[Task] | None |
| update | task_id, **updates | Task | TaskNotFoundException |
| delete | task_id | None | TaskNotFoundException |
| exists | task_id | bool | None |

## Assumptions

- Python 3.7+ dictionary ordering is guaranteed (insertion order preserved).
- All storage operations happen in a single-threaded context (no concurrency concerns in Phase I).
- Task IDs are always valid UUIDs (validation happens at model layer).
- The storage instance lives for the duration of the application session.

## Testing Strategy

1. **CRUD Tests**: Test each operation (add, get, update, delete) independently.
2. **Order Tests**: Verify insertion order is preserved across multiple operations.
3. **Exception Tests**: Verify TaskNotFoundException is raised appropriately.
4. **ID Handling Tests**: Test both string and UUID inputs for all operations.
5. **Empty State Tests**: Test behavior with empty storage.
6. **Multiple Task Tests**: Test operations with many tasks in storage.

---

**Constitution Compliance**: This specification adheres to Constitution Principles I (Layered Architecture - storage depends only on models), IV (Explicit Dependency Injection - storage can be injected into services), and VI (Error Handling Strategy - custom exception for missing tasks).
