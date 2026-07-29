from pydantic import BaseModel, Field


class PurchaseRequest(BaseModel):
    quantity: int = Field(..., gt=0, description="Quantity must be greater than zero")


class PurchaseResponse(BaseModel):
    message: str
    vehicle_id: int
    remaining_quantity: int


class VehicleBase(BaseModel):
    make: str
    model: str
    category: str


class PurchaseHistoryItem(BaseModel):
    id: int
    vehicle_id: int
    quantity: int
    total_price: float
    vehicle: VehicleBase

    class Config:
        from_attributes = True
