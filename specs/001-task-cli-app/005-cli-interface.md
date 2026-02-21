# Feature Specification: CLI Interface

**Spec ID**: SPEC-005
**Feature Branch**: `001-task-cli-app`
**Created**: 2025-12-28
**Status**: Approved
**Priority**: P0
**Dependencies**: SPEC-001 (Project Setup), SPEC-002 (Task Data Model), SPEC-003 (In-Memory Storage), SPEC-004 (Task Service)

## Overview

Implement the command-line interface (CLI) for the Smart Personal Chief of Staff application using the Click framework for command parsing and Rich library for formatted output. The CLI provides commands for all task management operations with user-friendly output and error handling. The interface follows a thin controller pattern where commands delegate to the service layer for business logic.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add New Tasks (Priority: P1)

As a user, I want to add tasks via command line so that I can quickly capture work items.

**Why this priority**: Task creation is the primary entry point for users interacting with the application.

**Independent Test**: Run `chief add "Buy groceries"` and verify success message with task ID displayed.

**Acceptance Scenarios**:

1. **Given** the CLI is running, **When** user executes `chief add "Buy groceries"`, **Then** a success message is displayed showing the task was created with its ID.

2. **Given** the CLI is running, **When** user executes `chief add "Buy groceries" --description "Milk, bread, eggs"`, **Then** a success message shows task created with title and description.

3. **Given** the CLI is running, **When** user executes `chief add ""`, **Then** an error message is displayed indicating title cannot be empty.

4. **Given** the CLI is running, **When** user executes `chief add` without arguments, **Then** Click displays usage error with help text.

---

### User Story 2 - List All Tasks (Priority: P1)

As a user, I want to see all my tasks in a formatted table so that I can review my work items at a glance.

**Why this priority**: Task visibility is essential for task management workflows.

**Independent Test**: Create multiple tasks, run `chief list`, verify formatted table with all tasks displayed.

**Acceptance Scenarios**:

1. **Given** multiple tasks exist, **When** user executes `chief list`, **Then** a Rich-formatted table displays with columns for status, ID (truncated), title, and creation date.

2. **Given** incomplete tasks exist, **When** `chief list` is executed, **Then** incomplete tasks show `[ ]` indicator in yellow.

3. **Given** complete tasks exist, **When** `chief list` is executed, **Then** complete tasks show `[x]` indicator in green.

4. **Given** no tasks exist, **When** user executes `chief list`, **Then** a friendly message indicates no tasks found.

---

### User Story 3 - Update Task Details (Priority: P2)

As a user, I want to update task title and description so that I can correct or enhance my task information.

**Why this priority**: Users frequently need to modify tasks after initial creation.

**Independent Test**: Create a task, run `chief update <id> --title "New Title"`, verify task is updated.

**Acceptance Scenarios**:

1. **Given** an existing task, **When** user executes `chief update <id> --title "New Title"`, **Then** success message confirms the update.

2. **Given** an existing task, **When** user executes `chief update <id> --description "New desc"`, **Then** the description is updated.

3. **Given** an existing task, **When** user executes `chief update <id> --title "New" --description "Desc"`, **Then** both fields are updated.

4. **Given** an invalid task ID, **When** user executes `chief update <id> --title "X"`, **Then** error message indicates task not found.

5. **Given** user executes `chief update <id>` with no options, **Then** error message indicates at least one option required.

---

### User Story 4 - Delete Tasks (Priority: P2)

As a user, I want to delete tasks I no longer need so that my task list stays manageable.

**Why this priority**: Cleanup is important for maintaining a useful task list.

**Independent Test**: Create a task, run `chief delete <id>`, verify task no longer appears in list.

**Acceptance Scenarios**:

1. **Given** an existing task, **When** user executes `chief delete <id>`, **Then** success message confirms deletion.

2. **Given** an invalid task ID, **When** user executes `chief delete <id>`, **Then** error message indicates task not found.

3. **Given** a deleted task, **When** user executes `chief list`, **Then** the deleted task is not shown.

---

### User Story 5 - Mark Tasks Complete (Priority: P1)

As a user, I want to mark tasks as complete so that I can track my progress.

**Why this priority**: Status management is core to task tracking functionality.

**Independent Test**: Create a task, run `chief complete <id>`, verify status changes to complete.

