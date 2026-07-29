from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder

from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleUpdate


def get_vehicle(db: Session, vehicle_id: int) -> Optional[Vehicle]:
    return db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()


def get_vehicles(db: Session, skip: int = 0, limit: int = 100) -> List[Vehicle]:
    return db.query(Vehicle).offset(skip).limit(limit).all()


def create_vehicle(db: Session, obj_in: VehicleCreate) -> Vehicle:
    obj_in_data = jsonable_encoder(obj_in)
    db_obj = Vehicle(**obj_in_data)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_vehicle(db: Session, db_obj: Vehicle, obj_in: VehicleUpdate) -> Vehicle:
    obj_data = jsonable_encoder(db_obj)
    update_data = obj_in.model_dump(exclude_unset=True)
    for field in obj_data:
        if field in update_data:
            setattr(db_obj, field, update_data[field])
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_vehicle(db: Session, vehicle_id: int) -> Optional[Vehicle]:
    obj = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if obj:
        db.delete(obj)
        db.commit()
    return obj


def search_vehicles(
    db: Session, 
    make: Optional[str] = None, 
    model: Optional[str] = None, 
    category: Optional[str] = None, 
    min_price: Optional[float] = None, 
    max_price: Optional[float] = None,
) -> List[Vehicle]:
    query = db.query(Vehicle)
    if make:
        query = query.filter(Vehicle.make.ilike(f"%{make}%"))
    if model:
        query = query.filter(Vehicle.model.ilike(f"%{model}%"))
    if category:
        query = query.filter(Vehicle.category.ilike(f"%{category}%"))
    if min_price is not None:
        query = query.filter(Vehicle.price >= min_price)
    if max_price is not None:
        query = query.filter(Vehicle.price <= max_price)
    return query.all()


def purchase_vehicle(db: Session, vehicle: Vehicle, quantity: int = 1) -> Vehicle:
    if vehicle.quantity < quantity:
        raise ValueError("Not enough stock")
    vehicle.quantity -= quantity
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


def restock_vehicle(db: Session, vehicle: Vehicle, quantity: int) -> Vehicle:
    if quantity <= 0:
        raise ValueError("Quantity must be positive")
    vehicle.quantity += quantity
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


def update_vehicle_image(db: Session, vehicle: Vehicle, image_url: str) -> Vehicle:
    vehicle.image_url = image_url
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle
