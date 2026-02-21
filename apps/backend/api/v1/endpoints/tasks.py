"""
Task management endpoints for the API.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from uuid import UUID

from apps.backend.core.security import verify_session_token
from apps.backend.services.task_service import TaskService
from apps.backend.api.v1.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from db.session import get_session
from sqlmodel import Session

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("/", response_model=List[TaskResponse])
async def list_tasks(
    current_user_id: str = Depends(verify_session_token),
    session: Session = Depends(get_session),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
):
    return TaskService.get_tasks_by_owner(
        session=session,
        owner_user_id=current_user_id,
        skip=skip,
        limit=limit,
    )


@router.post("/", response_model=TaskResponse)
async def create_task(
    task_data: TaskCreate,
    current_user_id: str = Depends(verify_session_token),
    session: Session = Depends(get_session),
):
    return TaskService.create_task(
        session=session,
        task_data=task_data,
        owner_user_id=current_user_id,
    )


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: UUID,
    current_user_id: str = Depends(verify_session_token),
    session: Session = Depends(get_session),
):
    task = TaskService.get_task_by_id(
        session=session, task_id=task_id, owner_user_id=current_user_id
    )
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: UUID,
    task_data: TaskUpdate,
    current_user_id: str = Depends(verify_session_token),
    session: Session = Depends(get_session),
):
    updated = TaskService.update_task(
        session=session, task_id=task_id, task_data=task_data, owner_user_id=current_user_id
    )
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return updated


@router.delete("/{task_id}")
async def delete_task(
    task_id: UUID,
    current_user_id: str = Depends(verify_session_token),
    session: Session = Depends(get_session),
):
    deleted = TaskService.delete_task(
        session=session, task_id=task_id, owner_user_id=current_user_id
    )
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return {"message": "Task deleted successfully"}


@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def complete_task(
    task_id: UUID,
    current_user_id: str = Depends(verify_session_token),
    session: Session = Depends(get_session),
):
    task = TaskService.complete_task(
        session=session, task_id=task_id, owner_user_id=current_user_id
    )
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@router.patch("/{task_id}/incomplete", response_model=TaskResponse)
async def incomplete_task(
    task_id: UUID,
    current_user_id: str = Depends(verify_session_token),
    session: Session = Depends(get_session),
):
    task = TaskService.incomplete_task(
        session=session, task_id=task_id, owner_user_id=current_user_id
    )
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task
