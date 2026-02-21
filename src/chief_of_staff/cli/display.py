"""Display functions using Rich for formatted terminal output."""

from rich.box import ASCII
from rich.console import Console
from rich.table import Table

from chief_of_staff.models.task import Task

# Global console instance for consistent output
console = Console()


def display_tasks(tasks: list[Task]) -> None:
    """
    Display a list of tasks in a formatted table.

    Args:
        tasks: List of tasks to display.
    """
    if not tasks:
        console.print("[dim]No tasks found.[/dim]")
        return

    # Use ASCII box style for cross-platform compatibility
    table = Table(show_header=True, header_style="bold", box=ASCII)

    # Add columns
    table.add_column("Status", justify="center", width=8)
    table.add_column("ID", style="dim", width=10)
    table.add_column("Title", min_width=20)
    table.add_column("Description", style="dim", min_width=20)

    # Add rows
    for task in tasks:
        # Status indicator - use ASCII-compatible symbols for cross-platform support
        if task.status == "complete":
            status = "[green][x][/green]"
            title_style = "green"
        else:
            status = "[yellow][ ][/yellow]"
            title_style = "yellow"

        # Truncate ID to first 8 characters
        short_id = str(task.id)[:8]

        # Format description
        description = task.description or ""

        table.add_row(
            status,
            short_id,
            f"[{title_style}]{task.title}[/{title_style}]",
            description,
        )

    console.print(table)


def display_success(message: str) -> None:
    """
    Display a success message.

    Args:
        message: The success message to display.
    """
    console.print(f"[green]+[/green] {message}")


def display_error(message: str) -> None:
    """
    Display an error message.

    Args:
        message: The error message to display.
    """
    console.print(f"[red]x[/red] {message}")
