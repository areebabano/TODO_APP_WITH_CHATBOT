# DisplayFunctionsSkill.md

## Skill Name
`display-functions-implementation`

## Purpose
Implement display functions for rendering task lists, success messages, and error messages with Rich formatting.

## Responsibilities
1. **Implement Task List Display**
   - Create `display_tasks(tasks: List[Task]) -> None`
   - Use Rich Table for structured output
   - Display columns: Status, ID (truncated), Title, Created
   - Show `[✓]` (green) for complete, `[ ]` (yellow) for incomplete
   - Handle empty list with friendly message

2. **Implement Success Message**
   - Create `success_message(message: str) -> None`
   - Display in green with bold styling
   - Include checkmark indicator
   - Keep output concise

3. **Implement Error Message**
   - Create `error_message(message: str) -> None`
   - Display in red with bold styling
   - Include error indicator
   - Visually distinct from success

## Rules
1. **MUST** use green color for complete tasks and success
2. **MUST** use yellow color for incomplete/pending tasks
3. **MUST** use red color for errors
4. **MUST** provide ASCII fallback for symbols (`[x]` / `[ ]` if needed)
5. **MUST** handle empty task list gracefully
6. **MUST** truncate long task IDs for display (first 8 chars)
7. **MUST NOT** include any business logic
8. **MUST NOT** raise exceptions - display should always succeed
9. **MUST** accept Task objects, not dictionaries

## Constraints
- Depends on DisplayConsoleSkill (console instance)
- Depends on Task model for type hints
- File location: `cli/display.py` (extend existing)
- Cross-platform color/symbol rendering
- Functions must be importable from cli.display

## When to Use / Trigger Conditions
- **Primary Trigger**: After DisplayConsoleSkill completes
- **User Request**: "Implement display functions", "Add task list display"
- **Prerequisite For**: All CLI command skills
- **Never Use When**: Display functions already exist and work correctly

## Validation Checklist
Before marking complete, verify:
- [ ] `display_tasks()` shows table with correct columns
- [ ] Complete tasks show green `[✓]`
- [ ] Incomplete tasks show yellow `[ ]`
- [ ] Empty list shows friendly message
- [ ] `success_message()` displays in green
- [ ] `error_message()` displays in red
- [ ] All functions handle edge cases (empty string, long text)
- [ ] Functions work on Windows terminal
- [ ] No exceptions raised during display

## Output Artifacts
- Updated `cli/display.py` - Added display functions
- Updated `cli/__init__.py` - Export display functions

## Code Pattern
```python
"""Display layer for CLI output formatting."""
from typing import List

from rich.console import Console
from rich.table import Table

from models import Task, TaskStatus

console = Console()


def display_tasks(tasks: List[Task]) -> None:
    """Display a list of tasks in a formatted table.

    Args:
        tasks: List of Task instances to display.
    """
    if not tasks:
        console.print("[dim]No tasks found.[/dim]")
        return

    table = Table(show_header=True, header_style="bold")
    table.add_column("Status", width=8, justify="center")
    table.add_column("ID", width=10)
    table.add_column("Title", min_width=20)
    table.add_column("Created", width=12)

    for task in tasks:
        if task.status == TaskStatus.COMPLETED:
            status = "[green][✓][/green]"
            style = "green"
        else:
            status = "[yellow][ ][/yellow]"
            style = "yellow"

        task_id = str(task.id)[:8]
        created = task.created_at.strftime("%Y-%m-%d")

        table.add_row(
            status,
            f"[dim]{task_id}[/dim]",
            f"[{style}]{task.title}[/{style}]",
            f"[dim]{created}[/dim]",
        )

    console.print(table)


def success_message(message: str) -> None:
    """Display a success message in green.

    Args:
        message: The success message to display.
    """
    console.print(f"[bold green]✓ {message}[/bold green]")


def error_message(message: str) -> None:
    """Display an error message in red.

    Args:
        message: The error message to display.
    """
    console.print(f"[bold red]✗ {message}[/bold red]")
```
