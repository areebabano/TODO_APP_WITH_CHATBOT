# CLIAddCommandSkill.md

## Skill Name
`cli-add-command-implementation`

## Purpose
Implement the `add` CLI command for creating new tasks with title and optional description.

## Responsibilities
1. **Define Add Command**
   - Create `@cli.command()` decorated function named `add`
   - Add command docstring for `--help` output

2. **Define Arguments and Options**
   - Add `title` as required positional argument
   - Add `--description` / `-d` as optional option
   - Configure proper help text for each

3. **Implement Command Logic**
   - Get TaskService via `get_service()`
   - Call `service.create_task(title, description)`
   - Display success message with task ID
   - Handle ValidationError with error message

4. **Wire to Display Layer**
   - Use `success_message()` for successful creation
   - Use `error_message()` for validation errors

## Rules
1. **MUST** use positional argument for title (required)
2. **MUST** use optional flag for description
3. **MUST** handle ValidationError gracefully
4. **MUST** show created task ID in success message
5. **MUST** delegate display to display functions
6. **MUST NOT** include business logic (validation in service)
7. **MUST NOT** raise unhandled exceptions to user

## Constraints
- Depends on CLIGroupSkill (cli group exists)
- Depends on TaskService and display functions
- File location: `cli/commands.py` (extend existing)
- Command added to existing cli group

## When to Use / Trigger Conditions
- **Primary Trigger**: After CLIGroupSkill completes
- **User Request**: "Implement add command", "Create task creation CLI"
- **Prerequisite For**: Full CLI functionality
- **Never Use When**: Add command already exists

## Validation Checklist
Before marking complete, verify:
- [ ] Command registered as `add`
- [ ] Title is required positional argument
- [ ] Description is optional with `-d` flag
- [ ] `--help` shows clear usage
- [ ] Success message includes task ID
- [ ] ValidationError shows user-friendly error
- [ ] No stack traces on error

## Output Artifacts
- Updated `cli/commands.py` - Added add command

## Code Pattern
```python
# Add to cli/commands.py after cli group:

from cli.display import success_message, error_message
from services import ValidationError


@cli.command()
@click.argument("title")
@click.option(
    "--description", "-d",
    default=None,
    help="Optional description for the task."
)
def add(title: str, description: Optional[str]) -> None:
    """Add a new task.

    TITLE is the name/summary of the task to create.
    """
    service = get_service()
    try:
        task = service.create_task(title, description)
        success_message(f"Created task: {task.title} (ID: {str(task.id)[:8]})")
    except ValidationError as e:
        error_message(str(e))
```
