# Feature Specification: Task Service Business Logic

**Spec ID**: SPEC-004
**Feature Branch**: `001-task-cli-app`
**Created**: 2025-12-28
**Status**: Approved
**Priority**: P0
**Dependencies**: SPEC-001 (Project Setup), SPEC-002 (Task Data Model), SPEC-003 (In-Memory Storage)

## Overview

Implement the TaskService class that encapsulates all business logic for task management. This service layer sits between the CLI/API layer and the storage layer, enforcing business rules, validating inputs, and orchestrating operations. The service uses dependency injection to receive its storage backend, enabling easy testing and future storage swapping.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create New Tasks (Priority: P1)

As a user, I want to create tasks with a title and optional description so that I can track my work items.

**Why this priority**: Task creation is the entry point for all task management. Without it, the application has no purpose.

**Independent Test**: Call create_task() with valid inputs, verify a Task is returned with all fields correctly populated and stored.

**Acceptance Scenarios**:

1. **Given** valid title "Buy groceries", **When** create_task(title) is called, **Then** a Task is created, stored, and returned with generated ID and timestamps.

2. **Given** title "Buy groceries" and description "Milk, eggs", **When** create_task(title, description) is called, **Then** a Task is created with both fields populated.

3. **Given** empty or whitespace-only title, **When** create_task(title) is called, **Then** ValidationError is raised with message "Title cannot be empty".

4. **Given** title exceeding 100 characters, **When** create_task(title) is called, **Then** ValidationError is raised with clear message about length limit.

---

### User Story 2 - List All Tasks (Priority: P1)

As a user, I want to see all my tasks so that I can review what needs to be done.

**Why this priority**: Viewing tasks is essential for task management - users need visibility into their task list.

**Independent Test**: Create multiple tasks, call list_tasks(), verify all tasks returned sorted by creation date (oldest first).

**Acceptance Scenarios**:

1. **Given** three tasks created at different times, **When** list_tasks() is called, **Then** tasks are returned sorted by created_at (oldest first).

2. **Given** no tasks exist, **When** list_tasks() is called, **Then** an empty list is returned.

3. **Given** a mix of complete and incomplete tasks, **When** list_tasks() is called, **Then** all tasks are returned regardless of status.

---

### User Story 3 - Get Single Task (Priority: P2)

As a user, I want to retrieve a specific task by ID so that I can view its details or work with it.

**Why this priority**: Required for update, delete, and status operations to identify the target task.

**Independent Test**: Create a task, retrieve it by ID, verify all fields match.

**Acceptance Scenarios**:

1. **Given** a task with known ID, **When** get_task(task_id) is called, **Then** the complete Task object is returned.

2. **Given** an invalid task ID, **When** get_task(task_id) is called, **Then** TaskNotFoundError is raised with the ID in the message.

---

### User Story 4 - Update Task Details (Priority: P2)

As a user, I want to update task title and description so that I can correct or enhance task information.

**Why this priority**: Users frequently need to modify task details after creation.

**Independent Test**: Create a task, update its title, verify the change persists and updated_at is refreshed.

**Acceptance Scenarios**:

1. **Given** a stored task, **When** update_task(task_id, title="New Title") is called, **Then** the task's title is updated and returned.

2. **Given** a stored task, **When** update_task(task_id, description="New Desc") is called, **Then** the task's description is updated.

3. **Given** a stored task, **When** update_task(task_id, title=None, description=None) is called, **Then** no changes are made but updated_at is NOT refreshed.

4. **Given** an invalid task ID, **When** update_task() is called, **Then** TaskNotFoundError is raised.

5. **Given** a valid task ID but empty new title, **When** update_task(task_id, title="") is called, **Then** ValidationError is raised.

---

### User Story 5 - Delete Tasks (Priority: P2)

As a user, I want to delete tasks I no longer need so that my task list stays clean.

**Why this priority**: Cleanup functionality is important for maintaining a useful task list.

**Independent Test**: Create a task, delete it, verify it no longer appears in list_tasks().

**Acceptance Scenarios**:

1. **Given** a stored task with known ID, **When** delete_task(task_id) is called, **Then** the task is removed from storage.

2. **Given** an invalid task ID, **When** delete_task(task_id) is called, **Then** TaskNotFoundError is raised.

3. **Given** a deleted task ID, **When** get_task() is called with that ID, **Then** TaskNotFoundError is raised.

---

### User Story 6 - Complete and Uncomplete Tasks (Priority: P1)

As a user, I want to mark tasks as complete or incomplete so that I can track my progress.

**Why this priority**: Status tracking is a core feature of any task management system.

**Independent Test**: Create a task, mark complete, verify status and completed_at, then mark incomplete and verify reversion.

**Acceptance Scenarios**:

1. **Given** an incomplete task, **When** complete_task(task_id) is called, **Then** the task status becomes "complete" and completed_at is set.

2. **Given** a complete task, **When** uncomplete_task(task_id) is called, **Then** the task status becomes "incomplete" and completed_at is cleared.

3. **Given** an invalid task ID, **When** complete_task() or uncomplete_task() is called, **Then** TaskNotFoundError is raised.

4. **Given** an already complete task, **When** complete_task() is called again, **Then** completed_at is updated to current time.

---

### Edge Cases

- What happens when creating task with description but no title? ValidationError for missing title.
- What happens when updating to empty description? Description is cleared (set to None).
- What happens when completing an already incomplete task? No error, status confirmed as complete.
- What happens with Unicode characters in inputs? Accepted and processed correctly.
- What happens with very long descriptions within limit? Accepted and stored correctly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: TaskService MUST receive storage as a constructor dependency (dependency injection).

- **FR-002**: TaskService MUST implement `create_task(title: str, description: Optional[str] = None) -> Task` that validates inputs, creates a Task, stores it, and returns it.

