# Data Model: Task CLI Application

**Feature Branch**: `001-task-cli-app`
**Created**: 2025-12-28
**Status**: Complete

## Overview

This document defines the data model for the Smart Personal Chief of Staff CLI application. The model follows domain-driven design principles with a single core entity (Task) and supporting value objects.

---

## Entity Definitions

### Task Entity

The central domain entity representing a work item to be tracked.

```
Entity: Task
Location: src/chief_of_staff/models/task.py
```

#### Fields

| Field | Type | Required | Default | Constraints |
|-------|------|----------|---------|-------------|
| id | UUID | Yes | uuid4() | Auto-generated, immutable |
| title | str | Yes | - | 1-100 characters, non-empty after strip |
| description | Optional[str] | No | None | 0-500 characters if provided |
| status | str | Yes | "incomplete" | Enum: "incomplete" or "complete" |
| created_at | datetime | Yes | datetime.now() | Auto-generated, immutable |
| updated_at | datetime | Yes | datetime.now() | Updated on any modification |
| completed_at | Optional[datetime] | No | None | Set when status becomes "complete" |

#### Field Details

**id (UUID)**
- Type: `uuid.UUID`
- Generated using `uuid4()` for guaranteed uniqueness
- Immutable after creation
- Used as primary identifier throughout the system
- Displayed as first 8 characters in CLI output

**title (str)**
- Type: `str`
- Required, cannot be None
- Whitespace stripped on input
- Length: 1-100 characters (after strip)
- Validation error if empty or exceeds limit

**description (Optional[str])**
- Type: `Optional[str]`
- Defaults to None
- Whitespace stripped if provided
- Length: 0-500 characters
- Can be set to None to clear description

**status (str)**
- Type: `str` (effectively an enum)
- Valid values: "incomplete", "complete"
- Defaults to "incomplete"
- Changed via mark_complete() and mark_incomplete() methods

**created_at (datetime)**
- Type: `datetime.datetime`
- Auto-generated on task creation
- Immutable after creation
- Used for sorting in list display (oldest first)

**updated_at (datetime)**
- Type: `datetime.datetime`
- Auto-generated on task creation
- Updated whenever any field changes
- Updated by mark_complete(), mark_incomplete(), update()

**completed_at (Optional[datetime])**
- Type: `Optional[datetime.datetime]`
- None when status is "incomplete"
- Set to current time when status becomes "complete"
- Cleared to None when status becomes "incomplete"

---

## Validation Rules

### Title Validation

```
Rule: TITLE_NOT_EMPTY
Trigger: Task creation or update
Check: title.strip() != ""
Error: ValueError("Title cannot be empty")

Rule: TITLE_LENGTH
Trigger: Task creation or update
Check: 1 <= len(title.strip()) <= 100
Error: ValueError("Title must be between 1 and 100 characters")
```

### Description Validation

```
Rule: DESCRIPTION_LENGTH
Trigger: Task creation or update (when description provided)
Check: len(description.strip()) <= 500
Error: ValueError("Description must not exceed 500 characters")
```

### Status Validation

```
Rule: STATUS_VALUES
Trigger: Task creation or manual status assignment
Check: status in ("incomplete", "complete")
Error: ValueError("Status must be 'incomplete' or 'complete'")
```

---

## State Transitions

### Task Status State Machine

```
                    mark_complete()
    ┌──────────────────────────────────────┐
    │                                      │
    ▼                                      │
┌──────────┐                         ┌──────────┐
│incomplete│ ──────────────────────► │ complete │
└──────────┘     mark_complete()     └──────────┘
    ▲                                      │
    │                                      │
    └──────────────────────────────────────┘
                  mark_incomplete()
```

**Transition: incomplete → complete**
- Method: `mark_complete()`
- Actions:
  1. Set status = "complete"
  2. Set completed_at = datetime.now()
  3. Set updated_at = datetime.now()

**Transition: complete → incomplete**
- Method: `mark_incomplete()`
- Actions:
  1. Set status = "incomplete"
  2. Set completed_at = None
  3. Set updated_at = datetime.now()

**Idempotent Behavior**
- Calling mark_complete() on a complete task updates completed_at
- Calling mark_incomplete() on an incomplete task is a no-op (but updates updated_at)

---

## Methods

### Instance Methods

**mark_complete() -> None**
- Sets status to "complete"
- Sets completed_at to current time
- Updates updated_at

**mark_incomplete() -> None**
- Sets status to "incomplete"
- Clears completed_at to None
- Updates updated_at

