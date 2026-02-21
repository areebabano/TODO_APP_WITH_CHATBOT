# Feature Specification: Task Data Model

**Spec ID**: SPEC-002
**Feature Branch**: `001-task-cli-app`
**Created**: 2025-12-28
**Status**: Approved
**Priority**: P0
**Dependencies**: SPEC-001 (Project Setup and Structure)

## Overview

Define the core Task domain model as a Python dataclass with comprehensive validation, serialization capabilities, and status management methods. This model represents the heart of the task management system and must be pure, validated, and self-documenting.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a Valid Task (Priority: P1)

As a user, I want to create a task with a title and optional description so that I can track my work items.

**Why this priority**: Task creation is the fundamental operation of the entire application. Without a valid task model, no other functionality can exist.

**Independent Test**: Create a Task instance with a title, verify all fields are populated correctly, and confirm UUID and timestamps are auto-generated.

**Acceptance Scenarios**:

1. **Given** a valid title "Buy groceries", **When** a Task is created, **Then** the task has the provided title, auto-generated UUID, "incomplete" status, and current timestamp for created_at.

2. **Given** a title and description "Buy groceries" with "Milk, bread, eggs", **When** a Task is created, **Then** both title and description are stored and accessible.

3. **Given** only whitespace title "   ", **When** a Task is created, **Then** a validation error is raised indicating title cannot be empty.

---

### User Story 2 - Complete and Uncomplete Tasks (Priority: P1)

As a user, I want to mark tasks as complete and revert them to incomplete so that I can track my progress.

**Why this priority**: Status transitions are core to task management functionality.

**Independent Test**: Create a task, mark it complete, verify status and completed_at timestamp, then mark incomplete and verify status reverts.

**Acceptance Scenarios**:

1. **Given** a task with status "incomplete", **When** mark_complete() is called, **Then** status becomes "complete", completed_at is set to current time, and updated_at is refreshed.

2. **Given** a task with status "complete", **When** mark_incomplete() is called, **Then** status becomes "incomplete", completed_at is cleared (None), and updated_at is refreshed.

3. **Given** a task already marked complete, **When** mark_complete() is called again, **Then** completed_at timestamp is updated to current time.

---

### User Story 3 - Update Task Details (Priority: P2)

As a user, I want to update the title and description of existing tasks so that I can correct or enhance my task information.

**Why this priority**: Updating tasks is important but secondary to creation and status management.

**Independent Test**: Create a task, call update() with new values, verify fields changed and updated_at timestamp refreshed.

**Acceptance Scenarios**:

1. **Given** a task with title "Buy groceries", **When** update(title="Buy food") is called, **Then** the title changes to "Buy food" and updated_at is refreshed.

2. **Given** a task with no description, **When** update(description="Shopping list") is called, **Then** description is set and updated_at is refreshed.

3. **Given** a task with existing description, **When** update(description=None) is called, **Then** description is cleared and updated_at is refreshed.

4. **Given** a task, **When** update(title="  ") is called with whitespace-only title, **Then** a validation error is raised.

---

### User Story 4 - Serialize and Deserialize Tasks (Priority: P2)

As a developer, I want tasks to convert to/from dictionaries so that I can persist and restore task data.

**Why this priority**: Serialization enables storage and API responses in future phases.

**Independent Test**: Create a task, convert to dict, recreate from dict, verify all fields match exactly.

**Acceptance Scenarios**:

1. **Given** a task with all fields populated, **When** to_dict() is called, **Then** a dictionary is returned with all fields as serializable values (UUID as string, datetime as ISO format string).

2. **Given** a valid dictionary from to_dict(), **When** from_dict() is called, **Then** a Task instance is created with identical values to the original.

3. **Given** a dictionary missing required fields, **When** from_dict() is called, **Then** an appropriate error is raised.

---

### Edge Cases

- What happens when title exceeds 100 characters? Validation error is raised with clear message.
- What happens when description exceeds 500 characters? Validation error is raised with clear message.
- What happens when title is empty string after stripping? Validation error is raised.
- What happens when creating task with explicit UUID? The provided UUID is used (for deserialization support).
- What happens with Unicode characters in title/description? They are accepted and stored correctly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Task MUST be implemented as a Python dataclass with field definitions for all required attributes.

- **FR-002**: Task MUST have an `id` field of type UUID that is auto-generated using uuid4() if not provided.

- **FR-003**: Task MUST have a `title` field of type str that is required, non-empty after stripping whitespace, and limited to 1-100 characters.

- **FR-004**: Task MUST have a `description` field of type Optional[str] that defaults to None, is stripped of whitespace when provided, and limited to 0-500 characters.

- **FR-005**: Task MUST have a `status` field that accepts only "incomplete" or "complete" values, defaulting to "incomplete".

