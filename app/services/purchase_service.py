import logging

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.exceptions import VehicleNotFoundException
from app.repositories.purchase_repository import PurchaseRepository
from app.schemas.purchase_schema import PurchaseRequest, PurchaseResponse

logger = logging.getLogger(__name__)


class PurchaseService:
    def __init__(self, db: Session):
        self.repository = PurchaseRepository(db)

    def purchase_vehicle(
        self, user_id: int, vehicle_id: int, request: PurchaseRequest
    ) -> PurchaseResponse:
        """
        Process a vehicle purchase safely using transactions and row-level locks.
        """
        try:
            # Lock the vehicle row to prevent concurrent negative inventory issues
            vehicle = self.repository.get_vehicle_for_update(vehicle_id)
            if not vehicle:
                logger.warning(
                    f"Vehicle {vehicle_id} not found during purchase attempt by user {user_id}"
                )
                raise VehicleNotFoundException()

            if vehicle.quantity < request.quantity:
                logger.warning(
                    f"Insufficient stock for vehicle {vehicle_id}. "
                    f"User {user_id} requested: {request.quantity}, Available: {vehicle.quantity}"
                )
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Insufficient stock available",
                )

            # Business logic calculations
            total_price = float(vehicle.price) * request.quantity
            remaining_quantity = int(vehicle.quantity) - request.quantity

            # Persist changes
            self.repository.update_vehicle_stock(vehicle, int(remaining_quantity))
            self.repository.create_purchase(
                user_id, vehicle_id, request.quantity, float(total_price)
            )
            self.repository.commit()

            logger.info(
                f"User {user_id} successfully purchased {request.quantity}x of vehicle {vehicle_id}. Total: ${total_price}"
            )
            return PurchaseResponse(
                message="Vehicle purchased successfully",
                vehicle_id=vehicle_id,
                remaining_quantity=int(remaining_quantity),
            )
        except HTTPException:
            self.repository.rollback()
            raise
        except VehicleNotFoundException:
            self.repository.rollback()
            raise
        except Exception as e:
            self.repository.rollback()
            logger.error(
                f"Unexpected error during purchase for user {user_id} on vehicle {vehicle_id}: {str(e)}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error during purchase",
            )