**Acceptance Scenarios**:

1. **Given** an incomplete task, **When** user executes `chief complete <id>`, **Then** success message indicates task completed.

2. **Given** an invalid task ID, **When** user executes `chief complete <id>`, **Then** error message indicates task not found.

3. **Given** a completed task shown in list, **Then** it displays green `[x]` status indicator.

---

### User Story 6 - Mark Tasks Incomplete (Priority: P2)

As a user, I want to mark completed tasks as incomplete so that I can reopen them if needed.

**Why this priority**: Users sometimes need to revert task completion status.

**Independent Test**: Complete a task, run `chief incomplete <id>`, verify status reverts to incomplete.

**Acceptance Scenarios**:

1. **Given** a complete task, **When** user executes `chief incomplete <id>`, **Then** success message indicates task marked incomplete.

2. **Given** an invalid task ID, **When** user executes `chief incomplete <id>`, **Then** error message indicates task not found.

---

### User Story 7 - Get Help Information (Priority: P3)

As a user, I want to see help text for all commands so that I know how to use the application.

**Why this priority**: Help is essential for usability but secondary to core functionality.

**Independent Test**: Run `chief --help` and `chief add --help`, verify comprehensive help text displayed.

**Acceptance Scenarios**:

1. **Given** the CLI, **When** user executes `chief --help`, **Then** all available commands are listed with descriptions.

2. **Given** the CLI, **When** user executes `chief add --help`, **Then** usage, arguments, and options for add command are shown.

---

### Edge Cases

- What happens with very long task titles? Displayed truncated in table, full title shown in detail view.
- What happens with special characters in title? Handled correctly by Rich library.
- What happens with Unicode characters? Displayed correctly on supporting terminals.
- What happens when terminal is narrow? Rich handles wrapping gracefully.
- What happens with copy-pasted task IDs with extra whitespace? IDs are trimmed before lookup.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: CLI MUST use Click framework for command parsing with `@click.group()` for the main entry point.

- **FR-002**: CLI MUST implement `add` command accepting title as argument and optional `--description`/`-d` option.

- **FR-003**: CLI MUST implement `list` command displaying all tasks in a Rich-formatted table.

- **FR-004**: CLI MUST implement `update` command accepting task ID and optional `--title`/`-t` and `--description`/`-d` options.

- **FR-005**: CLI MUST implement `delete` command accepting task ID as argument.

- **FR-006**: CLI MUST implement `complete` command accepting task ID as argument.

- **FR-007**: CLI MUST implement `incomplete` command accepting task ID as argument.

- **FR-008**: Task list MUST display columns: Status indicator, ID (first 8 characters), Title, Created date.

- **FR-009**: Status indicators MUST use `[ ]` for incomplete (yellow) and `[x]` for complete (green).

- **FR-010**: Success messages MUST be displayed in green color.

- **FR-011**: Error messages MUST be displayed in red color and be user-friendly (no stack traces).

- **FR-012**: All commands MUST have complete `--help` text explaining usage, arguments, and options.

- **FR-013**: CLI MUST return exit code 0 on success and non-zero on errors.

- **FR-014**: Display layer MUST be separate from command layer (commands delegate to display functions).

- **FR-015**: Commands MUST be thin wrappers that delegate to TaskService for business logic.

- **FR-016**: The main entry point MUST wire up dependencies (MemoryStore -> TaskService -> Commands).

### Key Entities

- **CLI Commands**: Click command functions that parse input and delegate to service layer.
  - Commands: add, list, update, delete, complete, incomplete

- **Display Functions**: Rich-based output functions for consistent formatting.
  - Functions: display_tasks, display_success, display_error, display_task_created

- **Main Entry Point**: Application initialization that wires dependencies together.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All CLI commands execute and return results in under 500 milliseconds.

- **SC-002**: Users can complete any task management operation with a single command (no multi-step workflows).

- **SC-003**: Error messages clearly explain what went wrong and how to fix it.

- **SC-004**: Help text is sufficient for users to learn all commands without external documentation.

- **SC-005**: Output formatting renders correctly on common terminals (Windows Terminal, macOS Terminal, Linux terminals).

- **SC-006**: Exit codes correctly indicate success (0) or failure (non-zero) for scripting integration.

## Technical Context

### File Locations

