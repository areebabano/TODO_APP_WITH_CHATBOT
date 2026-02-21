# StorageExceptionsSkill.md

## Skill Name
`storage-exceptions-definition`

## Purpose
Define custom exception classes for the storage layer to provide clear, consistent error handling for task persistence operations.

## Responsibilities
1. **Define TaskNotFoundException**
   - Create exception class inheriting from `Exception`
   - Accept `task_id` parameter in constructor
   - Store `task_id` as instance attribute
   - Format descriptive error message including the task ID
   - Add comprehensive class docstring

2. **Export from Package**
   - Add exception to `storage/__init__.py` exports
   - Ensure importable as `from storage import TaskNotFoundException`

## Rules
1. **MUST** inherit from `Exception`, not `BaseException`
2. **MUST** include `task_id` in the exception message
3. **MUST** store `task_id` as accessible attribute
4. **MUST** have clear, user-readable error messages
5. **MUST** include class-level docstring explaining usage
6. **MUST NOT** import from models, services, or CLI layers
7. **MUST NOT** include any logging or side effects

## Constraints
- No external dependencies
- File location: `storage/exceptions.py`
- Must be defined before MemoryStore implementation
- Exception messages must be suitable for end-user display

## When to Use / Trigger Conditions
- **Primary Trigger**: After TaskSerializationSkill completes, before MemoryStore
- **User Request**: "Define storage exceptions", "Create TaskNotFoundException"
- **Prerequisite For**: MemoryStoreCRUDSkill
- **Never Use When**: Storage exceptions already exist and are correct

## Validation Checklist
Before marking complete, verify:
- [ ] TaskNotFoundException inherits from Exception
- [ ] Constructor accepts task_id parameter
- [ ] task_id is stored as instance attribute
- [ ] Error message includes the task_id value
- [ ] Has proper class docstring
- [ ] Exportable from storage package
- [ ] Can be raised and caught correctly

## Output Artifacts
- `storage/exceptions.py` - Exception class definitions
- Updated `storage/__init__.py` - Export TaskNotFoundException

## Code Pattern
```python
"""Storage layer exception classes."""


class TaskNotFoundException(Exception):
    """Raised when a task is not found in storage.

    Attributes:
        task_id: The ID of the task that was not found.
    """

    def __init__(self, task_id: str) -> None:
        """Initialize TaskNotFoundException.

        Args:
            task_id: The ID of the task that was not found.
        """
        self.task_id = task_id
        super().__init__(f"Task with ID '{task_id}' not found")
```
