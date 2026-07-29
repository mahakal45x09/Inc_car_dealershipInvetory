from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class BookingBase(BaseModel):
    vehicle_id: int = Field(..., description="The ID of the vehicle being booked.")
    quantity: int = Field(default=1, gt=0, description="The number of units being booked.")


class BookingCreate(BookingBase):
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "vehicle_id": 1,
                    "quantity": 1
                }
            ]
        }
    )


class BookingResponse(BookingBase):
    id: int = Field(..., description="The unique database identifier for the booking.")
    user_id: int = Field(..., description="The ID of the user who made the booking.")
    total_price: Decimal = Field(..., description="The total computed price of the booking.")
    status: str = Field(..., description="The current status of the booking (e.g., 'completed', 'cancelled').")
    created_at: datetime = Field(..., description="Timestamp of when the booking was made.")

    model_config = ConfigDict(from_attributes=True)
