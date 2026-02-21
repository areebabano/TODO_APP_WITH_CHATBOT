"""Task domain model with validation and serialization for Phase II."""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Optional
from uuid import UUID, uuid4


@dataclass
class Task:
    """
    Represents a task to be tracked in the Chief of Staff application.

    Attributes:
        title: The task title (1-100 characters).
        description: Optional task description (0-500 characters).
        id: Unique identifier (UUID).
        status: Task status ("incomplete" or "complete").
        created_at: Timestamp when task was created.
        updated_at: Timestamp when task was last updated.
        completed_at: Timestamp when task was completed (None if incomplete).
        owner_user_id: ID of the user who owns this task (for multi-user support).
    """

    title: str
    description: Optional[str] = None
    id: UUID = field(default_factory=uuid4)
    status: str = "incomplete"
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    completed_at: Optional[datetime] = None
    owner_user_id: Optional[UUID] = None  # New field for Phase II multi-user support

    def __post_init__(self) -> None:
        """Validate task fields after initialization."""
        # Strip whitespace from title
        self.title = self.title.strip()

        # Validate title
        if not self.title:
            raise ValueError("Title cannot be empty")
        if len(self.title) > 100:
            raise ValueError("Title must be between 1 and 100 characters")

        # Strip and validate description if provided
        if self.description is not None:
            self.description = self.description.strip()
            if len(self.description) > 500:
                raise ValueError("Description must not exceed 500 characters")
            # Convert empty string to None
            if not self.description:
                self.description = None

        # Validate status
        if self.status not in ("incomplete", "complete"):
            raise ValueError("Status must be 'incomplete' or 'complete'")

    def mark_complete(self) -> None:
        """
        Mark the task as complete.

        Updates status to 'complete', sets completed_at to current time,
        and updates the updated_at timestamp.
        """
        self.status = "complete"
        self.completed_at = datetime.now()
        self.updated_at = datetime.now()

    def mark_incomplete(self) -> None:
        """
        Mark the task as incomplete.

        Updates status to 'incomplete', clears completed_at,
        and updates the updated_at timestamp.
        """
        self.status = "incomplete"
        self.completed_at = None
        self.updated_at = datetime.now()

    def update(
        self,
        title: Optional[str] = None,
        description: Optional[str] = None,
    ) -> None:
        """
        Update task fields.

        Args:
            title: New title (1-100 characters) if provided.
            description: New description (0-500 characters) if provided.
                         Pass empty string to clear description.

        Raises:
            ValueError: If title is empty or exceeds 100 characters.
            ValueError: If description exceeds 500 characters.
        """
        changed = False

        if title is not None:
            title = title.strip()
            if not title:
                raise ValueError("Title cannot be empty")
            if len(title) > 100:
                raise ValueError("Title must be between 1 and 100 characters")
            self.title = title
            changed = True

        if description is not None:
            description = description.strip()
            if len(description) > 500:
                raise ValueError("Description must not exceed 500 characters")
            # Convert empty string to None
            self.description = description if description else None
            changed = True

        if changed:
            self.updated_at = datetime.now()

    def to_dict(self) -> dict[str, Any]:
        """
        Serialize task to a dictionary.

        Returns:
            Dictionary with all task fields. UUID is converted to string,
            datetime fields are converted to ISO 8601 format strings.
        """
        return {
            "id": str(self.id),
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "completed_at": (
                self.completed_at.isoformat() if self.completed_at else None
            ),
            "owner_user_id": str(self.owner_user_id) if self.owner_user_id else None,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "Task":
        """
        Deserialize a dictionary to a Task instance.

        Args:
            data: Dictionary with task fields. String UUIDs and ISO 8601
                  datetime strings are parsed automatically.

        Returns:
            Task instance.

        Raises:
            ValueError: If required fields are missing or validation fails.
        """
        from uuid import UUID

        return cls(
            id=UUID(data["id"]) if isinstance(data["id"], str) else data["id"],
            title=data["title"],
            description=data.get("description"),
            status=data.get("status", "incomplete"),
            created_at=(
                datetime.fromisoformat(data["created_at"])
                if isinstance(data.get("created_at"), str)
                else data.get("created_at", datetime.now())
            ),
            updated_at=(
                datetime.fromisoformat(data["updated_at"])
                if isinstance(data.get("updated_at"), str)
                else data.get("updated_at", datetime.now())
            ),
            completed_at=(
                datetime.fromisoformat(data["completed_at"])
                if isinstance(data.get("completed_at"), str)
                and data["completed_at"] is not None
                else data.get("completed_at")
            ),
            owner_user_id=(
                UUID(data["owner_user_id"])
                if data.get("owner_user_id")
                else None
            ),
        )