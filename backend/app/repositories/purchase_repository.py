from typing import Optional

from sqlalchemy.orm import Session

from app.models.purchase import PurchaseHistory
from app.models.vehicle import Vehicle


class PurchaseRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_vehicle_for_update(self, vehicle_id: int) -> Optional[Vehicle]:
        """Fetch a vehicle and lock the row to prevent concurrent stock modifications."""
        return (
            self.db.query(Vehicle)
            .with_for_update()
            .filter(Vehicle.id == vehicle_id)
            .first()
        )

    def get_vehicle(self, vehicle_id: int) -> Optional[Vehicle]:
        """Fetch a vehicle by ID without locking."""
        return self.db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    def create_purchase(
        self, user_id: int, vehicle_id: int, quantity: int, total_price: float
    ) -> PurchaseHistory:
        """Create a new purchase history record."""
        purchase = PurchaseHistory(
            user_id=user_id,
            vehicle_id=vehicle_id,
            quantity=quantity,
            total_price=total_price,
        )
        self.db.add(purchase)
        return purchase

    def update_vehicle_stock(self, vehicle: Vehicle, remaining_quantity: int) -> None:
        """Update the quantity of a vehicle."""
        vehicle.quantity = remaining_quantity  # type: ignore[assignment]
        self.db.add(vehicle)

    def commit(self) -> None:
        """Commit the current database transaction."""
        self.db.commit()

    def rollback(self) -> None:
        """Rollback the current database transaction."""
        self.db.rollback()

    def get_history_by_user(self, user_id: int) -> list[PurchaseHistory]:
        """Get purchase history for a specific user."""
        from sqlalchemy.orm import joinedload

        return (
            self.db.query(PurchaseHistory)
            .options(joinedload(PurchaseHistory.vehicle))
            .filter(PurchaseHistory.user_id == user_id)
            .order_by(PurchaseHistory.id.desc())
            .all()
        )
