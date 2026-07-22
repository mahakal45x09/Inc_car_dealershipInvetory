from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle
from app.schemas.vehicle_schema import VehicleCreate, VehicleUpdate


class VehicleRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_make_model(self, make: str, model: str) -> Optional[Vehicle]:
        """Fetch a vehicle by its exact make and model."""
        return (
            self.db.query(Vehicle)
            .filter(Vehicle.make == make, Vehicle.model == model)
            .first()
        )

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

    def search_vehicles(
        self,
        make: Optional[str] = None,
        model: Optional[str] = None,
        category: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        available: Optional[bool] = None,
    ) -> List[Vehicle]:
        """Search vehicles by optional filters dynamically."""
        filters = []
        if make:
            filters.append(Vehicle.make.ilike(f"%{make}%"))  # type: ignore[arg-type]
        if model:
            filters.append(Vehicle.model.ilike(f"%{model}%"))  # type: ignore[arg-type]
        if category:
            filters.append(Vehicle.category.ilike(f"%{category}%"))  # type: ignore[arg-type]
        if min_price is not None:
            filters.append(Vehicle.price >= min_price)  # type: ignore[arg-type]
        if max_price is not None:
            filters.append(Vehicle.price <= max_price)  # type: ignore[arg-type]
        if available:
            filters.append(Vehicle.quantity > 0)  # type: ignore[arg-type]

        return self.db.query(Vehicle).filter(*filters).all()

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
