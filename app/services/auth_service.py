from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.schemas.auth_schema import LoginRequest
from app.core.security import verify_password
from app.core.jwt import create_access_token
from app.core.exceptions import InvalidCredentialsException
from typing import Dict

class AuthService:
    """Service layer handling authentication business logic."""

    def __init__(self, db: Session):
        """Initialize the AuthService with a database session."""
        self.user_repo = UserRepository(db)

    def login_user(self, login_data: LoginRequest) -> Dict[str, str]:
        """
        Authenticate a user and return a JWT access token.
        
        Args:
            login_data: The user's login credentials.
            
        Returns:
            A dictionary containing the access token and token type.
            
        Raises:
            InvalidCredentialsException: If the email is not found or password does not match.
        """
        user = self.user_repo.get_by_email(login_data.email)
        if not user:
            raise InvalidCredentialsException()
        
        if not verify_password(login_data.password, user.hashed_password):
            raise InvalidCredentialsException()
        
        access_token = create_access_token(data={"sub": str(user.id)})
        return {"access_token": access_token, "token_type": "bearer"}