- **FR-003**: TaskService MUST implement `list_tasks() -> list[Task]` that returns all tasks sorted by created_at ascending (oldest first).

- **FR-004**: TaskService MUST implement `get_task(task_id: str | UUID) -> Task` that retrieves a task or raises TaskNotFoundError.

- **FR-005**: TaskService MUST implement `update_task(task_id: str | UUID, title: Optional[str] = None, description: Optional[str] = None) -> Task` that updates specified fields and returns the modified task.

- **FR-006**: TaskService MUST implement `delete_task(task_id: str | UUID) -> None` that removes a task or raises TaskNotFoundError.

- **FR-007**: TaskService MUST implement `complete_task(task_id: str | UUID) -> Task` that marks a task complete and returns it.

- **FR-008**: TaskService MUST implement `uncomplete_task(task_id: str | UUID) -> Task` that marks a task incomplete and returns it.

- **FR-009**: TaskService MUST validate title is non-empty and within 1-100 character limit before creating or updating.

- **FR-010**: TaskService MUST validate description is within 0-500 character limit if provided.

- **FR-011**: ValidationError MUST be a custom exception with a descriptive message for the specific validation failure.

- **FR-012**: TaskNotFoundError MUST be a service-layer exception that wraps storage layer TaskNotFoundException.

### Key Entities

- **TaskService**: Business logic service for task management.
  - Dependency: Storage backend (MemoryStore or compatible interface)
  - Methods: create_task, list_tasks, get_task, update_task, delete_task, complete_task, uncomplete_task

- **ValidationError**: Custom exception for input validation failures.
  - Contains: Descriptive error message

- **TaskNotFoundError**: Service-layer exception for missing tasks.
  - Contains: task_id that was not found

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All service operations complete in under 10 milliseconds for typical usage scenarios.

- **SC-002**: 100% of invalid inputs produce clear, actionable error messages via ValidationError.

- **SC-003**: Task list is always returned in chronological order (oldest first) regardless of modification order.

- **SC-004**: Service correctly delegates to storage layer without duplicating storage logic.

- **SC-005**: All exceptions include sufficient context for debugging (task ID, validation reason).

## Technical Context

### File Locations

- `src/chief_of_staff/services/task_service.py` - TaskService class
- `src/chief_of_staff/services/exceptions.py` - ValidationError, TaskNotFoundError
- `src/chief_of_staff/services/__init__.py` - Export public interfaces

### Class Structure

```python
# exceptions.py
class ValidationError(Exception):
    """Raised when input validation fails."""
    pass


class TaskNotFoundError(Exception):
    """Raised when a task cannot be found."""

    def __init__(self, task_id: str) -> None:
        self.task_id = task_id
        super().__init__(f"Task not found: {task_id}")


# task_service.py
from typing import Optional
from uuid import UUID

from chief_of_staff.models.task import Task
from chief_of_staff.storage.memory_store import MemoryStore
from chief_of_staff.storage.exceptions import TaskNotFoundException
from chief_of_staff.services.exceptions import ValidationError, TaskNotFoundError


class TaskService:
    """Business logic service for task management."""

    def __init__(self, storage: MemoryStore) -> None:
        """Initialize service with storage backend."""
        self._storage = storage

    def create_task(
        self,
        title: str,
        description: Optional[str] = None
    ) -> Task:
        """Create and store a new task."""
        # Validation and implementation

    def list_tasks(self) -> list[Task]:
        """List all tasks sorted by creation date."""
        # Implementation

    def get_task(self, task_id: str | UUID) -> Task:
        """Retrieve a task by ID."""
        # Implementation with exception translation

    def update_task(
        self,
        task_id: str | UUID,
        title: Optional[str] = None,
        description: Optional[str] = None
    ) -> Task:
        """Update a task's fields."""
        # Validation and implementation

    def delete_task(self, task_id: str | UUID) -> None:
        """Delete a task."""
        # Implementation with exception translation

    def complete_task(self, task_id: str | UUID) -> Task:
        """Mark a task as complete."""
        # Implementation

    def uncomplete_task(self, task_id: str | UUID) -> Task:
        """Mark a task as incomplete."""
        # Implementation
```

### Service Operations

| Operation | Input | Output | Errors |
|-----------|-------|--------|--------|
| create_task | title, description? | Task | ValidationError |
| list_tasks | None | list[Task] | None |
| get_task | task_id | Task | TaskNotFoundError |
| update_task | task_id, title?, description? | Task | ValidationError, TaskNotFoundError |
| delete_task | task_id | None | TaskNotFoundError |
| complete_task | task_id | Task | TaskNotFoundError |
| uncomplete_task | task_id | Task | TaskNotFoundError |

## Assumptions

- Storage layer is injected and ready to use at service construction time.
- Storage layer handles its own data persistence (service doesn't manage storage lifecycle).
- Validation rules (character limits) are consistent with Task model constraints.
- Sorting is performed in-memory since the task list is expected to be small in Phase I.

## Testing Strategy

1. **Unit Tests with Mock Storage**: Test service logic with mock storage to isolate business rules.
2. **Integration Tests**: Test service with real MemoryStore to verify full stack.
3. **Validation Tests**: Test all validation rules with boundary values.
4. **Exception Tests**: Verify correct exceptions are raised and contain useful information.
5. **Sorting Tests**: Verify list_tasks() returns tasks in correct chronological order.
6. **State Transition Tests**: Test complete/uncomplete cycles.

---

**Constitution Compliance**: This specification adheres to Constitution Principles I (Layered Architecture - service depends on storage/models, not CLI), IV (Explicit Dependency Injection), and VI (Error Handling Strategy - service-layer exceptions wrap storage exceptions).
