from decimal import Decimal
from pydantic import BaseModel, Field

class DashboardStats(BaseModel):
    total_users: int = Field(..., description="Total number of registered users on the platform.")
    total_vehicles: int = Field(..., description="Total number of unique vehicles in the inventory.")
    total_bookings: int = Field(..., description="Total number of bookings made.")
    total_revenue: Decimal = Field(..., description="Total revenue generated from active (non-cancelled) bookings.")
