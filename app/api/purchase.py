from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user, get_db
from app.schemas.purchase_schema import PurchaseRequest, PurchaseResponse
from app.services.purchase_service import PurchaseService
from app.core.exceptions import VehicleNotFoundException

router = APIRouter(prefix="/api/vehicles", tags=["purchase"])

def get_purchase_service(db: Session = Depends(get_db)) -> PurchaseService:
    return PurchaseService(db)

@router.post("/{id}/purchase", response_model=PurchaseResponse)
def purchase_vehicle(
    id: int,
    request: PurchaseRequest,
    service: PurchaseService = Depends(get_purchase_service),
    user=Depends(get_current_user)
):
    try:
        return service.purchase_vehicle(user.id, id, request)
    except VehicleNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
