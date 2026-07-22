from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database.base import Base

class RestockHistory(Base):
    __tablename__ = "restock_history"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    admin_id = Column(Integer, ForeignKey("users.id"))
    quantity = Column(Integer)
    restocked_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    vehicle = relationship("Vehicle")
    admin = relationship("User")
