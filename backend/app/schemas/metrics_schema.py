from pydantic import BaseModel
from typing import List, Optional

class AdminMetricsResponse(BaseModel):
    total_revenue: float
    total_transactions: int
    total_vehicles: int
    out_of_stock_count: int
