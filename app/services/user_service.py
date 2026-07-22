from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

class UserService:
    def __init__(self, db: Session):
        self.repository = UserRepository(db)

    def register_user(self, user_in: UserCreate):
        existing_user = self.repository.get_user_by_email(user_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        hashed_password = get_password_hash(user_in.password)
        return self.repository.create_user(
            email=user_in.email,
            hashed_password=hashed_password
        )
