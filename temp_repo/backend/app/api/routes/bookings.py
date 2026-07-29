from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.crud import crud_booking
from app.db.session import get_db
from app.schemas.booking import BookingCreate, BookingResponse
from app.models.user import User

router = APIRouter()


@router.post(
    "/",
    response_model=BookingResponse,
    status_code=201,
    summary="Create a new booking",
    description="Creates a new vehicle booking for the currently authenticated user. Validates available vehicle stock before confirming.",
    response_description="The newly created booking object."
)
def create_booking(
    *,
    db: Session = Depends(get_db),
    booking_in: BookingCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a new booking.
    """
    try:
        booking = crud_booking.create_booking(db, user_id=current_user.id, obj_in=booking_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return booking


@router.put(
    "/{booking_id}/cancel",
    response_model=BookingResponse,
    summary="Cancel a booking",
    description="Cancels an existing booking. Restores the vehicle stock by the booked quantity. Regular users can only cancel their own bookings, while admins can cancel any booking.",
    response_description="The cancelled booking object."
)
def cancel_booking(
    *,
    db: Session = Depends(get_db),
    booking_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Cancel an existing booking.
    """
    booking = crud_booking.get_booking(db, booking_id=booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    try:
        booking = crud_booking.cancel_booking(db, booking=booking)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return booking


@router.get(
    "/",
    response_model=List[BookingResponse],
    summary="Get user bookings history",
    description="Retrieves a paginated list of all bookings made by the currently authenticated user.",
    response_description="A list of booking objects."
)
def read_bookings(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve bookings for current user.
    """
    bookings = crud_booking.get_user_bookings(db, user_id=current_user.id, skip=skip, limit=limit)
    return bookings
