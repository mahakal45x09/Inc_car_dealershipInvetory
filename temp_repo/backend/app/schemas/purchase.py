from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from typing import Optional
from app.schemas.vehicle import Vehicle
from app.schemas.user import UserRead

class PurchaseBase(BaseModel):
    vehicle_id: int
    price: Decimal

class PurchaseCreate(PurchaseBase):
    user_id: int

class PurchaseResponse(PurchaseBase):
    id: int
    user_id: int
    purchase_date: datetime
    user: Optional[UserRead] = None
    vehicle: Optional[Vehicle] = None

    class Config:
        from_attributes = True
