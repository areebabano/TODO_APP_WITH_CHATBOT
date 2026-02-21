"""
Service layer for task operations with user-scoped data filtering.
"""

from typing import List, Optional
from uuid import UUID
from sqlmodel import Session, select
from datetime import datetime

from db.models.task_model import Task
from apps.backend.api.v1.schemas.task import TaskCreate, TaskUpdate, TaskResponse


class TaskService:

    @staticmethod
    def create_task(session: Session, task_data: TaskCreate, owner_user_id: str) -> TaskResponse:
        task = Task(
            title=task_data.title,
            description=task_data.description,
            is_completed=False,
            owner_user_id=owner_user_id,
        )
        session.add(task)
        session.commit()
        session.refresh(task)
        return TaskResponse.model_validate(task)

    @staticmethod
    def get_task_by_id(session: Session, task_id: UUID, owner_user_id: str) -> Optional[TaskResponse]:
        statement = select(Task).where(Task.id == task_id, Task.owner_user_id == owner_user_id)
        task = session.exec(statement).first()
        if task:
            return TaskResponse.model_validate(task)
        return None

    @staticmethod
    def get_tasks_by_owner(session: Session, owner_user_id: str, skip: int = 0, limit: int = 100) -> List[TaskResponse]:
        statement = select(Task).where(Task.owner_user_id == owner_user_id).offset(skip).limit(limit)
        tasks = session.exec(statement).all()
        return [TaskResponse.model_validate(t) for t in tasks]

    @staticmethod
    def update_task(session: Session, task_id: UUID, task_data: TaskUpdate, owner_user_id: str) -> Optional[TaskResponse]:
        statement = select(Task).where(Task.id == task_id, Task.owner_user_id == owner_user_id)
        task = session.exec(statement).first()
        if not task:
            return None

        if task_data.title is not None:
            task.title = task_data.title
        if task_data.description is not None:
            task.description = task_data.description
        if task_data.is_completed is not None:
            if task_data.is_completed and not task.is_completed:
                task.completed_at = datetime.now()
            elif not task_data.is_completed:
                task.completed_at = None
            task.is_completed = task_data.is_completed

        task.updated_at = datetime.now()
        session.add(task)
        session.commit()
        session.refresh(task)
        return TaskResponse.model_validate(task)

    @staticmethod
    def delete_task(session: Session, task_id: UUID, owner_user_id: str) -> bool:
        statement = select(Task).where(Task.id == task_id, Task.owner_user_id == owner_user_id)
        task = session.exec(statement).first()
        if not task:
            return False
        session.delete(task)
        session.commit()
        return True

    @staticmethod
    def complete_task(session: Session, task_id: UUID, owner_user_id: str) -> Optional[TaskResponse]:
        statement = select(Task).where(Task.id == task_id, Task.owner_user_id == owner_user_id)
        task = session.exec(statement).first()
        if not task:
            return None
        task.is_completed = True
        task.completed_at = datetime.now()
        task.updated_at = datetime.now()
        session.add(task)
        session.commit()
        session.refresh(task)
        return TaskResponse.model_validate(task)

    @staticmethod
    def incomplete_task(session: Session, task_id: UUID, owner_user_id: str) -> Optional[TaskResponse]:
        statement = select(Task).where(Task.id == task_id, Task.owner_user_id == owner_user_id)
        task = session.exec(statement).first()
        if not task:
            return None
        task.is_completed = False
        task.completed_at = None
        task.updated_at = datetime.now()
        session.add(task)
        session.commit()
        session.refresh(task)
        return TaskResponse.model_validate(task)
