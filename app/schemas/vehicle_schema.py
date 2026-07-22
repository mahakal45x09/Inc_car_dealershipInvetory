from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class VehicleBase(BaseModel):
    make: str
    model: str
    category: str
    price: float = Field(..., gt=0, description="Price must be greater than zero")
    quantity: int = Field(..., ge=0, description="Quantity cannot be negative")
    description: Optional[str] = None
    image_url: Optional[str] = None

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, ge=0)
    description: Optional[str] = None
    image_url: Optional[str] = None

class VehicleResponse(VehicleBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
