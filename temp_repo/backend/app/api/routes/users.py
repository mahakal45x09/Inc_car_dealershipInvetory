from typing import Any
from fastapi import APIRouter, Depends
from app.api import deps
from app.models.user import User
from app.schemas.user import UserRead

router = APIRouter()

@router.get(
    "/me",
    response_model=UserRead,
    summary="Get current user",
    description="Retrieves the profile information of the currently authenticated user based on the provided access token.",
    response_description="The user's profile details."
)
def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user
