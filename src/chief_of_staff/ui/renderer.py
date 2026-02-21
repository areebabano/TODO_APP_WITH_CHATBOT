"""Rich-based UI renderer with enhanced colors and animations."""

import time
from typing import Optional

from rich.box import HEAVY, DOUBLE, ROUNDED
from rich.console import Console
from rich.live import Live
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn
from rich.style import Style
from rich.table import Table
from rich.text import Text

from chief_of_staff.models.task import Task


class UIRenderer:
    """
    Enhanced UI renderer with rich colors and animations.
    """

    def __init__(self) -> None:
        """Initialize the UI renderer."""
        self._console = Console()

    def clear_screen(self) -> None:
        """Clear screen - only used on initial launch."""
        self._console.clear()

    def render_header(self) -> None:
        """Render colorful application header."""
        # Gradient-style title
        title = Text()
        colors = ["bright_cyan", "cyan", "bright_blue", "blue", "bright_magenta"]
        title_text = "Smart Personal Chief of Staff"

        for i, char in enumerate(title_text):
            color = colors[i % len(colors)]
            title.append(char, style=f"bold {color}")

        title.append("\n\n")
        title.append("~~ ", style="dim cyan")
        title.append("Your Task Management Assistant", style="italic bright_white")
        title.append(" ~~", style="dim cyan")

        panel = Panel(
            title,
            style="bright_cyan",
            padding=(1, 4),
            box=DOUBLE,
            border_style="bright_cyan",
        )
        self._console.print(panel)
        self._console.print()

    def render_animated_header(self) -> None:
        """Render animated header with typing effect and colors."""
        title_text = "Smart Personal Chief of Staff"
        subtitle = "Your Task Management Assistant"
        colors = ["bright_cyan", "cyan", "bright_blue", "blue", "bright_magenta"]

        with Live(console=self._console, refresh_per_second=30) as live:
            # Typing animation for title
            for i in range(len(title_text) + 1):
                title = Text()
                for j, char in enumerate(title_text[:i]):
                    color = colors[j % len(colors)]
                    title.append(char, style=f"bold {color}")

                # Add blinking cursor
                if i < len(title_text):
                    title.append("_", style="bold bright_white blink")

                title.append("\n\n")
                if i == len(title_text):
                    title.append("~~ ", style="dim cyan")
                    title.append(subtitle, style="italic bright_white")
                    title.append(" ~~", style="dim cyan")

                panel = Panel(
                    title,
                    style="bright_cyan",
                    padding=(1, 4),
                    box=DOUBLE,
                    border_style="bright_cyan",
                )
                live.update(panel)
                time.sleep(0.04)

            # Final flash effect
            for _ in range(2):
                title = Text()
                for j, char in enumerate(title_text):
                    title.append(char, style="bold bright_white")
                title.append("\n\n")
                title.append("~~ ", style="dim cyan")
                title.append(subtitle, style="italic bright_white")
                title.append(" ~~", style="dim cyan")

                panel = Panel(title, style="bright_white", padding=(1, 4), box=DOUBLE)
                live.update(panel)
                time.sleep(0.1)

                title = Text()
                for j, char in enumerate(title_text):
                    color = colors[j % len(colors)]
                    title.append(char, style=f"bold {color}")
                title.append("\n\n")
                title.append("~~ ", style="dim cyan")
                title.append(subtitle, style="italic bright_white")
                title.append(" ~~", style="dim cyan")

                panel = Panel(title, style="bright_cyan", padding=(1, 4), box=DOUBLE, border_style="bright_cyan")
                live.update(panel)
                time.sleep(0.1)

        self._console.print()

    def render_section_header(self, title: str) -> None:
        """Render colorful section header."""
        self._console.print()

        # Icon mapping for sections
        icons = {
            "Add New Task": "[ + ]",
            "All Tasks": "[ # ]",
            "Update Task": "[ ~ ]",
            "Delete Task": "[ x ]",
            "Mark Task Complete": "[ v ]",
            "Mark Task Incomplete": "[ o ]",
        }

        icon = icons.get(title, "[*]")

        header = Text()
        header.append(f" {icon} ", style="bold bright_yellow")
        header.append(title, style="bold bright_white")

        panel = Panel(
            header,
            style="bright_blue",
            box=HEAVY,
            border_style="bright_blue",
            padding=(0, 2),
        )
        self._console.print(panel)
        self._console.print()

    def render_task_table(self, tasks: list[Task]) -> None:
        """Render beautiful task table with colors."""
        if not tasks:
            empty_msg = Text()
            empty_msg.append("  ( ) ", style="dim yellow")
            empty_msg.append("No tasks found. ", style="dim white")
            empty_msg.append("Press ", style="dim")
            empty_msg.append("[1]", style="bold bright_cyan")
            empty_msg.append(" to add your first task!", style="dim")

            panel = Panel(
                empty_msg,
                style="dim",
                box=ROUNDED,
                border_style="dim yellow",
                padding=(1, 2),
            )
            self._console.print(panel)
            self._console.print()
            return

        table = Table(
            show_header=True,
            header_style="bold bright_white on blue",
            box=HEAVY,
            padding=(0, 1),
            border_style="bright_blue",
            title="[bold bright_cyan]Your Tasks[/bold bright_cyan]",
            title_style="bold bright_cyan",
            caption=f"[dim]{len(tasks)} task(s) total[/dim]",
        )

        table.add_column("", justify="center", width=3, style="bold")  # Status icon
        table.add_column("Status", justify="center", width=12)
        table.add_column("ID", style="dim cyan", width=10)
        table.add_column("Title", min_width=25)
        table.add_column("Description", style="dim", min_width=20)

        for task in tasks:
            if task.status == "complete":
                icon = "[bright_green]^[/bright_green]"
                status = "[bold bright_green][DONE][/bold bright_green]"
                title_style = "green"
                row_style = Style(color="green", dim=True)
            else:
                icon = "[bright_yellow]o[/bright_yellow]"
                status = "[bold bright_yellow][TODO][/bold bright_yellow]"
                title_style = "bright_yellow"
                row_style = None

            short_id = str(task.id)[:8]
            description = task.description if task.description else "[dim italic]No description[/dim italic]"

            table.add_row(
                icon,
                status,
                f"[cyan]{short_id}[/cyan]",
                f"[{title_style}]{task.title}[/{title_style}]",
                description,
                style=row_style,
            )

        self._console.print(table)
        self._console.print()

    def render_menu(self) -> None:
        """Render colorful main menu."""
        menu_content = Text()
        menu_content.append("\n")
        menu_content.append("  What would you like to do?\n\n", style="bold bright_white")

        options = [
            ("1", "+", "Add Task", "Create a new task", "bright_green"),
            ("2", "#", "View All", "See your task list", "bright_cyan"),
            ("3", "~", "Update", "Modify an existing task", "bright_yellow"),
            ("4", "x", "Delete", "Remove a task", "bright_red"),
            ("5", "v", "Complete", "Mark a task as done", "bright_magenta"),
            ("6", "o", "Incomplete", "Reopen a task", "bright_blue"),
            ("0", "<", "Exit", "Quit the application", "dim white"),
        ]

        for key, icon, label, desc, color in options:
            menu_content.append("    ")
            menu_content.append(f"[{icon}]", style=f"bold {color}")
            menu_content.append(" ")
            menu_content.append(f"[{key}]", style="bold bright_white")
            menu_content.append(f"  {label}", style=f"{color}")
            menu_content.append(f"  - {desc}\n", style="dim")

        menu_content.append("\n")

        panel = Panel(
            menu_content,
            title="[bold bright_magenta][ Main Menu ][/bold bright_magenta]",
            title_align="center",
            style="bright_magenta",
            padding=(0, 2),
            box=DOUBLE,
            border_style="bright_magenta",
        )
        self._console.print(panel)

    def render_success(self, message: str) -> None:
        """Render animated success message."""
        # Quick celebration animation
        frames = ["[*]", "[**]", "[***]", "[ v ]"]
        with Live(console=self._console, refresh_per_second=15) as live:
            for frame in frames:
                content = Text()
                content.append(f" {frame} ", style="bold bright_green")
                content.append(message, style="bright_green")
                panel = Panel(content, style="green", box=ROUNDED, border_style="bright_green", padding=(0, 2))
                live.update(panel)
                time.sleep(0.1)

        # Final success message
        content = Text()
        content.append(" [ v ] SUCCESS ", style="bold bright_white on green")
        content.append("  ", style="")
        content.append(message, style="bright_green")

        panel = Panel(content, style="green", box=ROUNDED, border_style="bright_green", padding=(0, 2))
        self._console.print(panel)
        self._console.print()

    def render_error(self, message: str) -> None:
        """Render error message with shake effect."""
        content = Text()
        content.append(" [ ! ] ERROR ", style="bold bright_white on red")
        content.append("  ", style="")
        content.append(message, style="bright_red")

        panel = Panel(content, style="red", box=ROUNDED, border_style="bright_red", padding=(0, 2))
        self._console.print(panel)
        self._console.print()

    def render_warning(self, message: str) -> None:
        """Render warning message."""
        content = Text()
        content.append(" [ ? ] WARNING ", style="bold black on bright_yellow")
        content.append("  ", style="")
        content.append(message, style="bright_yellow")

        panel = Panel(content, style="yellow", box=ROUNDED, border_style="bright_yellow", padding=(0, 2))
        self._console.print(panel)
        self._console.print()

    def render_info(self, message: str) -> None:
        """Render info message."""
        self._console.print(f"  [dim cyan]>[/dim cyan] [dim]{message}[/dim]")

    def render_divider(self) -> None:
        """Render colorful divider between operations."""
        self._console.print()
        # Gradient divider
        divider = Text()
        colors = ["bright_blue", "bright_cyan", "bright_green", "bright_yellow", "bright_magenta", "bright_red"]
        for i in range(60):
            color = colors[i % len(colors)]
            divider.append("-", style=f"{color}")
        self._console.print(divider)
        self._console.print()

    def render_goodbye(self) -> None:
        """Render animated goodbye message."""
        messages = [
            ("See you soon!", "bright_cyan"),
            ("Keep being productive!", "bright_green"),
            ("Goodbye!", "bright_magenta"),
        ]

        with Live(console=self._console, refresh_per_second=10) as live:
            for msg, color in messages:
                content = Text()
                content.append(f" [<] {msg} ", style=f"bold {color}")
                panel = Panel(content, style=color, box=DOUBLE, border_style=color, padding=(0, 2))
                live.update(panel)
                time.sleep(0.4)

        self._console.print()

        # Final message
        bye = Text()
        bye.append("\n  ", style="")
        wave_colors = ["bright_red", "bright_yellow", "bright_green", "bright_cyan", "bright_blue", "bright_magenta"]
        wave_text = "Thanks for using Chief of Staff!"
        for i, char in enumerate(wave_text):
            bye.append(char, style=f"bold {wave_colors[i % len(wave_colors)]}")
        bye.append("  \n", style="")

        panel = Panel(bye, style="bright_white", box=DOUBLE, border_style="bright_magenta", padding=(0, 2))
        self._console.print(panel)
        self._console.print()

    def get_input(self, prompt: str) -> str:
        """Get user input with styled prompt."""
        self._console.print(f"[bold bright_cyan]>[/bold bright_cyan] [bold bright_white]{prompt}[/bold bright_white] ", end="")
        return input().strip()

    def get_optional_input(self, prompt: str) -> Optional[str]:
        """Get optional user input."""
        value = self.get_input(prompt)
        return value if value else None

    def show_spinner(self, message: str, duration: float = 0.5) -> None:
        """Show animated progress spinner."""
        with Progress(
            SpinnerColumn(spinner_name="dots12", style="bright_cyan"),
            TextColumn("[bold bright_cyan]{task.description}[/bold bright_cyan]"),
            BarColumn(bar_width=20, style="bright_blue", complete_style="bright_green"),
            console=self._console,
            transient=True,
        ) as progress:
            task = progress.add_task(message, total=100)
            for i in range(100):
                progress.update(task, advance=1)
                time.sleep(duration / 100)
