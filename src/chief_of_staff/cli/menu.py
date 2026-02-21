"""Interactive menu-driven CLI for the Chief of Staff application."""

import time
from typing import Optional

from rich.console import Console
from rich.live import Live
from rich.panel import Panel
from rich.spinner import Spinner
from rich.text import Text
from rich.box import ROUNDED

from chief_of_staff.cli.display import display_tasks
from chief_of_staff.services.exceptions import TaskNotFoundError, ValidationError
from chief_of_staff.services.task_service import TaskService

console = Console()


def resolve_task_id(service: TaskService, partial_id: str) -> Optional[str]:
    """
    Resolve a partial task ID to the full UUID.

    Args:
        service: The TaskService to query tasks from.
        partial_id: The partial ID (first 8 chars or more) entered by the user.

    Returns:
        The full task ID if found, None otherwise.
    """
    tasks = service.list_tasks()
    for task in tasks:
        full_id = str(task.id)
        if full_id.startswith(partial_id):
            return full_id
    return None


def clear_screen() -> None:
    """Clear the terminal screen."""
    console.clear()


def show_spinner(message: str, duration: float = 0.5) -> None:
    """
    Display a spinner with a message for a brief duration.

    Args:
        message: The message to display alongside the spinner.
        duration: How long to show the spinner (in seconds).
    """
    spinner = Spinner("dots", text=f" {message}", style="cyan")
    with Live(spinner, console=console, refresh_per_second=10):
        time.sleep(duration)


def show_success(message: str) -> None:
    """Display a styled success message."""
    console.print(f"[green bold]✓[/green bold] [green]{message}[/green]")


def show_error(message: str) -> None:
    """Display a styled error message."""
    console.print(f"[red bold]✗[/red bold] [red]{message}[/red]")


def wait_for_enter() -> None:
    """Wait for user to press Enter before continuing."""
    console.print()
    console.print("[dim]Press Enter to return to menu...[/dim]", end="")
    input()


def show_header() -> None:
    """Display the application header with a smooth reveal animation."""
    clear_screen()

    title_text = "Smart Personal Chief of Staff"
    subtitle = "Your Task Management Assistant"

    # Build the animated header
    title = Text()
    title.append(title_text, style="bold cyan")
    title.append("\n")
    title.append(subtitle, style="dim white")

    panel = Panel(
        title,
        style="cyan",
        padding=(1, 4),
        box=ROUNDED,
    )

    # Animate the reveal
    with Live(console=console, refresh_per_second=20) as live:
        for i in range(len(title_text) + 1):
            partial_title = Text()
            partial_title.append(title_text[:i], style="bold cyan")
            partial_title.append("\n")
            if i == len(title_text):
                partial_title.append(subtitle, style="dim white")

            partial_panel = Panel(
                partial_title,
                style="cyan",
                padding=(1, 4),
                box=ROUNDED,
            )
            live.update(partial_panel)
            time.sleep(0.02)

    console.print()


def show_menu() -> None:
    """Display the main menu options inside a styled panel."""
    menu_content = Text()
    menu_content.append("What would you like to do?\n\n", style="bold white")

    options = [
        ("1", "Add Task", "Create a new task"),
        ("2", "View All Tasks", "See your task list"),
        ("3", "Update Task", "Modify an existing task"),
        ("4", "Delete Task", "Remove a task"),
        ("5", "Mark Complete", "Mark a task as done"),
        ("6", "Mark Incomplete", "Reopen a task"),
        ("0", "Exit", "Quit the application"),
    ]

    for key, label, desc in options:
        menu_content.append("  ")
        menu_content.append(f"[{key}]", style="bold cyan")
        menu_content.append(f"  {label}", style="white")
        menu_content.append(f"  {desc}\n", style="dim")

    panel = Panel(
        menu_content,
        title="[bold]Main Menu[/bold]",
        title_align="left",
        style="blue",
        padding=(1, 2),
        box=ROUNDED,
    )
    console.print(panel)


def get_input(prompt: str) -> str:
    """
    Get user input with a styled prompt.

    Args:
        prompt: The prompt text to display.

    Returns:
        The user's input string.
    """
    console.print(f"[cyan]>[/cyan] [bold]{prompt}[/bold] ", end="")
    return input().strip()


def get_optional_input(prompt: str) -> Optional[str]:
    """
    Get optional user input.

    Args:
        prompt: The prompt text to display.

    Returns:
        The user's input string, or None if empty.
    """
    value = get_input(prompt)
    return value if value else None


def show_section_header(title: str) -> None:
    """Display a styled section header."""
    console.print()
    header = Text(title, style="bold white")
    console.print(Panel(header, style="blue", box=ROUNDED, padding=(0, 2)))
    console.print()


