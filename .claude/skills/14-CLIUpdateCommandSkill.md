# CLIUpdateCommandSkill.md

## Skill Name
`cli-update-command-implementation`

## Purpose
Implement the `update` CLI command for modifying existing task title and/or description.

## Responsibilities
1. **Define Update Command**
   - Create `@cli.command()` decorated function named `update`
   - Add command docstring for `--help` output

2. **Define Arguments and Options**
   - Add `task_id` as required positional argument
   - Add `--title` / `-t` as optional option
   - Add `--description` / `-d` as optional option
   - Configure help text explaining partial updates

3. **Implement Command Logic**
   - Get TaskService via `get_service()`
   - Call `service.update_task(task_id, title, description)`
   - Display success message with updated task title
   - Handle TaskNotFoundError with error message
   - Handle ValidationError with error message

4. **Wire to Display Layer**
   - Use `success_message()` for successful update
   - Use `error_message()` for errors

## Rules
1. **MUST** accept task_id as positional argument
2. **MUST** make title and description optional flags
3. **MUST** handle TaskNotFoundError gracefully
4. **MUST** handle ValidationError gracefully
5. **MUST** show updated task info in success message
6. **MUST NOT** require both title and description
7. **MUST NOT** raise unhandled exceptions

## Constraints
- Depends on CLIGroupSkill (cli group exists)
- Depends on TaskService and display functions
- File location: `cli/commands.py` (extend existing)
- At least one of title/description should typically be provided

## When to Use / Trigger Conditions
- **Primary Trigger**: After CLIListCommandSkill completes
- **User Request**: "Implement update command", "Modify task CLI"
- **Prerequisite For**: Full CRUD CLI functionality
- **Never Use When**: Update command already exists

## Validation Checklist
Before marking complete, verify:
- [ ] Command registered as `update`
- [ ] task_id is required positional argument
- [ ] Title is optional with `-t` flag
- [ ] Description is optional with `-d` flag
- [ ] `--help` shows clear usage
- [ ] Success message shows updated task
- [ ] TaskNotFoundError shows user-friendly message
- [ ] ValidationError shows user-friendly message
- [ ] No stack traces on error

## Output Artifacts
- Updated `cli/commands.py` - Added update command

## Code Pattern
```python
# Add to cli/commands.py:

from services import TaskNotFoundError


@cli.command()
@click.argument("task_id")
@click.option(
    "--title", "-t",
    default=None,
    help="New title for the task."
)
@click.option(
    "--description", "-d",
    default=None,
    help="New description for the task."
)
def update(task_id: str, title: Optional[str], description: Optional[str]) -> None:
    """Update an existing task.

    TASK_ID is the unique identifier of the task to update.
    Provide --title and/or --description to update those fields.
    """
    service = get_service()
    try:
        task = service.update_task(task_id, title=title, description=description)
        success_message(f"Updated task: {task.title}")
    except TaskNotFoundError:
        error_message(f"Task not found: {task_id}")
    except ValidationError as e:
        error_message(str(e))
```
