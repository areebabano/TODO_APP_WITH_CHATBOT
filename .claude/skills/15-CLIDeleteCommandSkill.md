# CLIDeleteCommandSkill.md

## Skill Name
`cli-delete-command-implementation`

## Purpose
Implement the `delete` CLI command for removing tasks from the system.

## Responsibilities
1. **Define Delete Command**
   - Create `@cli.command()` decorated function named `delete`
   - Add command docstring for `--help` output

2. **Define Arguments**
   - Add `task_id` as required positional argument
   - Configure help text explaining the operation

3. **Implement Command Logic**
   - Get TaskService via `get_service()`
   - Call `service.delete_task(task_id)`
   - Display success message confirming deletion
   - Handle TaskNotFoundError with error message

4. **Wire to Display Layer**
   - Use `success_message()` for successful deletion
   - Use `error_message()` for not found error

## Rules
1. **MUST** accept task_id as positional argument
2. **MUST** handle TaskNotFoundError gracefully
3. **MUST** show clear confirmation on success
4. **MUST NOT** prompt for confirmation (Phase 1 - keep simple)
5. **MUST NOT** raise unhandled exceptions
6. **MUST NOT** include any undo functionality

## Constraints
- Depends on CLIGroupSkill (cli group exists)
- Depends on TaskService and display functions
- File location: `cli/commands.py` (extend existing)
- Deletion is immediate and permanent

## When to Use / Trigger Conditions
- **Primary Trigger**: After CLIUpdateCommandSkill completes
- **User Request**: "Implement delete command", "Remove task CLI"
- **Prerequisite For**: Full CRUD CLI functionality
- **Never Use When**: Delete command already exists

## Validation Checklist
Before marking complete, verify:
- [ ] Command registered as `delete`
- [ ] task_id is required positional argument
- [ ] `--help` shows clear description
- [ ] Success message confirms deletion
- [ ] TaskNotFoundError shows user-friendly message
- [ ] No stack traces on error
- [ ] Task actually removed from storage

## Output Artifacts
- Updated `cli/commands.py` - Added delete command

## Code Pattern
```python
# Add to cli/commands.py:

@cli.command()
@click.argument("task_id")
def delete(task_id: str) -> None:
    """Delete a task.

    TASK_ID is the unique identifier of the task to delete.
    This action is permanent and cannot be undone.
    """
    service = get_service()
    try:
        service.delete_task(task_id)
        success_message(f"Deleted task: {task_id[:8]}")
    except TaskNotFoundError:
        error_message(f"Task not found: {task_id}")
```
