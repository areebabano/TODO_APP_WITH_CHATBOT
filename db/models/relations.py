"""
Database relationships between models.
"""

# This file defines relationships between different database models
# Currently, the relationship between User and Task is defined in the models themselves:
# - User.tasks (relationship to Task model)
# - Task.owner (relationship to User model)

# For more complex relationships, they would be defined here
from typing import List
from sqlmodel import Relationship

# Import models to ensure relationships are properly set up
from .user import User
from .task_model import Task

# The relationships are already defined in the individual model files:
# In User model: tasks = Relationship(back_populates="owner")
# In Task model: owner = Relationship(back_populates="tasks")