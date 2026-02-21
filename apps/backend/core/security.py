"""
Session-based authentication via Better Auth session table lookup.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, text

from db.session import get_session

security = HTTPBearer()


def verify_session_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session),
) -> str:
    """
    Verify a Better Auth session token by querying the session table.

    Returns the user_id (str) from the session row.
    """
    token = credentials.credentials

    result = session.exec(
        text("SELECT \"userId\" FROM \"session\" WHERE \"token\" = :token AND \"expiresAt\" > now()"),
        params={"token": token},
    ).first()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return result[0]
