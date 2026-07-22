import logging

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import ExpiredSignatureError, JWTError
from sqlalchemy.orm import Session

from app.core.jwt import verify_access_token
from app.core.roles import Role
from app.services.vehicle_service import VehicleService
from app.database.database import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository

logger = logging.getLogger(__name__)

security = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """
    Dependency to get the current authenticated user.
    Validates the Bearer token, extracts the role, and retrieves the user.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = verify_access_token(credentials.credentials)
        user_id = payload.get("sub")
        role = payload.get("role")

        if user_id is None or role is None:
            logger.warning("JWT is missing required claims (sub or role)")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token claims",
                headers={"WWW-Authenticate": "Bearer"},
            )

    except ExpiredSignatureError:
        logger.warning("Expired JWT token used")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError as e:
        logger.warning(f"Invalid JWT token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_repo = UserRepository(db)
    user = user_repo.get_by_id(int(user_id))

    if user is None:
        logger.warning(f"Authenticated user ID {user_id} not found in database")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Attach JWT role to the user object for the RoleChecker
    user.jwt_role = role
    return user


class RoleChecker:
    """Reusable dependency class for Role-Based Access Control."""

    def __init__(self, allowed_roles: list[Role]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        if current_user.jwt_role not in [r.value for r in self.allowed_roles]:
            logger.warning(
                f"Authorization failed: User {current_user.id} has role '{current_user.jwt_role}', "
                f"but route requires one of {[r.value for r in self.allowed_roles]}."
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
            )
        return current_user


get_current_admin = RoleChecker([Role.ADMIN])


def get_vehicle_service(db: Session = Depends(get_db)) -> VehicleService:
    """Dependency to inject the VehicleService."""
    return VehicleService(db)
