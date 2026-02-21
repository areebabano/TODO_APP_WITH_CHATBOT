# CLIListCommandSkill.md

## Skill Name
`cli-list-command-implementation`

## Purpose
Implement the `list` CLI command for displaying all tasks in a formatted table.

## Responsibilities
1. **Define List Command**
   - Create `@cli.command()` decorated function named `list`
   - Use `name="list"` to avoid Python keyword conflict
   - Add command docstring for `--help` output

2. **Implement Command Logic**
   - Get TaskService via `get_service()`
   - Call `service.get_all_tasks()` to retrieve tasks
   - Pass tasks to `display_tasks()` for rendering

3. **Handle Empty State**
   - Let `display_tasks()` handle empty list message
   - No special logic needed in command

## Rules
1. **MUST** use `name="list"` parameter since `list` is Python keyword
2. **MUST** delegate ALL formatting to display layer
3. **MUST** call `get_all_tasks()` without filtering (Phase 1)
4. **MUST NOT** include any display logic in command
5. **MUST NOT** handle exceptions (none expected from get_all)

## Constraints
- Depends on CLIGroupSkill (cli group exists)
- Depends on TaskService and display_tasks function
- File location: `cli/commands.py` (extend existing)
- No filtering options in Phase 1

## When to Use / Trigger Conditions
- **Primary Trigger**: After CLIAddCommandSkill completes
- **User Request**: "Implement list command", "Show all tasks"
- **Prerequisite For**: User can see their tasks
- **Never Use When**: List command already exists

## Validation Checklist
Before marking complete, verify:
- [ ] Command registered as `list`
- [ ] No required arguments
- [ ] `--help` shows clear description
- [ ] Displays all tasks in table format
- [ ] Empty list shows friendly message
- [ ] No errors when no tasks exist

## Output Artifacts
- Updated `cli/commands.py` - Added list command

## Code Pattern
```python
# Add to cli/commands.py:

from cli.display import display_tasks


@cli.command(name="list")
def list_tasks() -> None:
    """List all tasks.

    Displays all tasks in a formatted table showing status,
    ID, title, and creation date.
    """
    service = get_service()
    tasks = service.get_all_tasks()
    display_tasks(tasks)
```
