from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database.base import Base

class PurchaseHistory(Base):
    __tablename__ = "purchase_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    quantity = Column(Integer)
    total_price = Column(Float)
    purchased_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User")
    vehicle = relationship("Vehicle")
