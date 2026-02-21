"""
Authentication endpoints - Better Auth handles signup/login.
Only /me endpoint remains here.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, text

from apps.backend.core.security import verify_session_token
from db.session import get_session

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/me")
async def get_current_user(
    current_user_id: str = Depends(verify_session_token),
    session: Session = Depends(get_session),
):
    """Get the current authenticated user's information from Better Auth user table."""
    result = session.exec(
        text('SELECT "id", "email", "name", "createdAt", "updatedAt" FROM "user" WHERE "id" = :uid'),
        params={"uid": current_user_id},
    ).first()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return {
        "id": result[0],
        "email": result[1],
        "name": result[2],
        "createdAt": str(result[3]) if result[3] else None,
        "updatedAt": str(result[4]) if result[4] else None,
    }
