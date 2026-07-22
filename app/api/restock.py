from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_admin, get_db
from app.schemas.restock_schema import RestockRequest, RestockResponse
from app.services.restock_service import RestockService
from app.core.exceptions import VehicleNotFoundException

router = APIRouter(prefix="/api/vehicles", tags=["restock"])

def get_restock_service(db: Session = Depends(get_db)) -> RestockService:
    return RestockService(db)

@router.post("/{id}/restock", response_model=RestockResponse)
def restock_vehicle(
    id: int,
    request: RestockRequest,
    service: RestockService = Depends(get_restock_service),
    admin=Depends(get_current_admin)
):
    try:
        return service.restock_vehicle(admin.id, id, request)
    except VehicleNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
