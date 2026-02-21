"""
Database indexes for performance optimization.
"""

# Define database indexes to optimize query performance
# In SQLModel/SQLAlchemy, indexes are typically defined at the model level
# This file can be used to define additional indexes or complex indexing strategies

from sqlalchemy import Index
from .user import User
from .task_model import Task


# Example indexes - these would typically be defined in the model classes themselves
# using the sa_column parameter with index=True

# Index on User email for faster authentication lookups
user_email_index = Index('ix_user_email', User.email, unique=True)

# Index on Task owner_user_id for faster user-scoped queries
task_owner_idx = Index('ix_task_owner_user_id', Task.owner_user_id)

# Index on Task completion status for filtering completed tasks
task_completion_idx = Index('ix_task_is_completed', Task.is_completed)

# Composite index for common query patterns (owner and completion status)
task_owner_completion_idx = Index('ix_task_owner_and_completion',
                                  Task.owner_user_id,
                                  Task.is_completed)

# Index on Task creation date for chronological ordering
task_created_idx = Index('ix_task_created_at', Task.created_at)