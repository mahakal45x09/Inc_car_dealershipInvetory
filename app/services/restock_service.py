from sqlalchemy.orm import Session
from app.repositories.restock_repository import RestockRepository
from app.schemas.restock_schema import RestockRequest, RestockResponse
from app.core.exceptions import VehicleNotFoundException
from fastapi import HTTPException, status
import logging

logger = logging.getLogger(__name__)

class RestockService:
    def __init__(self, db: Session):
        self.repository = RestockRepository(db)

    def restock_vehicle(self, admin_id: int, vehicle_id: int, request: RestockRequest) -> RestockResponse:
        """
        Process a vehicle restock safely using transactions and row-level locks.
        Guarantees atomicity when admins update the stock.
        """
        try:
            # Lock the vehicle row to prevent concurrent stock issues
            vehicle = self.repository.get_vehicle_for_update(vehicle_id)
            if not vehicle:
                logger.warning(f"Vehicle {vehicle_id} not found during restock attempt by admin {admin_id}")
                raise VehicleNotFoundException()

            if request.quantity <= 0:
                logger.warning(f"Admin {admin_id} attempted to restock vehicle {vehicle_id} with invalid quantity: {request.quantity}")
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, 
                    detail="Restock quantity must be greater than zero"
                )

            current_quantity = vehicle.quantity + request.quantity
            
            # Atomic save
            self.repository.update_stock(vehicle, current_quantity)
            self.repository.create_restock_history(vehicle_id, admin_id, request.quantity)
            self.repository.commit()
            
            logger.info(f"Admin {admin_id} successfully restocked vehicle {vehicle_id} by {request.quantity} units. Total stock is now {current_quantity}.")

            return RestockResponse(
                message="Vehicle restocked successfully",
                vehicle_id=vehicle_id,
                added_quantity=request.quantity,
                current_quantity=current_quantity
            )
        except HTTPException:
            self.repository.rollback()
            raise
        except VehicleNotFoundException:
            self.repository.rollback()
            raise
        except Exception as e:
            self.repository.rollback()
            logger.error(f"Unexpected error during restock by admin {admin_id} on vehicle {vehicle_id}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail="Internal server error during restock"
            )