**update(title: Optional[str] = None, description: Optional[str] = None) -> None**
- Updates provided fields only
- Validates new values before applying
- Updates updated_at only if changes made
- Raises ValueError for invalid inputs

**to_dict() -> dict**
- Serializes task to dictionary
- UUID converted to string
- Datetime converted to ISO 8601 string
- None values preserved as None

**from_dict(data: dict) -> Task (classmethod)**
- Deserializes dictionary to Task instance
- Parses string UUIDs to UUID objects
- Parses ISO 8601 strings to datetime objects
- Validates all fields on construction

---

## Serialization Format

### to_dict() Output

```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Buy groceries",
    "description": "Milk, bread, eggs",
    "status": "incomplete",
    "created_at": "2025-12-28T10:30:00",
    "updated_at": "2025-12-28T10:30:00",
    "completed_at": null
}
```

### from_dict() Input

Same format as to_dict() output. All datetime strings must be ISO 8601 format.

---

## Relationships

### Task-Storage Relationship

```
Task (Entity)
    │
    │ stored in
    ▼
MemoryStore (Repository)
    │
    │ keyed by
    ▼
task_id: str (UUID as string)
```

- MemoryStore holds Task instances in a dictionary
- Key is task.id converted to string
- Storage does not own Task lifecycle (no cascade deletes needed)
- One-to-many: Storage contains multiple Tasks

### Task-Service Relationship

```
TaskService (Service)
    │
    │ creates/manages
    ▼
Task (Entity)
    │
    │ persisted via
    ▼
MemoryStore (Repository)
```

- TaskService creates Task instances
- TaskService validates input before creating/updating
- TaskService delegates persistence to MemoryStore
- TaskService translates storage exceptions to service exceptions

---

## Exception Hierarchy

```
Exception
    │
    ├── ValueError (stdlib)
    │       Used for: Model validation errors
    │       Raised by: Task.__post_init__, Task.update()
    │
    ├── TaskNotFoundException (storage layer)
    │       Used for: Task not found in storage
    │       Raised by: MemoryStore.get(), update(), delete()
    │       Location: src/chief_of_staff/storage/exceptions.py
    │
    ├── ValidationError (service layer)
    │       Used for: Service-level input validation
    │       Raised by: TaskService.create_task(), update_task()
    │       Location: src/chief_of_staff/services/exceptions.py
    │
    └── TaskNotFoundError (service layer)
            Used for: Wrapping storage TaskNotFoundException
            Raised by: TaskService.get_task(), update_task(), etc.
            Location: src/chief_of_staff/services/exceptions.py
```

---

## Data Flow

### Create Task Flow

```
User Input (title, description)
    │
    ▼
CLI Layer (commands.py)
    │ validate basic input
    ▼
Service Layer (task_service.py)
    │ validate business rules
    │ create Task instance
    ▼
Model Layer (task.py)
    │ __post_init__ validation
    │ generate UUID, timestamps
    ▼
Service Layer
    │ call storage.add()
    ▼
Storage Layer (memory_store.py)
    │ store task in dict
    ▼
Return Task to CLI
    │
    ▼
Display success message
```

### List Tasks Flow

```
User Command (chief list)
    │
    ▼
CLI Layer (commands.py)
    │ call service.list_tasks()
    ▼
Service Layer (task_service.py)
    │ call storage.get_all()
    │ sort by created_at
    ▼
Storage Layer (memory_store.py)
    │ return list of tasks
    ▼
Service Layer
    │ return sorted list
    ▼
CLI Layer
    │ call display_tasks()
    ▼
Display Layer (display.py)
    │ render Rich table
    ▼
Terminal Output
```

---

## Implementation Notes

### Python Type Hints

```python
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

@dataclass
class Task:
    title: str
    description: Optional[str] = None
    id: UUID = field(default_factory=uuid4)
    status: str = "incomplete"
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    completed_at: Optional[datetime] = None
```

### Field Ordering Rationale

1. `title` first - only truly required field from user
2. `description` second - optional user input
3. `id` - auto-generated but user might provide for deserialization
4. `status` - has sensible default
5. `created_at`, `updated_at` - auto-generated timestamps
6. `completed_at` - derived from status changes

---

## Constitution Compliance

- **Principle II (Domain-Driven Design)**: Task is a pure domain model with no infrastructure concerns
- **Principle V (Type Safety)**: All fields have type hints
- **Principle VI (Error Handling)**: Clear validation errors at model boundary
- **Principle VIII (Simplicity)**: Minimal fields, no premature abstractions
