from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.purchase import PurchaseHistory
from app.models.vehicle import Vehicle

class MetricsService:
    def __init__(self, db: Session):
        self.db = db

    def get_admin_metrics(self):
        total_revenue = self.db.query(func.sum(PurchaseHistory.total_price)).scalar() or 0.0
        total_transactions = self.db.query(func.count(PurchaseHistory.id)).scalar() or 0
        total_vehicles = self.db.query(func.count(Vehicle.id)).scalar() or 0
        out_of_stock_count = self.db.query(func.count(Vehicle.id)).filter(Vehicle.quantity == 0).scalar() or 0
        
        return {
            "total_revenue": float(total_revenue),
            "total_transactions": int(total_transactions),
            "total_vehicles": int(total_vehicles),
            "out_of_stock_count": int(out_of_stock_count)
        }
