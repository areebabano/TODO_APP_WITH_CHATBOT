# TaskServiceStatusSkill.md

## Skill Name
`task-service-status-implementation`

## Purpose
Add status transition methods (complete/incomplete) to TaskService for marking tasks as completed or pending.

## Responsibilities
1. **Implement Complete Task Method**
   - Create `complete_task(self, task_id: str) -> Task`
   - Retrieve task by ID
   - Call `task.mark_complete()` to change status
   - Update task in storage
   - Return updated Task object

2. **Implement Incomplete Task Method**
   - Create `incomplete_task(self, task_id: str) -> Task`
   - Retrieve task by ID
   - Call `task.mark_incomplete()` to change status
   - Update task in storage
   - Return updated Task object

3. **Handle Errors Consistently**
   - Wrap `TaskNotFoundException` as `TaskNotFoundError`
   - Maintain consistent exception handling pattern

## Rules
1. **MUST** use Task's `mark_complete()` / `mark_incomplete()` methods
2. **MUST** update storage after status change
3. **MUST** return the updated Task object
4. **MUST** wrap storage exceptions as service exceptions
5. **MUST** have full type hints
6. **MUST** include docstrings with Args, Returns, Raises
7. **MUST** be idempotent (completing already-complete task is OK)
8. **MUST NOT** add additional validation beyond task existence

## Constraints
- Depends on TaskService core being implemented
- Depends on Task having mark_complete/mark_incomplete methods
- File location: `services/task_service.py` (extend existing)
- Methods added to existing TaskService class

## When to Use / Trigger Conditions
- **Primary Trigger**: After TaskServiceCoreSkill completes
- **User Request**: "Add complete/incomplete methods", "Implement status changes"
- **Prerequisite For**: CLICompleteCommandSkill, CLIIncompleteCommandSkill
- **Never Use When**: Status methods already exist in TaskService

## Validation Checklist
Before marking complete, verify:
- [ ] `complete_task()` changes status to COMPLETED
- [ ] `complete_task()` updates storage
- [ ] `complete_task()` returns updated Task
- [ ] `complete_task()` raises TaskNotFoundError for missing task
- [ ] `incomplete_task()` changes status to PENDING
- [ ] `incomplete_task()` updates storage
- [ ] `incomplete_task()` returns updated Task
- [ ] `incomplete_task()` raises TaskNotFoundError for missing task
- [ ] Both methods are idempotent
- [ ] Both methods have proper type hints
- [ ] Both methods have docstrings

## Output Artifacts
- Updated `services/task_service.py` - Added complete_task and incomplete_task methods

## Code Pattern
```python
# Add to TaskService class:

def complete_task(self, task_id: str) -> Task:
    """Mark a task as completed.

    Args:
        task_id: The unique identifier of the task to complete.

    Returns:
        The updated Task instance with COMPLETED status.

    Raises:
        TaskNotFoundError: If task does not exist.
    """
    task = self.get_task(task_id)
    task.mark_complete()
    self._storage.update(task_id, task)
    return task

def incomplete_task(self, task_id: str) -> Task:
    """Mark a task as incomplete (pending).

    Args:
        task_id: The unique identifier of the task to mark incomplete.

    Returns:
        The updated Task instance with PENDING status.

    Raises:
        TaskNotFoundError: If task does not exist.
    """
    task = self.get_task(task_id)
    task.mark_incomplete()
    self._storage.update(task_id, task)
    return task
```
