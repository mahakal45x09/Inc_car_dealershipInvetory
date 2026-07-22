from sqlalchemy.orm import Session
from app.models.vehicle import Vehicle
from app.schemas.vehicle_schema import VehicleCreate, VehicleUpdate
from typing import List, Optional

class VehicleRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_make_model(self, make: str, model: str) -> Optional[Vehicle]:
        """Fetch a vehicle by its exact make and model."""
        return self.db.query(Vehicle).filter(Vehicle.make == make, Vehicle.model == model).first()

    def create(self, vehicle: VehicleCreate) -> Vehicle:
        """Insert a new vehicle into the database."""
        db_vehicle = Vehicle(**vehicle.model_dump())
        self.db.add(db_vehicle)
        self.db.commit()
        self.db.refresh(db_vehicle)
        return db_vehicle

    def get_all(self) -> List[Vehicle]:
        """Retrieve all vehicles."""
        return self.db.query(Vehicle).all()

    def get_by_id(self, vehicle_id: int) -> Optional[Vehicle]:
        """Fetch a vehicle by its primary key."""
        return self.db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    def update(self, vehicle: Vehicle, vehicle_update: VehicleUpdate) -> Vehicle:
        """Update fields on an existing vehicle."""
        update_data = vehicle_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(vehicle, key, value)
        self.db.commit()
        self.db.refresh(vehicle)
        return vehicle

    def delete(self, vehicle: Vehicle) -> None:
        """Remove a vehicle from the database."""
        self.db.delete(vehicle)
        self.db.commit()
