from typing import Any, List
import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.api import deps
from app.crud import crud_vehicle
from app.db.session import get_db
from app.schemas.vehicle import Vehicle, VehicleCreate, VehicleUpdate
from app.models.user import User

router = APIRouter()


@router.get(
    "/",
    response_model=List[Vehicle],
    summary="List all vehicles",
    description="Retrieves a paginated list of all vehicles available in the inventory.",
    response_description="A list of vehicle objects."
)
def read_vehicles(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve vehicles.
    """
    vehicles = crud_vehicle.get_vehicles(db, skip=skip, limit=limit)
    return vehicles


@router.get(
    "/search",
    response_model=List[Vehicle],
    summary="Search for vehicles",
    description="Filters the vehicle inventory based on provided query parameters like make, model, category, and price range.",
    response_description="A list of matching vehicle objects."
)
def search_vehicles(
    db: Session = Depends(get_db),
    make: str = None,
    model: str = None,
    category: str = None,
    min_price: float = None,
    max_price: float = None,
) -> Any:
    """
    Search vehicles by various criteria.
    """
    vehicles = crud_vehicle.search_vehicles(
        db, make=make, model=model, category=category, min_price=min_price, max_price=max_price
    )
    return vehicles


@router.get(
    "/{vehicle_id}",
    response_model=Vehicle,
    summary="Get a specific vehicle",
    description="Retrieves the full details of a specific vehicle by its ID.",
    response_description="The requested vehicle object."
)
def read_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
) -> Any:
    """
    Get vehicle by ID.
    """
    vehicle = crud_vehicle.get_vehicle(db, vehicle_id=vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle


@router.post(
    "/",
    response_model=Vehicle,
    status_code=201,
    summary="Create a new vehicle",
    description="Adds a new vehicle to the inventory. Allows customers to list cars for sale.",
    response_description="The newly created vehicle object."
)
def create_vehicle(
    *,
    db: Session = Depends(get_db),
    vehicle_in: VehicleCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new vehicle.
    """
    vehicle = crud_vehicle.create_vehicle(db, obj_in=vehicle_in)
    return vehicle


@router.put(
    "/{vehicle_id}",
    response_model=Vehicle,
    summary="Update a vehicle",
    description="Modifies the details of an existing vehicle. This endpoint requires administrator privileges.",
    response_description="The updated vehicle object."
)
def update_vehicle(
    *,
    db: Session = Depends(get_db),
    vehicle_id: int,
    vehicle_in: VehicleUpdate,
    current_user: User = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Update a vehicle. Admin only.
    """
    vehicle = crud_vehicle.get_vehicle(db, vehicle_id=vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    vehicle = crud_vehicle.update_vehicle(db, db_obj=vehicle, obj_in=vehicle_in)
    return vehicle


@router.delete(
    "/{vehicle_id}",
    response_model=Vehicle,
    summary="Delete a vehicle",
    description="Removes a vehicle from the inventory. This endpoint requires administrator privileges.",
    response_description="The deleted vehicle object."
)
def delete_vehicle(
    *,
    db: Session = Depends(get_db),
    vehicle_id: int,
    current_user: User = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Delete a vehicle. Admin only.
    """
    vehicle = crud_vehicle.get_vehicle(db, vehicle_id=vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    vehicle = crud_vehicle.delete_vehicle(db, vehicle_id=vehicle_id)
    return vehicle


@router.post(
    "/{vehicle_id}/purchase",
    response_model=Vehicle,
    summary="Purchase a vehicle",
    description="Decreases the available quantity of a vehicle by 1, and records the purchase.",
    response_description="The vehicle object with its updated stock quantity."
)
def purchase_vehicle(
    *,
    db: Session = Depends(get_db),
    vehicle_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Purchase a vehicle, decreasing its quantity and recording purchase history.
    """
    vehicle = crud_vehicle.get_vehicle(db, vehicle_id=vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    try:
        vehicle = crud_vehicle.purchase_vehicle(db, vehicle=vehicle, quantity=1)
        # Record the purchase
        from app.crud.crud_purchase import create_purchase
        from app.schemas.purchase import PurchaseCreate
        create_purchase(db, PurchaseCreate(user_id=current_user.id, vehicle_id=vehicle.id, price=vehicle.price))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return vehicle


@router.post(
    "/{vehicle_id}/restock",
    response_model=Vehicle,
    summary="Restock a vehicle",
    description="Increases the available quantity of a vehicle by the specified amount. This endpoint requires administrator privileges.",
    response_description="The vehicle object with its updated stock quantity."
)
def restock_vehicle(
    *,
    db: Session = Depends(get_db),
    vehicle_id: int,
    quantity: int,
    current_user: User = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Restock a vehicle, increasing its quantity. Admin only.
    """
    vehicle = crud_vehicle.get_vehicle(db, vehicle_id=vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    try:
        vehicle = crud_vehicle.restock_vehicle(db, vehicle=vehicle, quantity=quantity)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return vehicle


@router.post(
    "/{vehicle_id}/image",
    response_model=Vehicle,
    summary="Upload a vehicle image",
    description="Uploads and saves a new image for a vehicle. The image is saved locally and its path is added to the vehicle model.",
    response_description="The vehicle object containing the newly generated image URL."
)
async def upload_vehicle_image(
    *,
    db: Session = Depends(get_db),
    vehicle_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload an image for a vehicle.
    """
    vehicle = crud_vehicle.get_vehicle(db, vehicle_id=vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    # Generate unique filename
    file_ext = os.path.splitext(file.filename)[1] if file.filename else ""
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join("static", "uploads", "vehicles", unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
        
    # Update vehicle
    image_url = f"/static/uploads/vehicles/{unique_filename}"
    vehicle = crud_vehicle.update_vehicle_image(db, vehicle=vehicle, image_url=image_url)
    return vehicle