- **FR-006**: Task MUST have a `created_at` field of type datetime that is auto-generated on creation.

- **FR-007**: Task MUST have an `updated_at` field of type datetime that is auto-generated on creation and updated whenever any field changes.

- **FR-008**: Task MUST have a `completed_at` field of type Optional[datetime] that is None when status is "incomplete" and set to current timestamp when status becomes "complete".

- **FR-009**: Task MUST implement `__post_init__` validation that strips whitespace from title and description, validates length constraints, and raises ValueError with descriptive messages for invalid data.

- **FR-010**: Task MUST implement `mark_complete()` method that sets status to "complete", sets completed_at to current time, and updates updated_at.

- **FR-011**: Task MUST implement `mark_incomplete()` method that sets status to "incomplete", clears completed_at to None, and updates updated_at.

- **FR-012**: Task MUST implement `update(title: Optional[str], description: Optional[str])` method that updates provided fields, validates new values, and refreshes updated_at.

- **FR-013**: Task MUST implement `to_dict()` method that returns a dictionary with all fields serialized to JSON-compatible types (UUID as string, datetime as ISO 8601 string).

- **FR-014**: Task MUST implement `from_dict(data: dict)` class method that creates a Task instance from a dictionary, parsing string values back to appropriate types.

### Key Entities

- **Task**: The core domain entity representing a work item to be tracked.
  - `id`: UUID - Unique identifier
  - `title`: str - Brief description of the task (1-100 chars)
  - `description`: Optional[str] - Detailed description (0-500 chars)
  - `status`: str - "incomplete" or "complete"
  - `created_at`: datetime - When the task was created
  - `updated_at`: datetime - When the task was last modified
  - `completed_at`: Optional[datetime] - When the task was completed (None if incomplete)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All Task operations (creation, update, status change, serialization) complete in under 1 millisecond.

- **SC-002**: 100% of invalid inputs (empty title, oversized fields) produce clear, actionable error messages.

- **SC-003**: Round-trip serialization (to_dict -> from_dict) preserves all field values exactly.

- **SC-004**: Task instances with Unicode titles and descriptions function correctly.

- **SC-005**: All datetime fields use consistent timezone handling (naive UTC or aware UTC).

## Technical Context

### File Location

`src/chief_of_staff/models/task.py`

### Class Structure

```python
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4


@dataclass
class Task:
    """Domain model for a task item.

    Attributes:
        title: Brief description of the task (1-100 chars, required).
        description: Detailed description (0-500 chars, optional).
        id: Unique identifier (auto-generated UUID).
        status: Task status ("incomplete" or "complete").
        created_at: Timestamp of task creation.
        updated_at: Timestamp of last modification.
        completed_at: Timestamp when task was completed (None if incomplete).
    """
    title: str
    description: Optional[str] = None
    id: UUID = field(default_factory=uuid4)
    status: str = "incomplete"
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    completed_at: Optional[datetime] = None

    def __post_init__(self) -> None:
        """Validate and normalize task fields."""
        # Validation implementation

    def mark_complete(self) -> None:
        """Mark the task as complete."""
        # Implementation

    def mark_incomplete(self) -> None:
        """Mark the task as incomplete."""
        # Implementation

    def update(
        self,
        title: Optional[str] = None,
        description: Optional[str] = None
    ) -> None:
        """Update task fields."""
        # Implementation

    def to_dict(self) -> dict:
        """Serialize task to dictionary."""
        # Implementation

    @classmethod
    def from_dict(cls, data: dict) -> "Task":
        """Create task from dictionary."""
        # Implementation
```

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| title | Non-empty after strip | "Title cannot be empty" |
| title | 1-100 characters | "Title must be between 1 and 100 characters" |
| description | 0-500 characters | "Description must not exceed 500 characters" |
| status | "incomplete" or "complete" | "Status must be 'incomplete' or 'complete'" |

## Assumptions

- All datetime values use the local timezone (datetime.now()) as per Python defaults.
- UUID version 4 provides sufficient uniqueness for the application's scale.
- The Task model is immutable from external perspectives (modifications through defined methods only).
- Serialization format matches what future storage layers will expect.

## Testing Strategy

1. **Construction Tests**: Verify task creation with various valid and invalid inputs.
2. **Validation Tests**: Test all validation rules with boundary values.
3. **Method Tests**: Test mark_complete(), mark_incomplete(), update() for correct behavior.
4. **Serialization Tests**: Test to_dict() and from_dict() round-trip accuracy.
5. **Edge Case Tests**: Unicode handling, whitespace normalization, timestamp behavior.

---

**Constitution Compliance**: This specification adheres to Constitution Principles II (Domain-Driven Design), V (Type Safety and Documentation), and VI (Error Handling Strategy).
