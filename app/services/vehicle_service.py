import logging
from sqlalchemy.orm import Session
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas.vehicle_schema import VehicleCreate, VehicleUpdate
from app.core.exceptions import VehicleNotFoundException, DuplicateVehicleException
from typing import List
from app.models.vehicle import Vehicle

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class VehicleService:
    def __init__(self, db: Session):
        self.repository = VehicleRepository(db)

    def add_vehicle(self, vehicle: VehicleCreate) -> Vehicle:
        """Add a new vehicle if it doesn't already exist."""
        if self.repository.get_by_make_model(vehicle.make, vehicle.model):
            logger.warning(f"Attempted to add duplicate vehicle: {vehicle.make} {vehicle.model}")
            raise DuplicateVehicleException()
        
        logger.info(f"Adding new vehicle: {vehicle.make} {vehicle.model}")
        return self.repository.create(vehicle)

    def list_vehicles(self) -> List[Vehicle]:
        """List all vehicles in the inventory."""
        logger.info("Fetching all vehicles")
        return self.repository.get_all()

    def get_vehicle(self, vehicle_id: int) -> Vehicle:
        """Fetch a specific vehicle by ID."""
        vehicle = self.repository.get_by_id(vehicle_id)
        if not vehicle:
            logger.warning(f"Vehicle not found with ID: {vehicle_id}")
            raise VehicleNotFoundException()
        return vehicle

    def update_vehicle(self, vehicle_id: int, vehicle_update: VehicleUpdate) -> Vehicle:
        """Update an existing vehicle."""
        vehicle = self.get_vehicle(vehicle_id)
        logger.info(f"Updating vehicle ID {vehicle_id}")
        return self.repository.update(vehicle, vehicle_update)

    def delete_vehicle(self, vehicle_id: int) -> None:
        """Delete a vehicle from the inventory."""
        vehicle = self.get_vehicle(vehicle_id)
        logger.info(f"Deleting vehicle ID {vehicle_id}")
        self.repository.delete(vehicle)
