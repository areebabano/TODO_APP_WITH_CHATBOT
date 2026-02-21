# ServiceExceptionsSkill.md

## Skill Name
`service-exceptions-definition`

## Purpose
Define custom exception classes for the service layer to provide clear, user-facing error handling for business logic operations.

## Responsibilities
1. **Define ValidationError Exception**
   - Create exception class for input validation failures
   - Accept descriptive message parameter
   - Optionally accept field name for context
   - Add comprehensive class docstring

2. **Define TaskNotFoundError Exception**
   - Create exception wrapping storage-layer TaskNotFoundException
   - Accept `task_id` parameter
   - Store `task_id` as instance attribute
   - Provide user-friendly error message

3. **Export from Package**
   - Add exceptions to `services/__init__.py` exports
   - Ensure importable as `from services import ValidationError, TaskNotFoundError`

## Rules
1. **MUST** inherit from `Exception`, not `BaseException`
2. **MUST** have clear, user-facing error messages
3. **MUST** wrap storage exceptions - never expose storage layer directly
4. **MUST** include class-level docstrings explaining usage
5. **MUST NOT** import from storage layer in exception definitions
6. **MUST NOT** include logging or side effects in exception classes
7. **MUST** store relevant context as instance attributes

## Constraints
- No external dependencies
- No imports from storage, models, or CLI layers in exception file
- File location: `services/exceptions.py`
- Must be defined before TaskService implementation
- Messages must be suitable for CLI display to end users

## When to Use / Trigger Conditions
- **Primary Trigger**: After MemoryStoreCRUDSkill completes, before TaskService
- **User Request**: "Define service exceptions", "Create ValidationError"
- **Prerequisite For**: TaskServiceCoreSkill, TaskServiceStatusSkill
- **Never Use When**: Service exceptions already exist and are correct

## Validation Checklist
Before marking complete, verify:
- [ ] ValidationError accepts message parameter
- [ ] ValidationError has proper docstring
- [ ] TaskNotFoundError accepts task_id parameter
- [ ] TaskNotFoundError stores task_id as attribute
- [ ] TaskNotFoundError has user-friendly message
- [ ] Both exceptions inherit from Exception
- [ ] Both exportable from services package
- [ ] Can be raised and caught correctly

## Output Artifacts
- `services/exceptions.py` - Exception class definitions
- Updated `services/__init__.py` - Export ValidationError, TaskNotFoundError

## Code Pattern
```python
"""Service layer exception classes."""


class ValidationError(Exception):
    """Raised when input validation fails.

    Attributes:
        message: Description of the validation failure.
        field: Optional name of the field that failed validation.
    """

    def __init__(self, message: str, field: str | None = None) -> None:
        """Initialize ValidationError.

        Args:
            message: Description of the validation failure.
            field: Optional name of the field that failed validation.
        """
        self.message = message
        self.field = field
        super().__init__(message)


class TaskNotFoundError(Exception):
    """Raised when a requested task does not exist.

    Attributes:
        task_id: The ID of the task that was not found.
    """

    def __init__(self, task_id: str) -> None:
        """Initialize TaskNotFoundError.

        Args:
            task_id: The ID of the task that was not found.
        """
        self.task_id = task_id
        super().__init__(f"Task '{task_id}' not found")
```
