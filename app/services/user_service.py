from sqlalchemy.orm import Session

from app.core.exceptions import UserAlreadyExistsException
from app.core.security import get_password_hash
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate


class UserService:
    def __init__(self, db: Session):
        self.repository = UserRepository(db)

    def register_user(self, user_in: UserCreate):
        existing_user = self.repository.get_by_email(user_in.email)
        if existing_user:
            raise UserAlreadyExistsException(email=user_in.email)

        hashed_password = get_password_hash(user_in.password)
        return self.repository.create(
            email=user_in.email, hashed_password=hashed_password
        )
