from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.crud import crud_user, crud_booking
from app.db.session import get_db
from app.schemas.user import UserRead, UserUpdate
from app.schemas.booking import BookingResponse
from app.schemas.admin import DashboardStats
from app.models.user import User

router = APIRouter()


@router.get(
    "/stats",
    response_model=DashboardStats,
    summary="Get dashboard statistics",
    description="Calculates and returns aggregated platform metrics including total users, vehicles, bookings, and active revenue. Requires administrator privileges.",
    response_description="A dashboard statistics object."
)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Get dashboard statistics. Admin only.
    """
    stats = crud_booking.get_dashboard_stats(db)
    return stats


@router.get(
    "/users",
    response_model=List[UserRead],
    summary="List all users",
    description="Retrieves a paginated list of all users registered on the platform. Requires administrator privileges.",
    response_description="A list of user objects."
)
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Retrieve all users. Admin only.
    """
    users = crud_user.get_users(db, skip=skip, limit=limit)
    return users


@router.put(
    "/users/{user_id}",
    response_model=UserRead,
    summary="Update a user",
    description="Allows administrators to update any user's profile, including granting or revoking administrative privileges.",
    response_description="The updated user object."
)
def update_user(
    *,
    db: Session = Depends(get_db),
    user_id: int,
    user_in: UserUpdate,
    current_user: User = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Update a user. Admin only.
    """
    user = crud_user.get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user = crud_user.update_user(db, db_obj=user, obj_in=user_in)
    return user


@router.get(
    "/bookings",
    response_model=List[BookingResponse],
    summary="List all platform bookings",
    description="Retrieves a paginated list of all bookings across the entire platform. Requires administrator privileges.",
    response_description="A list of all booking objects."
)
def read_all_bookings(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Retrieve all bookings across the platform. Admin only.
    """
    bookings = crud_booking.get_all_bookings(db, skip=skip, limit=limit)
    return bookings


@router.get(
    "/purchases",
    summary="List all platform purchases",
    description="Retrieves a paginated list of all vehicle purchases across the entire platform. Requires administrator privileges.",
    response_description="A list of all purchase objects."
)
def read_all_purchases(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Retrieve all purchases across the platform. Admin only.
    """
    from app.crud.crud_purchase import get_purchases
    purchases = get_purchases(db, skip=skip, limit=limit)
    return purchases

