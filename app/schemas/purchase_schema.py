from pydantic import BaseModel, Field

class PurchaseRequest(BaseModel):
    quantity: int = Field(..., gt=0, description="Quantity must be greater than zero")

class PurchaseResponse(BaseModel):
    message: str
    vehicle_id: int
    remaining_quantity: int
