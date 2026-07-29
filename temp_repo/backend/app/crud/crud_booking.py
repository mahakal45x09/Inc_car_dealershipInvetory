from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.booking import Booking
from app.models.vehicle import Vehicle
from app.models.user import User
from app.schemas.booking import BookingCreate
from app.schemas.admin import DashboardStats

def get_booking(db: Session, booking_id: int) -> Optional[Booking]:
    return db.query(Booking).filter(Booking.id == booking_id).first()


def get_user_bookings(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Booking]:
    return db.query(Booking).filter(Booking.user_id == user_id).offset(skip).limit(limit).all()


def create_booking(db: Session, user_id: int, obj_in: BookingCreate) -> Booking:
    vehicle = db.query(Vehicle).filter(Vehicle.id == obj_in.vehicle_id).first()
    if not vehicle:
        raise ValueError("Vehicle not found")
    if vehicle.quantity < obj_in.quantity:
        raise ValueError("Not enough stock")
        
    vehicle.quantity -= obj_in.quantity
    
    total_price = vehicle.price * obj_in.quantity
    
    booking = Booking(
        user_id=user_id,
        vehicle_id=vehicle.id,
        quantity=obj_in.quantity,
        total_price=total_price,
        status="completed"
    )
    
    db.add(vehicle)
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def cancel_booking(db: Session, booking: Booking) -> Booking:
    if booking.status == "cancelled":
        raise ValueError("Booking already cancelled")
        
    vehicle = db.query(Vehicle).filter(Vehicle.id == booking.vehicle_id).first()
    if vehicle:
        vehicle.quantity += booking.quantity
        db.add(vehicle)
        
    booking.status = "cancelled"
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def get_all_bookings(db: Session, skip: int = 0, limit: int = 100) -> List[Booking]:
    return db.query(Booking).offset(skip).limit(limit).all()


def get_dashboard_stats(db: Session) -> DashboardStats:
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_vehicles = db.query(func.count(Vehicle.id)).scalar() or 0
    total_bookings = db.query(func.count(Booking.id)).scalar() or 0
    total_revenue = db.query(func.sum(Booking.total_price)).filter(Booking.status != "cancelled").scalar() or 0
    
    return DashboardStats(
        total_users=total_users,
        total_vehicles=total_vehicles,
        total_bookings=total_bookings,
        total_revenue=total_revenue
    )
