"""Application controller with scrollable terminal history."""

from typing import Optional

from chief_of_staff.models.task import Task
from chief_of_staff.services.exceptions import TaskNotFoundError, ValidationError
from chief_of_staff.services.task_service import TaskService
from chief_of_staff.ui.renderer import UIRenderer


class AppController:
    """
    Main application controller.

    UX FLOW:
    - Clear screen ONLY on initial launch
    - After that, all output appends to terminal (scrollable history)
    - User can scroll up to see previous operations
    - Each action: section header -> input -> result -> divider -> menu
    """

    def __init__(self, service: TaskService) -> None:
        """Initialize the application controller."""
        self._service = service
        self._ui = UIRenderer()
        self._running = False

    def _get_tasks(self) -> list[Task]:
        """Get current tasks from service."""
        return self._service.list_tasks()

    def _resolve_task_id(self, partial_id: str) -> Optional[str]:
        """Resolve partial task ID to full UUID."""
        tasks = self._get_tasks()
        for task in tasks:
            full_id = str(task.id)
            if full_id.startswith(partial_id):
                return full_id
        return None

    def _handle_add(self) -> None:
        """Handle Add Task."""
        self._ui.render_section_header("Add New Task")

        title = self._ui.get_input("Title:")
        if not title:
            self._ui.render_error("Title cannot be empty")
            return

        description = self._ui.get_optional_input("Description (optional):")

        try:
            self._ui.show_spinner("Creating task...")
            task = self._service.create_task(title, description)
            self._ui.render_success(f"Created task: {task.title} (ID: {str(task.id)[:8]})")
        except ValidationError as e:
            self._ui.render_error(e.message)

    def _handle_list(self) -> None:
        """Handle View All Tasks."""
        self._ui.render_section_header("All Tasks")
        self._ui.show_spinner("Loading tasks...")
        tasks = self._get_tasks()
        self._ui.render_task_table(tasks)

    def _handle_update(self) -> None:
        """Handle Update Task."""
        self._ui.render_section_header("Update Task")

        tasks = self._get_tasks()
        if not tasks:
            self._ui.render_warning("No tasks available to update")
            return

        self._ui.render_task_table(tasks)

        partial_id = self._ui.get_input("Task ID (first 8 chars):")
        if not partial_id:
            self._ui.render_error("Task ID is required")
            return

        full_id = self._resolve_task_id(partial_id)
        if not full_id:
            self._ui.render_warning(f"Task not found: {partial_id}")
            return

        self._ui.render_info("(Leave blank to keep current value)")
        title = self._ui.get_optional_input("New title:")
        description = self._ui.get_optional_input("New description:")

        if title is None and description is None:
            self._ui.render_warning("No changes provided")
            return

        try:
            self._ui.show_spinner("Updating task...")
            task = self._service.update_task(full_id, title=title, description=description)
            self._ui.render_success(f"Updated task: {task.title}")
        except TaskNotFoundError:
            self._ui.render_warning(f"Task not found: {partial_id}")
        except ValidationError as e:
            self._ui.render_error(e.message)

    def _handle_delete(self) -> None:
        """Handle Delete Task."""
        self._ui.render_section_header("Delete Task")

        tasks = self._get_tasks()
        if not tasks:
            self._ui.render_warning("No tasks available to delete")
            return

        self._ui.render_task_table(tasks)

        partial_id = self._ui.get_input("Task ID (first 8 chars):")
        if not partial_id:
            self._ui.render_error("Task ID is required")
            return

        full_id = self._resolve_task_id(partial_id)
        if not full_id:
            self._ui.render_warning(f"Task not found: {partial_id}")
            return

        confirm = self._ui.get_input("Are you sure? (y/n):")
        if confirm.lower() != "y":
            self._ui.render_info("Delete cancelled")
            return

        try:
            self._ui.show_spinner("Deleting task...")
            self._service.delete_task(full_id)
            self._ui.render_success(f"Deleted task: {partial_id}")
        except TaskNotFoundError:
            self._ui.render_warning(f"Task not found: {partial_id}")

    def _handle_complete(self) -> None:
        """Handle Mark Complete."""
        self._ui.render_section_header("Mark Task Complete")

        tasks = self._get_tasks()
        if not tasks:
            self._ui.render_warning("No tasks available")
            return

        self._ui.render_task_table(tasks)

        partial_id = self._ui.get_input("Task ID (first 8 chars):")
        if not partial_id:
            self._ui.render_error("Task ID is required")
            return

        full_id = self._resolve_task_id(partial_id)
        if not full_id:
            self._ui.render_warning(f"Task not found: {partial_id}")
            return

        try:
            self._ui.show_spinner("Marking complete...")
            task = self._service.complete_task(full_id)
            self._ui.render_success(f"Completed: {task.title}")
        except TaskNotFoundError:
            self._ui.render_warning(f"Task not found: {partial_id}")

    def _handle_incomplete(self) -> None:
        """Handle Mark Incomplete."""
        self._ui.render_section_header("Mark Task Incomplete")

        tasks = self._get_tasks()
        if not tasks:
            self._ui.render_warning("No tasks available")
            return

        self._ui.render_task_table(tasks)

        partial_id = self._ui.get_input("Task ID (first 8 chars):")
        if not partial_id:
            self._ui.render_error("Task ID is required")
            return

        full_id = self._resolve_task_id(partial_id)
        if not full_id:
            self._ui.render_warning(f"Task not found: {partial_id}")
            return

        try:
            self._ui.show_spinner("Updating status...")
            task = self._service.uncomplete_task(full_id)
            self._ui.render_success(f"Marked incomplete: {task.title}")
        except TaskNotFoundError:
            self._ui.render_warning(f"Task not found: {partial_id}")

    def run(self) -> None:
        """
        Run the main application loop.

        Flow:
        1. Clear screen + animated header (ONLY on launch)
        2. Show initial task table + menu
        3. Loop: get choice -> execute -> show divider -> show menu
        4. Terminal history preserved (scroll up to see previous ops)
        """
        self._running = True

        # Initial launch - clear screen and show animated header
        self._ui.clear_screen()
        self._ui.render_animated_header()
        self._ui.render_task_table(self._get_tasks())
        self._ui.render_menu()

        handlers = {
            "1": self._handle_add,
            "2": self._handle_list,
            "3": self._handle_update,
            "4": self._handle_delete,
            "5": self._handle_complete,
            "6": self._handle_incomplete,
        }

        while self._running:
            choice = self._ui.get_input("Enter choice:")

            if choice == "0":
                self._ui.render_goodbye()
                self._running = False
                break

            handler = handlers.get(choice)
            if handler:
                handler()
            else:
                self._ui.render_error("Invalid choice. Please enter 0-6.")

            # After every action: divider then menu (preserves scroll history)
            self._ui.render_divider()
            self._ui.render_menu()