- `src/chief_of_staff/cli/commands.py` - Click command definitions
- `src/chief_of_staff/cli/display.py` - Rich display functions
- `src/chief_of_staff/cli/__init__.py` - Export public interfaces
- `src/chief_of_staff/main.py` - Application entry point and dependency wiring

### Command Structure

```python
# commands.py
import click
from typing import Optional

from chief_of_staff.services.task_service import TaskService
from chief_of_staff.cli.display import display_tasks, display_success, display_error


def create_cli(task_service: TaskService) -> click.Group:
    """Create CLI with injected service."""

    @click.group()
    def cli():
        """Smart Personal Chief of Staff - Task Management CLI."""
        pass

    @cli.command()
    @click.argument("title")
    @click.option("-d", "--description", help="Task description")
    def add(title: str, description: Optional[str]):
        """Add a new task."""
        # Implementation

    @cli.command("list")
    def list_tasks():
        """List all tasks."""
        # Implementation

    @cli.command()
    @click.argument("task_id")
    @click.option("-t", "--title", help="New title")
    @click.option("-d", "--description", help="New description")
    def update(task_id: str, title: Optional[str], description: Optional[str]):
        """Update a task."""
        # Implementation

    @cli.command()
    @click.argument("task_id")
    def delete(task_id: str):
        """Delete a task."""
        # Implementation

    @cli.command()
    @click.argument("task_id")
    def complete(task_id: str):
        """Mark a task as complete."""
        # Implementation

    @cli.command()
    @click.argument("task_id")
    def incomplete(task_id: str):
        """Mark a task as incomplete."""
        # Implementation

    return cli
```

### Display Functions

```python
# display.py
from rich.console import Console
from rich.table import Table
from rich.text import Text

from chief_of_staff.models.task import Task

console = Console()


def display_tasks(tasks: list[Task]) -> None:
    """Display tasks in a formatted table."""
    # Implementation with Rich Table

def display_success(message: str) -> None:
    """Display a success message in green."""
    # Implementation

def display_error(message: str) -> None:
    """Display an error message in red."""
    # Implementation

def display_task_created(task: Task) -> None:
    """Display task creation confirmation."""
    # Implementation
```

### Main Entry Point

```python
# main.py
from chief_of_staff.storage.memory_store import MemoryStore
from chief_of_staff.services.task_service import TaskService
from chief_of_staff.cli.commands import create_cli


def main():
    """Application entry point."""
    storage = MemoryStore()
    service = TaskService(storage)
    cli = create_cli(service)
    cli()


if __name__ == "__main__":
    main()
```

### Command Reference

| Command | Arguments | Options | Description |
|---------|-----------|---------|-------------|
| add | title | -d/--description | Add a new task |
| list | None | None | List all tasks |
| update | task_id | -t/--title, -d/--description | Update task fields |
| delete | task_id | None | Delete a task |
| complete | task_id | None | Mark task complete |
| incomplete | task_id | None | Mark task incomplete |

### Output Formatting

| Element | Style |
|---------|-------|
| Incomplete status | `[ ]` in yellow |
| Complete status | `[x]` in green |
| Task ID | First 8 characters of UUID |
| Success messages | Green text |
| Error messages | Red text |
| Table headers | Bold |

## Assumptions

- Terminal supports ANSI color codes (Rich handles degradation gracefully).
- Users provide task IDs as shown in list output (first 8 characters are sufficient).
- Commands are invoked from the command line (not programmatic API usage).
- Rich library handles Unicode and special characters correctly.

## Testing Strategy

1. **Command Parsing Tests**: Verify Click correctly parses all commands and options.
2. **Output Format Tests**: Verify Rich output renders correctly (may require snapshot testing).
3. **Error Handling Tests**: Verify user-friendly error messages for all failure scenarios.
4. **Integration Tests**: Test full flow from command input to display output.
5. **Exit Code Tests**: Verify correct exit codes for success and failure cases.
6. **Help Text Tests**: Verify all commands have complete help documentation.

---

**Constitution Compliance**: This specification adheres to Constitution Principles III (CLI-First Interface), I (Layered Architecture - CLI calls services, not storage directly), IV (Explicit Dependency Injection - CLI receives service as dependency), and VI (Error Handling - user-friendly messages, no stack traces).
