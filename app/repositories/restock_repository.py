from sqlalchemy.orm import Session
from app.models.restock import RestockHistory
from app.models.vehicle import Vehicle
from typing import Optional

class RestockRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_vehicle_for_update(self, vehicle_id: int) -> Optional[Vehicle]:
        """Fetch a vehicle and apply a row-level lock to prevent concurrent modifications."""
        return self.db.query(Vehicle).with_for_update().filter(Vehicle.id == vehicle_id).first()

    def update_stock(self, vehicle: Vehicle, current_quantity: int) -> None:
        """Update the physical stock count of a vehicle."""
        vehicle.quantity = current_quantity
        self.db.add(vehicle)

    def create_restock_history(self, vehicle_id: int, admin_id: int, quantity: int) -> RestockHistory:
        """Log a history record of the restock event."""
        history = RestockHistory(
            vehicle_id=vehicle_id,
            admin_id=admin_id,
            quantity=quantity
        )
        self.db.add(history)
        return history

    def commit(self) -> None:
        """Commit the current database transaction."""
        self.db.commit()

    def rollback(self) -> None:
        """Rollback the current database transaction in case of error."""
        self.db.rollback()
