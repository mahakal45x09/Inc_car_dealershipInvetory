from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.roles import Role
from app.models.user import User


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> Optional[User]:
        if not email:
            return None
        return (
            self.db.query(User)
            .filter(func.lower(User.email) == email.lower().strip())
            .first()
        )

    def create(self, email: str, hashed_password: str) -> User:
        clean_email = email.lower().strip()
        role = (
            Role.ADMIN.value
            if clean_email in ["admin@example.com", "admin@dealership.com"]
            else Role.USER.value
        )
        db_user = User(email=clean_email, hashed_password=hashed_password, role=role)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
