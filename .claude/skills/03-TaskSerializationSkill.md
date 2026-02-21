# TaskSerializationSkill.md

## Skill Name
`task-serialization-implementation`

## Purpose
Add serialization and deserialization methods to the Task domain model, enabling conversion to/from dictionary format for persistence and API integration.

## Responsibilities
1. **Implement to_dict Method**
   - Create `to_dict(self) -> Dict[str, Any]` instance method
   - Convert `id` (UUID) to string format
   - Convert `created_at` and `updated_at` to ISO 8601 format
   - Convert `status` (TaskStatus) to its string value
   - Return dictionary suitable for JSON serialization

2. **Implement from_dict Class Method**
   - Create `@classmethod from_dict(cls, data: Dict[str, Any]) -> Task`
   - Parse `id` string back to UUID
   - Parse ISO 8601 datetime strings back to datetime objects
   - Parse status string back to TaskStatus enum
   - Validate required fields are present
   - Raise `ValueError` for invalid or missing data

3. **Ensure Round-Trip Integrity**
   - Verify `Task.from_dict(task.to_dict())` equals original task
   - Handle edge cases (None description, special characters in title)

## Rules
1. **MUST** produce JSON-serializable output from `to_dict()`
2. **MUST** validate input data in `from_dict()` before creating Task
3. **MUST** handle all field type conversions correctly
4. **MUST** maintain round-trip integrity (serialize then deserialize = original)
5. **MUST** include comprehensive docstrings with Args, Returns, Raises
6. **MUST NOT** use external serialization libraries
7. **MUST NOT** modify the existing Task fields or validation
8. **MUST** raise `ValueError` for malformed input data

## Constraints
- Only standard library dependencies
- Must not break existing Task functionality
- File location: `models/task.py` (extend existing)
- Methods must have full type hints

## When to Use / Trigger Conditions
- **Primary Trigger**: After TaskModelSkill completes successfully
- **User Request**: "Add serialization to Task", "Implement to_dict and from_dict"
- **Prerequisite For**: StorageSkill (MemoryStore needs dict conversion)
- **Never Use When**: Serialization methods already exist and work correctly

## Validation Checklist
Before marking complete, verify:
- [ ] `to_dict()` returns a dictionary
- [ ] All values in dict are JSON-serializable (str, int, float, bool, None, list, dict)
- [ ] `id` is converted to string
- [ ] Datetime fields are ISO 8601 formatted strings
- [ ] `status` is the enum's string value
- [ ] `from_dict()` correctly parses all fields
- [ ] `from_dict()` raises ValueError for missing required fields
- [ ] Round-trip: `Task.from_dict(task.to_dict())` works correctly
- [ ] Optional description field handled correctly (None case)

## Output Artifacts
- Updated `models/task.py` - Added to_dict and from_dict methods

## Code Pattern
```python
from typing import Any, Dict

# Add to Task class:

def to_dict(self) -> Dict[str, Any]:
    """Serialize task to dictionary.

    Returns:
        Dictionary representation suitable for JSON serialization.
    """
    return {
        "id": str(self.id),
        "title": self.title,
        "description": self.description,
        "status": self.status.value,
        "created_at": self.created_at.isoformat(),
        "updated_at": self.updated_at.isoformat(),
    }

@classmethod
def from_dict(cls, data: Dict[str, Any]) -> "Task":
    """Deserialize task from dictionary.

    Args:
        data: Dictionary containing task data.

    Returns:
        Task instance.

    Raises:
        ValueError: If required fields are missing or invalid.
        KeyError: If required keys are missing.
    """
    return cls(
        id=UUID(data["id"]),
        title=data["title"],
        description=data.get("description"),
        status=TaskStatus(data["status"]),
        created_at=datetime.fromisoformat(data["created_at"]),
        updated_at=datetime.fromisoformat(data["updated_at"]),
    )
```