def handle_add(service: TaskService) -> None:
    """Handle the Add Task operation."""
    show_section_header("Add New Task")

    title = get_input("Title:")
    if not title:
        show_error("Title cannot be empty")
        wait_for_enter()
        return

    description = get_optional_input("Description (optional):")

    try:
        show_spinner("Creating task...")
        task = service.create_task(title, description)
        show_success(f"Created task: {task.title} (ID: {str(task.id)[:8]})")
    except ValidationError as e:
        show_error(e.message)

    wait_for_enter()


def handle_list(service: TaskService) -> None:
    """Handle the View All Tasks operation."""
    show_section_header("All Tasks")

    show_spinner("Loading tasks...")
    tasks = service.list_tasks()
    display_tasks(tasks)

    wait_for_enter()


def handle_update(service: TaskService) -> None:
    """Handle the Update Task operation."""
    show_section_header("Update Task")

    partial_id = get_input("Task ID (first 8 chars):")
    if not partial_id:
        show_error("Task ID is required")
        wait_for_enter()
        return

    full_id = resolve_task_id(service, partial_id)
    if not full_id:
        show_error(f"Task not found: {partial_id}")
        wait_for_enter()
        return

    console.print("[dim](Leave blank to keep current value)[/dim]")
    title = get_optional_input("New title:")
    description = get_optional_input("New description:")

    if title is None and description is None:
        show_error("Provide at least one field to update")
        wait_for_enter()
        return

    try:
        show_spinner("Updating task...")
        task = service.update_task(full_id, title=title, description=description)
        show_success(f"Updated task: {task.title}")
    except TaskNotFoundError:
        show_error(f"Task not found: {partial_id}")
    except ValidationError as e:
        show_error(e.message)

    wait_for_enter()


def handle_delete(service: TaskService) -> None:
    """Handle the Delete Task operation."""
    show_section_header("Delete Task")

    partial_id = get_input("Task ID (first 8 chars):")
    if not partial_id:
        show_error("Task ID is required")
        wait_for_enter()
        return

    full_id = resolve_task_id(service, partial_id)
    if not full_id:
        show_error(f"Task not found: {partial_id}")
        wait_for_enter()
        return

    confirm = get_input("Are you sure? (y/n):")
    if confirm.lower() != "y":
        console.print("[dim]Cancelled.[/dim]")
        wait_for_enter()
        return

    try:
        show_spinner("Deleting task...")
        service.delete_task(full_id)
        show_success(f"Deleted task: {partial_id}")
    except TaskNotFoundError:
        show_error(f"Task not found: {partial_id}")

    wait_for_enter()


def handle_complete(service: TaskService) -> None:
    """Handle the Mark Task Complete operation."""
    show_section_header("Mark Task Complete")

    partial_id = get_input("Task ID (first 8 chars):")
    if not partial_id:
        show_error("Task ID is required")
        wait_for_enter()
        return

    full_id = resolve_task_id(service, partial_id)
    if not full_id:
        show_error(f"Task not found: {partial_id}")
        wait_for_enter()
        return

    try:
        show_spinner("Marking task complete...")
        task = service.complete_task(full_id)
        show_success(f"Completed task: {task.title}")
    except TaskNotFoundError:
        show_error(f"Task not found: {partial_id}")

    wait_for_enter()


def handle_incomplete(service: TaskService) -> None:
    """Handle the Mark Task Incomplete operation."""
    show_section_header("Mark Task Incomplete")

    partial_id = get_input("Task ID (first 8 chars):")
    if not partial_id:
        show_error("Task ID is required")
        wait_for_enter()
        return

    full_id = resolve_task_id(service, partial_id)
    if not full_id:
        show_error(f"Task not found: {partial_id}")
        wait_for_enter()
        return

    try:
        show_spinner("Updating task status...")
        task = service.uncomplete_task(full_id)
        show_success(f"Marked as incomplete: {task.title}")
    except TaskNotFoundError:
        show_error(f"Task not found: {partial_id}")

    wait_for_enter()


def run_menu_loop(service: TaskService) -> None:
    """
    Run the main interactive menu loop.

    Args:
        service: The TaskService instance for operations.
    """
    handlers = {
        "1": handle_add,
        "2": handle_list,
        "3": handle_update,
        "4": handle_delete,
        "5": handle_complete,
        "6": handle_incomplete,
    }

    show_header()

    while True:
        show_menu()
        choice = get_input("Enter choice:")

        if choice == "0":
            console.print()
            panel = Panel(
                Text("Goodbye! See you next time.", style="cyan"),
                style="cyan",
                box=ROUNDED,
                padding=(0, 2),
            )
            console.print(panel, justify="center")
            console.print()
            break

        handler = handlers.get(choice)
        if handler:
            clear_screen()
            handler(service)
            clear_screen()
        else:
            show_error("Invalid choice. Please enter 0-6.")
            wait_for_enter()
            clear_screen()
