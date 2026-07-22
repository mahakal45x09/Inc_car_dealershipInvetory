from fastapi import APIRouter, Depends, status, HTTPException
from typing import List
from app.core.dependencies import get_current_user, get_current_admin, get_vehicle_service
from app.schemas.vehicle_schema import VehicleCreate, VehicleUpdate, VehicleResponse
from app.services.vehicle_service import VehicleService
from app.core.exceptions import VehicleNotFoundException, DuplicateVehicleException

router = APIRouter(
    prefix="/api/vehicles",
    tags=["vehicles"]
)

@router.post("", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def add_vehicle(
    vehicle: VehicleCreate, 
    service: VehicleService = Depends(get_vehicle_service), 
    admin=Depends(get_current_admin)
):
    """Add a new vehicle to the inventory. Admin only."""
    try:
        return service.add_vehicle(vehicle)
    except DuplicateVehicleException as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("", response_model=List[VehicleResponse])
def get_vehicles(
    service: VehicleService = Depends(get_vehicle_service), 
    user=Depends(get_current_user)
):
    """Get all vehicles. Requires authentication."""
    return service.list_vehicles()

@router.get("/{id}", response_model=VehicleResponse)
def get_vehicle(
    id: int, 
    service: VehicleService = Depends(get_vehicle_service), 
    user=Depends(get_current_user)
):
    """Get a specific vehicle by ID. Requires authentication."""
    try:
        return service.get_vehicle(id)
    except VehicleNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/{id}", response_model=VehicleResponse)
def update_vehicle(
    id: int, 
    vehicle: VehicleUpdate, 
    service: VehicleService = Depends(get_vehicle_service), 
    admin=Depends(get_current_admin)
):
    """Update a specific vehicle. Admin only."""
    try:
        return service.update_vehicle(id, vehicle)
    except VehicleNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle(
    id: int, 
    service: VehicleService = Depends(get_vehicle_service), 
    admin=Depends(get_current_admin)
):
    """Delete a specific vehicle. Admin only."""
    try:
        service.delete_vehicle(id)
    except VehicleNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
