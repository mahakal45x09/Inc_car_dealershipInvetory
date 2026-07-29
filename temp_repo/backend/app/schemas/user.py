from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserBase(BaseModel):
    email: EmailStr = Field(..., description="The user's email address which serves as their username.")
    full_name: Optional[str] = Field(None, max_length=150, description="The user's full name.")
    is_active: Optional[bool] = Field(True, description="Whether the user account is active and can login.")
    is_admin: Optional[bool] = Field(False, description="Whether the user has administrative privileges.")


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters long")
    
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "email": "user@example.com",
                    "full_name": "John Doe",
                    "password": "securepassword123",
                    "is_active": True,
                    "is_admin": False
                }
            ]
        }
    )


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = Field(None, description="Updated email address.")
    full_name: Optional[str] = Field(None, max_length=150, description="Updated full name.")
    password: Optional[str] = Field(None, min_length=6, description="Updated password (min 6 chars).")
    is_active: Optional[bool] = Field(None, description="Update active status.")
    is_admin: Optional[bool] = Field(None, description="Update admin privileges.")


class UserRead(UserBase):
    id: int = Field(..., description="The unique database identifier for the user.")
    created_at: datetime = Field(..., description="Timestamp of when the user was created.")
    updated_at: datetime = Field(..., description="Timestamp of when the user was last updated.")

    model_config = ConfigDict(from_attributes=True)
