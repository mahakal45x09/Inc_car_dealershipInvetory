from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.exceptions import (InvalidCredentialsException,
                                 UserAlreadyExistsException)
from app.database.database import get_db
from app.schemas.auth_schema import LoginRequest
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import AuthService
from app.services.user_service import UserService

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login")
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user and return a JWT token."""
    auth_service = AuthService(db)
    try:
        return auth_service.login_user(login_data)
    except InvalidCredentialsException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
def register_user_endpoint(user_in: UserCreate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    try:
        return user_service.register_user(user_in)
    except UserAlreadyExistsException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )
