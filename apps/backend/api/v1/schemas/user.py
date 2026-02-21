"""
User-related Pydantic models for request/response validation.
"""

from pydantic import BaseModel, EmailStr, validator
from datetime import datetime
from typing import Optional
from uuid import UUID


class UserBase(BaseModel):
    """
    Base model for user with common fields.
    """
    email: EmailStr
    name: Optional[str] = None

    @validator('name')
    def validate_name(cls, v):
        if v is not None:
            if len(v.strip()) == 0:
                raise ValueError('Name cannot be empty')
            if len(v) > 100:
                raise ValueError('Name must be less than 100 characters')
            return v.strip()
        return v


class UserCreate(UserBase):
    """
    Model for creating a new user.
    """
    password: str

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        # Add more complex password validation if needed
        # e.g., at least one uppercase, lowercase, digit, special char
        return v


class UserUpdate(BaseModel):
    """
    Model for updating user information.
    """
    name: Optional[str] = None
    email: Optional[EmailStr] = None

    @validator('name')
    def validate_optional_name(cls, v):
        if v is not None:
            if len(v.strip()) == 0:
                raise ValueError('Name cannot be empty')
            if len(v) > 100:
                raise ValueError('Name must be less than 100 characters')
            return v.strip()
        return v


class UserPublic(UserBase):
    """
    Public representation of a user (without sensitive data).
    """
    id: UUID
    created_at: datetime
    updated_at: datetime
    is_active: bool = True

    class Config:
        from_attributes = True


class UserPrivate(UserPublic):
    """
    Private representation of a user (includes sensitive data as needed for internal use).
    """
    # Note: This model should NOT be used for public API responses
    # as it could expose sensitive information
    pass