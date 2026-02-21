# CLIStatusCommandsSkill.md

## Skill Name
`cli-status-commands-implementation`

## Purpose
Implement the `complete` and `incomplete` CLI commands for changing task status.

## Responsibilities
1. **Define Complete Command**
   - Create `@cli.command()` decorated function named `complete`
   - Accept `task_id` as required positional argument
   - Call `service.complete_task(task_id)`
   - Display success with task title

2. **Define Incomplete Command**
   - Create `@cli.command()` decorated function named `incomplete`
   - Accept `task_id` as required positional argument
   - Call `service.incomplete_task(task_id)`
   - Display success with task title

3. **Handle Errors**
   - Handle TaskNotFoundError with user-friendly message
   - Use display functions for output

## Rules
1. **MUST** accept task_id as positional argument for both commands
2. **MUST** handle TaskNotFoundError gracefully for both
3. **MUST** show task title in success message
4. **MUST** be idempotent (re-completing is OK)
5. **MUST NOT** raise unhandled exceptions
6. **MUST NOT** include additional confirmation prompts

## Constraints
- Depends on CLIGroupSkill (cli group exists)
- Depends on TaskService status methods and display functions
- File location: `cli/commands.py` (extend existing)
- Both commands follow same pattern

## When to Use / Trigger Conditions
- **Primary Trigger**: After CLIDeleteCommandSkill completes
- **User Request**: "Implement complete command", "Add status change CLI"
- **Prerequisite For**: Full CLI functionality
- **Never Use When**: Status commands already exist

## Validation Checklist
Before marking complete, verify:
- [ ] `complete` command registered
- [ ] `incomplete` command registered
- [ ] Both accept task_id as positional argument
- [ ] Both show `--help` with clear description
- [ ] Both show task title in success message
- [ ] Both handle TaskNotFoundError gracefully
- [ ] Completing completed task works (idempotent)
- [ ] No stack traces on error

## Output Artifacts
- Updated `cli/commands.py` - Added complete and incomplete commands

## Code Pattern
```python
# Add to cli/commands.py:

@cli.command()
@click.argument("task_id")
def complete(task_id: str) -> None:
    """Mark a task as completed.

    TASK_ID is the unique identifier of the task to complete.
    """
    service = get_service()
    try:
        task = service.complete_task(task_id)
        success_message(f"Completed: {task.title}")
    except TaskNotFoundError:
        error_message(f"Task not found: {task_id}")


@cli.command()
@click.argument("task_id")
def incomplete(task_id: str) -> None:
    """Mark a task as incomplete (pending).

    TASK_ID is the unique identifier of the task to mark incomplete.
    """
    service = get_service()
    try:
        task = service.incomplete_task(task_id)
        success_message(f"Marked incomplete: {task.title}")
    except TaskNotFoundError:
        error_message(f"Task not found: {task_id}")
```
