from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship

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
