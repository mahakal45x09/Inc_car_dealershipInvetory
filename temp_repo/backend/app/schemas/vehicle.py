from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class VehicleBase(BaseModel):
    make: str = Field(..., max_length=100, description="The manufacturer of the vehicle (e.g., Toyota).")
    model: str = Field(..., max_length=100, description="The model name of the vehicle (e.g., Camry).")
    category: str = Field(..., max_length=50, description="The category or type of vehicle (e.g., Sedan, SUV).")
    price: Decimal = Field(..., max_digits=12, decimal_places=2, gt=0, description="The base price of the vehicle.")
    quantity: int = Field(default=1, ge=0, description="The number of vehicles available in stock.")
    year: Optional[int] = Field(None, ge=1886, description="The manufacturing year of the vehicle.")
    description: Optional[str] = Field(None, description="Detailed description of the vehicle.")
    image_url: Optional[str] = Field(None, max_length=500, description="URL pointing to the vehicle's image.")


class VehicleCreate(VehicleBase):
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "make": "Toyota",
                    "model": "Camry",
                    "category": "Sedan",
                    "price": 25000.00,
                    "quantity": 5,
                    "year": 2023,
                    "description": "A reliable mid-size sedan.",
                    "image_url": "/static/uploads/vehicles/default.png"
                }
            ]
        }
    )


class VehicleUpdate(BaseModel):
    make: Optional[str] = Field(None, max_length=100)
    model: Optional[str] = Field(None, max_length=100)
    category: Optional[str] = Field(None, max_length=50)
    price: Optional[Decimal] = Field(None, max_digits=12, decimal_places=2)
    quantity: Optional[int] = Field(None, ge=0)
    year: Optional[int] = None
    description: Optional[str] = None
    image_url: Optional[str] = Field(None, max_length=500)


class VehicleInDBBase(VehicleBase):
    id: int = Field(..., description="The unique database identifier for the vehicle.")
    created_at: datetime = Field(..., description="Timestamp of when the vehicle was added to the inventory.")
    updated_at: datetime = Field(..., description="Timestamp of when the vehicle was last updated.")

    model_config = ConfigDict(from_attributes=True)


class Vehicle(VehicleInDBBase):
    pass
