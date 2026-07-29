from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.dependencies import get_current_user, get_db
from app.schemas.purchase_schema import PurchaseHistoryItem
from app.services.purchase_service import PurchaseService

router = APIRouter(prefix="/api/purchase", tags=["purchase_history"])

def get_purchase_service(db: Session = Depends(get_db)) -> PurchaseService:
    return PurchaseService(db)

@router.get("/history", response_model=List[PurchaseHistoryItem])
def get_user_purchase_history(
    service: PurchaseService = Depends(get_purchase_service),
    user=Depends(get_current_user),
):
    return service.get_purchase_history(user.id)
