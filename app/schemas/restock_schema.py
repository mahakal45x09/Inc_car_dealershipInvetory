from pydantic import BaseModel, Field

class RestockRequest(BaseModel):
    quantity: int = Field(..., gt=0, description="Restock quantity must be positive")

class RestockResponse(BaseModel):
    message: str
    vehicle_id: int
    added_quantity: int
    current_quantity: int
