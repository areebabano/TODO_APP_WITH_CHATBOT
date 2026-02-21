# TaskModelSkill.md

## Skill Name
`task-model-implementation`

## Purpose
Implement the core Task domain model as a Python dataclass with all required fields, type hints, validation logic, and status transition methods for the Smart Personal Chief of Staff application.

## Responsibilities
1. **Define TaskStatus Enumeration**
   - Create `TaskStatus` enum with `PENDING` and `COMPLETED` values
   - Use string values for JSON serialization compatibility
   - Add docstrings describing each status

2. **Implement Task Dataclass**
   - Define `@dataclass` decorator on Task class
   - Implement `id` field as UUID with `default_factory=uuid4`
   - Implement `title` field as str (required)
   - Implement `description` field as Optional[str]
   - Implement `status` field as TaskStatus with default PENDING
   - Implement `created_at` field as datetime with `default_factory=datetime.now`
   - Implement `updated_at` field as datetime with `default_factory=datetime.now`

3. **Implement Validation**
   - Create `__post_init__` method for field validation
   - Validate `title` is non-empty and not whitespace-only
   - Strip whitespace from title
   - Raise `ValueError` with descriptive message on validation failure

4. **Implement Status Transition Methods**
   - Create `mark_complete(self) -> None` method
   - Create `mark_incomplete(self) -> None` method
   - Update `updated_at` timestamp on status change

## Rules
1. **MUST** use `from __future__ import annotations` for forward references
2. **MUST** have full type hints on all fields and methods
3. **MUST** use only stdlib imports (dataclasses, datetime, uuid, typing, enum)
4. **MUST** raise `ValueError` for validation failures with field name in message
5. **MUST NOT** import from storage, services, or CLI layers
6. **MUST NOT** include any infrastructure or persistence logic
7. **MUST** include comprehensive docstrings (Google style)
8. **MUST** follow PEP8 conventions

## Constraints
- Only standard library dependencies allowed
- No coupling to infrastructure or persistence
- Validation must fail fast and loud (no silent fixes)
- File location: `models/task.py`
- Must be importable as `from models import Task, TaskStatus`

## When to Use / Trigger Conditions
- **Primary Trigger**: After ProjectFoundationSkill completes successfully
- **User Request**: "Implement the Task model", "Create the domain model"
- **Prerequisite For**: TaskSerializationSkill, all storage and service skills
- **Never Use When**: Task model already exists and passes validation

## Validation Checklist
Before marking complete, verify:
- [ ] TaskStatus enum has PENDING and COMPLETED values
- [ ] Task dataclass has all 6 required fields
- [ ] All fields have correct type hints
- [ ] `__post_init__` validates title is non-empty
- [ ] `mark_complete()` sets status to COMPLETED
- [ ] `mark_incomplete()` sets status to PENDING
- [ ] Status changes update `updated_at` timestamp
- [ ] Can instantiate Task with valid data
- [ ] Raises ValueError for empty title
- [ ] Importable from models package

## Output Artifacts
- `models/task.py` - Task domain model implementation
- Updated `models/__init__.py` - Export Task and TaskStatus

## Code Pattern
```python
from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID, uuid4


class TaskStatus(Enum):
    """Enumeration of possible task statuses."""
    PENDING = "pending"
    COMPLETED = "completed"


@dataclass
class Task:
    """Domain model representing a task."""
    title: str
    description: Optional[str] = None
    id: UUID = field(default_factory=uuid4)
    status: TaskStatus = TaskStatus.PENDING
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)

    def __post_init__(self) -> None:
        """Validate fields after initialization."""
        if not self.title or not self.title.strip():
            raise ValueError("title cannot be empty")
        self.title = self.title.strip()
```
